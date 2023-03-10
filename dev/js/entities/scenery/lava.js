var Entity = require('../entity');

var Lava = Entity.extend({
    init: function(x, y, options) {
        this.parent(x, y, 1, {
            width: options.width,
            height: options.height,
            isSensor: true,
            bodytype: 'b2_staticBody'
        });
    },

    update: function(game) {
        if (this.body.m_userData.playerCollision) game.level.player.kill(game, 500);
    },

    draw: function(ctx) {}


});

module.exports = Lava;
