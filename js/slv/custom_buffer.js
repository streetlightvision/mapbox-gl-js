'use strict';

var util = require('../util/util');

module.exports = CustomBuffer;

function CustomBuffer(gl, transform, painter, markers, quadrant) {
    this.gl = gl;
    this.transform = transform;
    this.markers = markers;
    this.quadrant = quadrant;
    this.painter = painter;

    this.buffers = {
        vertex : {
            buffer : gl.createBuffer(),
            itemSize : 3
        },
        texture : {
            buffer : gl.createBuffer(),
            itemSize : 2
        },
        offset : {
            buffer : gl.createBuffer(),
            itemSize : 2
        },
        indices : {
            buffer : gl.createBuffer(),
            itemSize : 1
        }
    };

    this.bind();
}

util.extend(CustomBuffer.prototype, {
    bind: function() {
        var gl = this.gl;
        var markers = this.markers;
        var statsVertices = [];
        var statsOffset = [];
        var statsIndices = [];

        var quadrantIncement = {
            x: 360 / this.quadrant.lngDivisions,
            y: 180 / this.quadrant.latDivisions
        };

        var index = 0;

        var quadX = quadrantIncement.x * this.quadrant.col;
        var quadY = quadrantIncement.y * this.quadrant.row;

        this.tX = this.lngX(quadX - 180);
        this.tY = this.latY(90 - quadY);

        var z = 0;

        for (var i = 0; i < markers.length; i++) {
            if (markers[i] === undefined) continue;

            if (markers[i].sprite.indexOf('error') >= 0 || markers[i].sprite.indexOf('warning') >= 0) {
                z = 0.0001;
            } else {
                z = 0;
            }

            var x = this.lngX(markers[i].lng);
            var y = this.latY(markers[i].lat);

            statsVertices.push(x - this.tX);
            statsVertices.push(y - this.tY);
            statsVertices.push(z);
            statsOffset.push(-1);
            statsOffset.push(1);

            statsVertices.push(x - this.tX);
            statsVertices.push(y - this.tY);
            statsVertices.push(z);
            statsOffset.push(1);
            statsOffset.push(1);

            statsVertices.push(x - this.tX);
            statsVertices.push(y - this.tY);
            statsVertices.push(z);
            statsOffset.push(1);
            statsOffset.push(-1);

            statsVertices.push(x - this.tX);
            statsVertices.push(y - this.tY);
            statsVertices.push(z);
            statsOffset.push(-1);
            statsOffset.push(-1);

            statsIndices.push(index);
            statsIndices.push(index + 1);
            statsIndices.push(index + 3);
            statsIndices.push(index + 1);
            statsIndices.push(index + 2);
            statsIndices.push(index + 3);
            index += 4;
        }

        this.indicesLength = statsIndices.length;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.vertex.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(statsVertices), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.offset.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(statsOffset), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices.buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(statsIndices), gl.STATIC_DRAW);

        this.buildTextureBuffer();
    },
    pushTexCoords: function(marker, statsTexture) {
        var addDefault = false;
        if (this.painter.spriteAtlas.sprite !== undefined) {
            var sprites = this.painter.spriteAtlas.images;
            if (marker.sprite in sprites) {
                var sprite = sprites[marker.sprite];
                statsTexture.push((sprite.rect.x) / 4);
                statsTexture.push((sprite.rect.y + sprite.rect.height) / 4);
                statsTexture.push((sprite.rect.x + sprite.rect.width) / 4);
                statsTexture.push((sprite.rect.y + sprite.rect.height) / 4);
                statsTexture.push((sprite.rect.x + sprite.rect.width) / 4);
                statsTexture.push((sprite.rect.y) / 4);
                statsTexture.push(sprite.rect.x / 4);
                statsTexture.push(sprite.rect.y / 4);
            } else {
                console.warn(marker.sprite + ' not found.');
                addDefault = true;
            }
        }
        if (addDefault === true) {
            console.warn('Marker doesn\'t have a sprite on the current sprite map!', marker);
            statsTexture.push(0);
            statsTexture.push(0);
            statsTexture.push(0);
            statsTexture.push(0);
            statsTexture.push(0);
            statsTexture.push(0);
            statsTexture.push(0);
            statsTexture.push(0);
        }
    },
    buildTextureBuffer: function() {
        var statsTexture = [];
        var markers = this.markers;
        var gl = this.gl;

        for (var i = 0; i < markers.length; i++) {
            if (markers[i] === undefined) continue;
            this.pushTexCoords(markers[i], statsTexture);
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.texture.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(statsTexture), gl.STATIC_DRAW);
    },
    lngX: function(lng) {
        return ((180 + lng) * 512 / 360);
    },
    latY: function(lat) {
        var y = 180 / Math.PI * Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360));
        return (180 - y) * 512 / 360;
    },
    clear: function() {
        var gl = this.gl;
        gl.deleteBuffer(this.buffers.vertex.buffer);
        gl.deleteBuffer(this.buffers.offset.buffer);
        gl.deleteBuffer(this.buffers.texture.buffer);
        gl.deleteBuffer(this.buffers.indices.buffer);
    },
    isEmpty: function() {
        if (this.markers.length > 0)
            return false;
        else
            return true;
    }
});
