var Player = require('../player');

var Test = Player.extend({
    width: 16,
    height: 16,

    offset: {
        x: 0,
        y: 0
    },

    init: function(x, y) {
        this.parent(x, y, 'debug.placeholder');
    }
});

Test.control = true;
Test.pauseWhileMorph = false;

module.exports = Test;