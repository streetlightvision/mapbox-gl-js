'use strict';

var DOM = require('../../util/dom');
var util = require('../../util/util');
var window = require('../../util/window');

module.exports = DrawSelectHandler;

function DrawSelectHandler(map) {
    this._map = map;
    this._el = map.getCanvasContainer();
    this._container = map.getContainer();

    util.bindHandlers(this);
}

DrawSelectHandler.prototype = {

    _enabled: false,
    _active: false,

    isEnabled: function () {
        return this._enabled;
    },

    isActive: function () {
        return this._active;
    },

    enable: function () {
        if (this.isEnabled()) return;
        this._el.addEventListener('mousedown', this._onMouseDown, false);
        this._enabled = true;
    },

    disable: function () {
        if (!this.isEnabled()) return;
        this._el.removeEventListener('mousedown', this._onMouseDown);
        this._enabled = false;
    },

    _onMouseDown: function (e) {
        if (!(e.shiftKey && e.button === 0)) return;

        window.document.addEventListener('mousemove', this._onMouseMove, false);
        window.document.addEventListener('keydown', this._onKeyDown, false);
        window.document.addEventListener('mouseup', this._onMouseUp, false);

        DOM.disableDrag();
        this._startPos = DOM.mousePos(this._el, e);
        this._coordList = [this._startPos];
        this._active = true;
    },

    _onMouseMove: function (e) {

        if (!this._canvas) {
            this._canvas = DOM.create('canvas', 'mapboxgl-canvas-overlay', this._container);
            this._canvas.style.position = 'absolute';
            this._canvas.width = this._container.offsetWidth;
            this._canvas.height = this._container.offsetHeight;
            this._canvas.style.pointerEvents = 'none';
            this._container.classList.add('mapboxgl-crosshair');
            this._ctx = this._canvas.getContext('2d');
            this._fireEvent('drawselectstart', e);
            this._ctx.fillStyle = 'rgba(255, 165, 0, 0.3)';
            this._ctx.strokeStyle = 'rgb(255, 165, 0)';
            this._ctx.lineWidth = 2;
            this._ctx.setLineDash([20, 20]);
        }

        this._coordList.push(DOM.mousePos(this._el, e));

        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._ctx.beginPath();
        this._ctx.moveTo(this._coordList[0].x, this._coordList[1].y);
        for (var i = 1; i < this._coordList.length; i++) {
            this._ctx.lineTo(this._coordList[i].x, this._coordList[i].y);
        }
        this._ctx.closePath();
        this._ctx.stroke();
        this._ctx.fill();
    },

    _onMouseUp: function (e) {
        if (e.button !== 0) return;

        var source = this;

        var coordsList = [];
        var minX = 999, maxX = -999, minY = 999, maxY = -999;
        for (var i = 0; i < this._coordList.length; i++) {
            var point = this._map.unproject([this._coordList[i].x, this._coordList[i].y]);
            coordsList.push({ lng: point.lng, lat: point.lat});
            if (point.lng < minX) minX = point.lng;
            if (point.lng > maxX) maxX = point.lng;
            if (point.lat < minY) minY = point.lat;
            if (point.lat > maxY) maxY = point.lat;
        }

        var boundaries = { minX: minX, maxX: maxX, minY: minY, maxY: maxY };

        this._map.mapControl.deviceManager.queryBoundaries(boundaries).then(function (result) {
            if (result.length > 0 && result.length < 500) {
                var markers = [];
                for (var i = 0; i < result.length; i++) {
                    if (source.inside(result[i], coordsList)) {
                        markers.push(result[i]);
                    }
                }
                source._map.mapControl.deviceManager.setSelection(markers);
                source._map.mapControl.clickEvent.trigger([markers]);
                source._fireEvent('drawselectend', { markers : markers});
            }
        });

        this._finish();

    },
    inside: function (point, shape) {
        var x = point.lng, y = point.lat;
        var inside = false;

        for (var i = 0, j = shape.length - 1; i < shape.length; j = i++) {
            if (!shape[i] || !shape[j]) return false;
            var xi = shape[i].lng, yi = shape[i].lat;
            var xj = shape[j].lng, yj = shape[j].lat;

            var intersect = ((yi > y) !== (yj > y)) &&
                 (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }

        return inside;
    },

    _onKeyDown: function (e) {
        if (e.keyCode === 27) {
            this._finish();
            this._fireEvent('drawselectcancel', e);
        }
    },

    _finish: function () {
        this._active = false;

        window.document.removeEventListener('mousemove', this._onMouseMove, false);
        window.document.removeEventListener('keydown', this._onKeyDown, false);
        window.document.removeEventListener('mouseup', this._onMouseUp, false);

        this._container.classList.remove('mapboxgl-crosshair');

        if (this._canvas) {
            this._canvas.parentNode.removeChild(this._canvas);
            this._canvas = null;
        }

        DOM.enableDrag();
    },

    _fireEvent: function (type, e) {
        return this._map.fire(type, { originalEvent: e });
    }
};
