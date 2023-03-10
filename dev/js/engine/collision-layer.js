var p = require('./physics');

var CollisionLayer = Class.extend({

    name: null,
    bodies: [],

    init: function(data) {
        this.name = data.name;

        data = data.data;
        for (var i = 0; i < data.length; i++) {
            var obj = data[i];

            if (obj.polygon) {
                this.bodies.push(p.createCollisionPolygon(obj.polygon, obj.x, obj.y, obj.properties));
            } else if (obj.polyline) {
                this.addPolyLine(obj);
            } else if (obj.ellipse) {

            } else {
                this.bodies.push(p.createCollisionBox(obj.x, obj.y, obj.width, obj.height, obj.properties));
            }
        }
    },

    addPolyLine: function(obj) {
        var sy = obj.y;
        for (var i = 0, n = obj.polyline.length; i < n; i++) {
            var y = obj.polyline[i].y,
                ty = sy + y,
                s = 0,
                m = ty % 15;

            if (m === 0) continue;
            if (m === 13 || m === 5) s = -1;
            if (m === 11 || m === 3) s = 1;

            obj.polyline[i].y = y + s;
        }

        this.bodies.push(p.createCollisionPolyline(obj.polyline, obj.x, obj.y, obj.properties));
    },

    update: function() {},

    draw: function() {}

})

module.exports = CollisionLayer;
