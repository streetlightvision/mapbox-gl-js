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

    this.bind();
}

util.extend(CustomBuffer.prototype, {
    bind: function() {
        var gl = this.gl;
        var markers = this.markers;
        var statsVertices = [];
        var statsTexture = [];
        var statsIndices = [];

        var quadrantIncement = {
            x: 360 / this.quadrant.lngDivisions,
            y: 180 / this.quadrant.latDivisions
        };

        var index = 0;

        var scale = 10;

        var quadX = quadrantIncement.x * this.quadrant.col;
        var quadY = quadrantIncement.y * this.quadrant.row;

        this.tX = this.lngX(quadX - 180);
        this.tY = this.latY(90 - quadY);

        var deltaX = 0.00001291749338624338 * scale;
        var deltaY = 0.00001291749339316084 * scale;

        for (var i = 0; i < markers.length; i++) {
            var x = this.lngX(markers[i].lng);
            var y = this.latY(markers[i].lat);
            statsVertices.push(x - this.tX - deltaX);
            statsVertices.push(y - this.tY + deltaY);
            statsVertices.push(x - this.tX + deltaX);
            statsVertices.push(y - this.tY + deltaY);
            statsVertices.push(x - this.tX + deltaX);
            statsVertices.push(y - this.tY - deltaY);
            statsVertices.push(x - this.tX - deltaX);
            statsVertices.push(y - this.tY - deltaY);

            this.pushTexCoords(markers[i], statsTexture);

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

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.texture.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(statsTexture), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices.buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(statsIndices), gl.STATIC_DRAW);

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
            console.warn('Marker ' + marker + ' doesn\'t have a sprite on the current sprite map!');
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
    lngX: function(lng) {
        return ((180 + lng) * 512 / 360);
    },
    latY: function(lat) {
        var y = 180 / Math.PI * Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360));
        return (180 - y) * 512 / 360;
    }
});
