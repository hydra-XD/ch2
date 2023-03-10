var Entity = require('../entity');

var LB = Entity.extend({

    active: true,
    neededTriggers: 1,
    triggerCount: 0,

    width: 22,
    height: 21,

    offset: {
        x: 0,
        y: 0
    },

    reverse: false,

    init: function(x, y, options) {
        this.parent(x, y, 1);

        this.addAnimation('inactive', 'sprites.laser', 1, .1, [1]);
        this.addAnimation('active', 'sprites.laser', 1, .1, [0]);
        this.addAnimation('inactive_0_2', 'sprites.laser', 1, .1, [4]);
        this.addAnimation('inactive_1_2', 'sprites.laser', 1, .1, [3]);
        this.addAnimation('inactive_2_2', 'sprites.laser', 1, .1, [4]);
        this.addAnimation('active_0_2', 'sprites.laser', 1, .1, [2]);
        this.addAnimation('active_1_2', 'sprites.laser', 1, .1, [3]);
        this.addAnimation('active_2_2', 'sprites.laser', 1, .1, [2]);

        this.neededTriggers = (options.properties && options.properties.neededTriggers) ? parseInt(options.properties.neededTriggers) : 1;

        this.reverse = options.properties && options.properties.reverse == "true";
        this.animation = this.animations[(this.reverse ? 'in' : '') + 'active' + this.getTriggerAnim()];

    },

    getTriggerAnim: function() {
        if (this.neededTriggers !== 2) return '';
        return '_' + Math.max(0, Math.min(2 - this.triggerCount, 2)) + '_2';
    },

    initBody: function() {},

    triggered: function(by, game) {
        if (++this.triggerCount === this.neededTriggers) {
            this.reverse ? this.untrigger(by, game) : this.trigger(by, game);
            if (this.active) game.playSound('correct');
            this.active = false;
            this.animation = this.animations[(this.reverse ? '' : 'in') + 'active' + this.getTriggerAnim()];
        } else {
            this.animation = this.animations[(this.reverse ? 'in' : '') + 'active' + this.getTriggerAnim()];
        }
    },

    untriggered: function(by, game) {
        if (--this.triggerCount < this.neededTriggers) {
            this.reverse ? this.trigger(by, game) : this.untrigger(game);
            if (!this.active) game.playSound('wrong');
            this.active = true;
            this.animation = this.animations[(this.reverse ? 'in' : '') + 'active' + this.getTriggerAnim()];
        } else {
            this.animation = this.animations[(this.reverse ? '' : 'in') + 'active' + this.getTriggerAnim()];
        }
    },

    update: function(game) {
        if (this.animation) this.animation.update();
    }
});

module.exports = LB;
