'use strict';

var util = require('../util/util');
var CustomBuffer = require('../slv/custom_buffer');

module.exports = CustomBufferManager;

function CustomBufferManager(gl, transform, painter) {
    this.gl = gl;
    this.transform = transform;
    this.painter = painter;
    this.staticBuffers = [];
    this.currentStaticBuffer = 0;
}

util.extend(CustomBufferManager.prototype, {
    createStaticBufferWithMarkers: function(markers, quadrant) {
        var buffer = new CustomBuffer(this.gl, this.transform, this.painter, markers, quadrant);
        this.staticBuffers.push(buffer);
        return buffer;
    }
});
