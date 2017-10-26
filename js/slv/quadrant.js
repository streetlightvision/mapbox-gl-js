'use strict';

module.exports = Quadrant;

var PointGroup = require('../slv/point_group');

function Quadrant(id, row, col, map, lngDivisions, latDivisions) {
    this.id = id;
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
    lng = lng % 360; // first ensure to be in [0:360]
    if (lng > 180) { // then make it in [-180:180]
        lng -= 360;
    }
    else if (lng < -180) {
        lng += 360;
    }
    
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
    marker.quadrant = this.id;
    this.staticGroups[this.currentStaticGroup].addMarker(marker);
};

Quadrant.prototype.removeMarker = function (marker) {
    for (var i = 0; i < this.staticGroups.length; i++) {
        if (this.staticGroups[i].findMarker(marker) === true) {
            if (marker.quadrant) delete marker.quadrant;
            this.staticGroups[i].removeMarker(marker);
            return true;
        }
    }
    return false;
};

Quadrant.prototype.updateMarkerSprite = function (marker, sprite) {
    for (var i = 0; i < this.staticGroups.length; i++) {
        if (this.staticGroups[i].findMarker(marker) === true) {
            this.staticGroups[i].updateMarkerSprite(marker, sprite);
            return true;
        }
    }
    return false;
};

Quadrant.prototype.buildBuffers = function() {
    if (this.staticGroups[this.currentStaticGroup].markers.length > 0) {
        this.staticGroups[this.currentStaticGroup].buildBuffer();
        this.addStaticGroup();
    }
};

Quadrant.prototype.rebuildBuffers = function() {
    for (var i = 0; i < this.staticGroups.length; i++) {
        this.staticGroups[i].rebuild();
    }
};

Quadrant.prototype.selectMarker = function(marker) {
    var changed = false;
    if (marker.groupIndex !== undefined) {
        changed = this.staticGroups[marker.groupIndex].selectMarker(marker);
        if (changed === true) {
            this.needsRefresh = true;
        }
    }
    return changed;
};

Quadrant.prototype.unselectMarker = function(marker) {
    var changed = false;
    if (marker.groupIndex !== undefined) {
        var changed = this.staticGroups[marker.groupIndex].unselectMarker(marker);
        if (changed === true) {
            this.needsRefresh = true;
        }
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

Quadrant.prototype.resetBuffers = function() {
    for (var i = 0; i < this.staticGroups.length; i++) {
        this.staticGroups[i].clear();
        delete this.staticGroups[i];
    }
    this.staticGroups = [new PointGroup(this.customBufferManager, this)];
    this.currentStaticGroup = 0;
};

Quadrant.prototype.rebuild = function() {
    for (var i = 0; i < this.staticGroups.length; i++) {
        this.staticGroups[i].rebuild();
    }
    this.needsRefresh = true;
};

Quadrant.prototype.rebuildSprites = function() {
    for (var i = 0; i < this.staticGroups.length; i++) {
        this.staticGroups[i].rebuildSprites();
    }
};

Quadrant.prototype.rebuildDepthSprites = function() {
    for (var i = 0; i < this.staticGroups.length; i++) {
        this.staticGroups[i].rebuildDepthSprites();
    }
};

