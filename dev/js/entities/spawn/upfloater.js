var Entity = require('../entity');

var Ent = Entity.extend({
    width: 15,
    height: 15,

    offset: {
        x: 0.5,
        y: 1
    },

    speed: 3,

    //activatesButton: false,
    
    init: function(x, y) {
        x+=2;
        var bodyoptions = {
            fixed: "y",
            density: 400, 
            top: {
                friction: 0.2
            },
            motor: {
                speed: this.speed,
                maxForce: 10000000
            }
        };

        this.parent(x, y, 1, bodyoptions);

        this.addAnimation('stand', 'sprites.spawn', this.scale, .1, [5]);
    }
});

Ent.control = false;
Ent.pauseWhileMorph = true;
Ent.bgpos = {x: 60*5, y: 0};
Ent.info = "Spawns a block that rises";

module.exports = Ent;