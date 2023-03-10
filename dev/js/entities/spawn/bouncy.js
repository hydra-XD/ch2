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
            density: 40,
            bottom: {
                friction: 0.2,
                restitution: 0,
            },
            restitution: 0.8
        };

        this.parent(x, y, 1, bodyoptions);

        this.addAnimation('stand', 'sprites.spawn', this.scale, .1, [4]);
    }
});

Ent.control = false;
Ent.pauseWhileMorph = true;
Ent.bgpos = {x: 60*4, y: 0};
Ent.info = "Kill yourself, leaving a bounceable entity behind.";

module.exports = Ent;