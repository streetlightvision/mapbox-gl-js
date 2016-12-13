'use strict';

var util = require('../util/util');

module.exports = CustomBuffer;

function CustomBuffer(gl, transform, points, quadrant) {
	this.gl = gl;
	this.transform = transform;
	this.points = points;
	this.quadrant = quadrant;

	var quadrantIncement = {
        x: 360/this.quadrant.lngDivisions,
        y: 180/this.quadrant.latDivisions
    }

	var statsVertices = [];
	var statsTexture = [];
	var statsIndices = [];

	this.buffers = {
		vertex : {
			buffer : gl.createBuffer(),
			itemSize : 2
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

	var index = 0;

	var scale = 3;

	var quadX = quadrantIncement.x*this.quadrant.col;
	var quadY = quadrantIncement.y*this.quadrant.row;

	this.tX = quadX * (this.transform.tileSize / 360);
	this.tY = quadY * (this.transform.tileSize / 180);

    var deltaX = 0.000012917493386243386*scale;
    var deltaY = 0.000011*scale;

	for (var i=0; i<points.length;i++) {
		statsVertices.push(this.lngX(points[i].lng-deltaX)-this.tX);
		statsVertices.push(this.latY(points[i].lat+deltaY)-this.tY);
		statsVertices.push(this.lngX(points[i].lng+deltaX)-this.tX);
		statsVertices.push(this.latY(points[i].lat+deltaY)-this.tY);
		statsVertices.push(this.lngX(points[i].lng+deltaX)-this.tX);
		statsVertices.push(this.latY(points[i].lat-deltaY)-this.tY);
		statsVertices.push(this.lngX(points[i].lng-deltaX)-this.tX);
		statsVertices.push(this.latY(points[i].lat-deltaY)-this.tY);
		statsTexture.push(1);
		statsTexture.push(1);
		statsTexture.push(1);
		statsTexture.push(1);
		statsTexture.push(1);
		statsTexture.push(1);
		statsTexture.push(1);
		statsTexture.push(1);
		statsIndices.push(index);
		statsIndices.push(index+1);
		statsIndices.push(index+3);
		statsIndices.push(index+1);
		statsIndices.push(index+2);
		statsIndices.push(index+3);
		index += 4;
	}


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

	},
    lngX: function(lng, worldSize) {
        return ((180 + lng) * 512 / 360);
    },
    latY: function(lat, worldSize) {
        var y = 180 / Math.PI * Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360));
        return (180 - y) * 512 / 360;
    }
});