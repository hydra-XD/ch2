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
            density: 40
        };

        this.parent(x, y, 1, bodyoptions);

        this.addAnimation('stand', 'sprites.spawn', this.scale, .1, [1]);
    }
});

Ent.control = false;
Ent.pauseWhileMorph = true;
Ent.bgpos = {x: 60*1, y: 0};
Ent.info = "Spawns a static block you can jump on";

module.exports = Ent;