'use strict';

module.exports = PointGroup;

function PointGroup(customBufferManager, quadrant) {
    this.index = 0;
    this.markers = [];
    this.markersMap = {};
    this.quadrant = quadrant;
    this.customBufferManager = customBufferManager;
    this.needsRefresh = false;
    this.needsSpriteRefresh = false;
}

PointGroup.prototype.buildBuffer = function () {
    this.buffer = this.customBufferManager.createStaticBufferWithMarkers(this.markers, this.quadrant);
    this.needsRefresh = false;
    this.needsSpriteRefresh = false;
};

PointGroup.prototype.setNeedsRefresh = function () {
    this.needsRefresh = true;
};

PointGroup.prototype.updateMarkerSprite = function (marker, sprite) {
    if (marker.id in this.markersMap) {
        this.markers[marker.index].sprite = sprite;
        this.needsSpriteRefresh = true;
    }
};

PointGroup.prototype.refreshIfNeeded = function () {
    if (this.needsSpriteRefresh === true && this.buffer) {
        return this.rebuildSprites();
    } else if (this.needsRefresh === true && this.buffer) {
        this.buffer.bind();
        this.needsRefresh = false;
        return true;
    } else {
        return false;
    }
};

PointGroup.prototype.addMarker = function (marker) {
    marker.index = this.index++;
    this.markers.push(marker);
    this.markersMap[marker.id] = true;
    this.needsRefresh = true;
};

PointGroup.prototype.selectMarker = function (marker) {
    if (this.stringEndsWith(this.markers[marker.index].sprite, '-selected') === false) {
        this.markers[marker.index].sprite += '-selected';
        this.needsSpriteRefresh = true;
        return true;
    }
    return false;
};

PointGroup.prototype.stringEndsWith = function(text, suffix) {
    return text.indexOf(suffix, text.length - suffix.length) !== -1;
};

PointGroup.prototype.unselectMarker = function (marker) {
    if (this.stringEndsWith(this.markers[marker.index].sprite, '-selected') === true) {
        this.markers[marker.index].sprite = this.markers[marker.index].sprite.substring(0, this.markers[marker.index].sprite.length - 9);
        this.needsSpriteRefresh = true;
        return true;
    }
    return false;
};


PointGroup.prototype.clear = function () {
    if (this.buffer !== undefined) {
        this.customBufferManager.removeBuffer(this.buffer);
        this.buffer.clear();
        delete this.buffer;
    }
};

PointGroup.prototype.rebuild = function () {
    if (this.needsRefresh === true || this.needsSpriteRefresh === true) {
        this.clear();
        this.buildBuffer();
    }
};

PointGroup.prototype.rebuildSprites = function () {
    if (this.needsSpriteRefresh === true && this.buffer !== undefined) {
        this.buffer.buildTextureBuffer();
        this.needsSpriteRefresh = false;
        return true;
    }
    return false;
};

PointGroup.prototype.rebuildDepthSprites = function () {
    if (this.needsSpriteRefresh === true && this.buffer !== undefined) {
        this.buffer.buildZBuffer();
        this.buffer.buildTextureBuffer();
        this.needsSpriteRefresh = false;
        return true;
    }
    return false;
};

PointGroup.prototype.findMarker = function (marker) {
    if (marker.id in this.markersMap) {
        return true;
    } else {
        return false;
    }
};

PointGroup.prototype.removeMarker = function (marker) {
    if (marker.id in this.markersMap) {
        delete this.markersMap[marker.id];
        if (this.markers[marker.index].id === marker.id) {
            delete this.markers[marker.index];
            delete marker.index;
        } else {
            console.warn('marker index inconsistent!');
        }
        this.needsRefresh = true;
        this.rebuild();
    }
};
