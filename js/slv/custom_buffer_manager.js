'use strict';

var util = require('../util/util');
var LngLat = require('../geo/lng_lat');
var CustomBuffer = require('../slv/custom_buffer');

module.exports = CustomBufferManager;

function CustomBufferManager(gl, transform) {
	this.gl = gl;
	this.transform = transform;
	console.log('CustomBufferManager');
	this.buffers = [];
};

util.extend(CustomBufferManager.prototype, {
	createStaticBufferWithPoints: function(id, points) {
		this.buffers.push(new CustomBuffer(this.gl, this.transform, points));
		// this.buffer = gl.createBuffer();
		// gl.bindBuffer( gl.ARRAY_BUFFER, this.buffer);

		// for(var i=0; i < points.length; i++) {
		// 	var point = this.transform.project(new LngLat(points[i].lng, points[i].lat));
		// 	if (i == 0) {
		// 		console.log(point);
		// 	}
		// }
	}
});