module.exports = Quadrant;

var PointGroup = require('../slv/point_group');

function Quadrant(row, col, map, lngDivisions, latDivisions) {
	this.row = row;
	this.col = col;
	this.devicesPerQuadrant = 16383;

	this.currentStaticGroup = 0;
	this.map = map;
	this.customBufferManager = map.customBufferManager;
	this.staticGroups = [new PointGroup(this.customBufferManager, this)];
	this.lngDivisions = lngDivisions;
	this.latDivisions = latDivisions;
};

Quadrant.findQuadrant = function (lng, lat, incX, incY) {
    return {
        col: Math.floor((lng + 180) / incX),
        row: Math.floor((90-lat) / incY)
    }
};

Quadrant.prototype.addStaticGroup = function () {
	this.staticGroups.push(new PointGroup(this.customBufferManager, this));
	this.currentStaticGroup++;
	this.map._render();
};

Quadrant.prototype.addDevice = function (device) {
	if (this.staticGroups[this.currentStaticGroup].devices.length == this.devicesPerQuadrant) {
		this.staticGroups[this.currentStaticGroup].buildBuffer();
		this.addStaticGroup();
	}

	device.bufferIndex = this.currentStaticGroup;
	this.staticGroups[this.currentStaticGroup].addDevice(device);
};

Quadrant.prototype.finishedLoading = function(args) {
	if (this.staticGroups[this.currentStaticGroup].devices.length > 0) {
		this.staticGroups[this.currentStaticGroup].buildBuffer();
		this.addStaticGroup();
	}
};