'use strict';

var util = require('../util/util');

module.exports = CustomBuffer;

function CustomBuffer(gl, transform, points) {
	this.gl = gl;
	this.transform = transform;
	this.points = points;

	this.buffers = {
		vertex : {
			buffer : gl.createBuffer(),
			itemSize : 3
		},
		texture : {
			buffer : gl.createBuffer(),
			itemSize : 2
		},
		indices : {
			buffer : gl.createBuffer(),
			itemSize : 1
		}
	};

	var statsVertices = [-1,1,0,1,1,0,1,-1,0,-1,-1,0];
	var statsTexture = [0,0,1,0,1,1,0,1];
	var statsIndices = [0,1,3,1,2,3];

	this.indicesLength = statsIndices.length;

	gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.vertex.buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(statsVertices), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.texture.buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(statsTexture), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices.buffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(statsIndices), gl.STATIC_DRAW);
};

util.extend(CustomBuffer.prototype, {
	createBufferWithPoints: function(id, points) {

	}
});