var Entity = require('../entity');

var Test = Entity.extend({
    width: 16,
    height: 16,

    offset: {
        x: 0,
        y: 0
    },
    
    init: function(x, y) {
        this.parent(x, y, 1);

        this.addAnimation('stand', 'debug.placeholder', this.scale, .1, [0]);
    },
});

Test.control = false;
Test.pauseWhileMorph = true;

module.exports = Test;