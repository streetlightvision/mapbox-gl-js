'use strict';

module.exports = Quadrant;

var PointGroup = require('../slv/point_group');

function Quadrant(row, col, map, lngDivisions, latDivisions) {
    this.row = row;
    this.col = col;
    this.markersPerQuadrant = 16383;

    this.map = map;
    this.needsRefresh = false;

    this.customBufferManager = map.customBufferManager;

    this.currentStaticGroup = 0;
    this.staticGroups = [new PointGroup(this.customBufferManager, this)];

    this.lngDivisions = lngDivisions;
    this.latDivisions = latDivisions;
}

Quadrant.findQuadrant = function (lng, lat, incX, incY) {
    return {
        col: Math.floor((lng + 180) / incX),
        row: Math.floor((90 - lat) / incY)
    };
};


Quadrant.prototype.addStaticGroup = function () {
    this.staticGroups.push(new PointGroup(this.customBufferManager, this));
    this.currentStaticGroup++;
    this.map._render();
};

Quadrant.prototype.addMarker = function (marker) {
    if (this.staticGroups[this.currentStaticGroup].markers.length === this.markersPerQuadrant) {
        this.staticGroups[this.currentStaticGroup].buildBuffer();
        this.addStaticGroup();
    }

    marker.groupIndex = this.currentStaticGroup;
    this.staticGroups[this.currentStaticGroup].addMarker(marker);
};

Quadrant.prototype.finishedLoading = function() {
    if (this.staticGroups[this.currentStaticGroup].markers.length > 0) {
        this.staticGroups[this.currentStaticGroup].buildBuffer();
        this.addStaticGroup();
    }
};

Quadrant.prototype.selectMarker = function(marker) {
    var changed = this.staticGroups[marker.groupIndex].selectMarker(marker);
    if (changed === true) {
        this.needsRefresh = true;
    }
    return changed;
};

Quadrant.prototype.unselectMarker = function(marker) {
    var changed = this.staticGroups[marker.groupIndex].unselectMarker(marker);
    if (changed === true) {
        this.needsRefresh = true;
    }
    return changed;
};

Quadrant.prototype.refreshIfNeeded = function() {
    if (this.needsRefresh === true) {
        var refresh = false;
        for (var i = 0; i < this.staticGroups.length; i++) {
            if (this.staticGroups[i].refreshIfNeeded() === true) {
                refresh = true;
            }
        }
        this.needsRefresh = false;
        return refresh;
    } else {
        return false;
    }
};
