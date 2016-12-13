'use strict';

var util = require('../util/util');
var LngLat = require('../geo/lng_lat');
var CustomBuffer = require('../slv/custom_buffer');

module.exports = CustomBufferManager;

function CustomBufferManager(gl, transform) {
	this.gl = gl;
	this.transform = transform;
	this.staticBuffers = [];
	this.currentStaticBuffer = 0;
};

util.extend(CustomBufferManager.prototype, {
	createStaticBufferWithPoints: function(points, quadrant) {
		this.staticBuffers.push(new CustomBuffer(this.gl, this.transform, points, quadrant));

		return this.currentStaticBuffer++;
	}
});