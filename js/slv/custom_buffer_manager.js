'use strict';

var util = require('../util/util');
var LngLat = require('../geo/lng_lat');
var CustomBuffer = require('../slv/custom_buffer');

module.exports = CustomBufferManager;

function CustomBufferManager(gl, transform, painter) {
	this.gl = gl;
	this.transform = transform;
	this.painter = painter;
	this.staticBuffers = [];
	this.currentStaticBuffer = 0;
};

util.extend(CustomBufferManager.prototype, {
	createStaticBufferWithPoints: function(points, quadrant) {
		this.staticBuffers.push(new CustomBuffer(this.gl, this.transform, this.painter, points, quadrant));

		return this.currentStaticBuffer++;
	}
});