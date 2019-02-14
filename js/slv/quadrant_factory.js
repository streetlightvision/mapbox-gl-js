'use strict';
var Quadrant = require('../slv/quadrant');

module.exports = QuadrantFactory;

function QuadrantFactory(map, lngDivisions, latDivisions) {
    this.map = map;
    this.lngDivisions = lngDivisions;
    this.latDivisions = latDivisions;
    this.lastId = 0;
    this.quadrants = [];
}

QuadrantFactory.prototype.createQuadrant = function (row, col) {
    var id = this.lastId++;
    this.quadrants.push(new Quadrant(id, row, col, this.map, this.lngDivisions, this.latDivisions));
    return this.quadrants[id];
};

QuadrantFactory.prototype.getQuadrant = function (id) {
    return this.quadrants[id];
};

QuadrantFactory.prototype.remove = function () {
    this.quadrants.forEach(function (quadrant) {
        quadrant.remove();
    });
};
