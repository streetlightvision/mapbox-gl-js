'use strict';

var test = require('tap').test;
var Quadrant = require('../../../js/slv/quadrant');

test('Quadrant', function(t) {
    t.test('findQuadrant', function(t) {
        var q = Quadrant.findQuadrant(-180, 90, 180, 90);
        t.deepEqual(q, {col: 0, row: 0}, 'Valid input');

        var q = Quadrant.findQuadrant(181, 90, 180, 90);
        t.deepEqual(q, {col: 0, row: 0}, 'Lng wrapped around 360 positive');

        var q = Quadrant.findQuadrant(-539, 90, 180, 90);
        t.deepEqual(q, {col: 0, row: 0}, 'Lng wrapped around 360 negative');

        var q = Quadrant.findQuadrant(541, 90, 180, 90);
        t.deepEqual(q, {col: 0, row: 0}, 'Lng wrapped around 720 positive');

        var q = Quadrant.findQuadrant(-899, 90, 180, 90);
        t.deepEqual(q, {col: 0, row: 0}, 'Lng wrapped around 720 negative');

        t.end();
    });

    t.end();
});
