var Entity = require('../entity');

var ChangeSpawn = Entity.extend({
    done: 0,


    init: function(x, y, options) {
        this.parent(x, y, 1, {
            width: options.width,
            height: options.height,
            isSensor: true,
            bodytype: 'b2_staticBody'
        });
    },

    update: function(game) {
        if(!this.done && this.body.m_userData.playerCollision && !game.level.player.killed) {
            game.level.setSpawn(this.pos.x, this.pos.y);
            this.done = true;
            game.playSound('sparkle');
            game.showMessage('Spawnpoint set!', '#95FBAE', 1000, {top: "-=50"});
        }
    },

    draw: function(ctx) { }


});

module.exports = ChangeSpawn;
