var Entity = require('../entity');

var Intro = Entity.extend({
    done: false,


    init: function(x, y, options) {
        this.parent(x, y, 1, {
            width: options.width,
            height: options.height,
            isSensor: true,
            bodytype: 'b2_staticBody'
        });
    },

    update: function(game) {
        if (!this.done && this.body.m_userData.playerCollision) {
            $('#morphs').fadeIn(500);
            $('#morphs div:first-child').addClass('flash');
            this.done = true;
        }
    },

    draw: function(ctx) {}


});

module.exports = Intro;
