'use strict';

module.exports = PointGroup;

function PointGroup(customBufferManager, quadrant) {
	this.index = 0;
	this.devices = [];
	this.quadrant = quadrant;
	this.customBufferManager = customBufferManager;
};

PointGroup.prototype.buildBuffer = function () {
	this.buffer = this.customBufferManager.createStaticBufferWithPoints(this.devices, this.quadrant);
};

PointGroup.prototype.addDevice = function (device) {
	this.devices.push(device);
    device.index = this.index++;
};
