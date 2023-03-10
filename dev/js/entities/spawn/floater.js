var Entity = require('../entity');

var Ent = Entity.extend({
    width: 15,
    height: 15,

    offset: {
        x: 0.5,
        y: 1
    },
    
    init: function(x, y) {
        var bodyoptions = {
            fixed: "y",
            density: 1000,
            top: {
                friction: 0.2
            },
            limit: {
                lower: 0,
                upper: 0
            }
        };

        this.parent(x, y, 1, bodyoptions);

        this.addAnimation('stand', 'sprites.spawn', this.scale, .1, [3]);
    }
});

Ent.control = false;
Ent.pauseWhileMorph = true;
Ent.bgpos = {x: 60*3, y: 0};
Ent.info = "Spawns a floating block - paused while transforming";

module.exports = Ent;