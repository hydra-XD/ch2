var Entity = require('../entity');

var EndLevel = Entity.extend({
    done: false,

    flip: false,

    init: function(x, y, options) {
        this.parent(x, y, 1, {
            width: options.width,
            height: options.height,
            isSensor: true,
            bodytype: 'b2_staticBody'
        });

        this.flip = options.properties && options.properties.flip;
    },

    update: function(game) {
        if (!this.done && this.body.m_userData.playerCollision) {
            game.playSound('pabam');
            game.endLevel(this.flip);
            this.done = true;
        }
    },

    draw: function(ctx) {
        this.parent(ctx);

    }
});

module.exports = EndLevel;
