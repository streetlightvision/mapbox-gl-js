'use strict';

var util = require('../util/util');

module.exports = StaticBufferManager;


function StaticBufferManager(gl) {
	this.gl = gl;
	console.log('StaticBufferManager');
};

util.extend(StaticBufferManager.prototype, {
	assembleBufferWithPoints: function(points) {

	}
});