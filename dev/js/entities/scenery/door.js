var Entity = require('../entity');
var config = require('../../config');

var Door = Entity.extend({

    width: 17,
    height: 32,

    background: true,

    offset: {
        y: 6,
        x: 0
    },

    open: false,
    triggerCount: 0,

    speed: 10,

    activatesButton: false,

    init: function(x, y, options) {
        this.parent(x, y, 1, {
            fixed: 'y',
            motor: {
                speed: -this.speed,
                maxForce: 100000
            }
        });

        this.neededTriggers = (options.properties && options.properties.neededTriggers) ? parseInt(options.properties.neededTriggers) : 1;

        this.addAnimation('closed', 'sprites.door', 1, .1, [0]);
        this.addAnimation('open', 'sprites.door', 1, .1, [1]);
        this.addAnimation('closed_0_2', 'sprites.door', 1, .1, [2]);
        this.addAnimation('closed_1_2', 'sprites.door', 1, .1, [3]);
        this.addAnimation('open_2_2', 'sprites.door', 1, .1, [4]);

        this.animflip = {
            x: false,
            y: false
        };

        this.animoffset = {
            x: 0,
            y: 0
        };

        for (var anim in this.animations) {
            this.animations[anim].flip = this.animflip;
            this.animations[anim].offset = this.animoffset;
        }

        this.animation = this.animations['closed' + this.getTriggerAnim()];
    },

    update: function(game) {
        this.parent(game);

        this.animflip.x = !config.perspective.flip;
        this.animoffset.x = !config.perspective.flip ? -5 : 0;
        this.angle = 0;

    },

    getTriggerAnim: function() {
        if (this.neededTriggers !== 2) return '';
        return '_' + Math.max(0, Math.min(this.triggerCount, 2)) + '_2';
    },


    triggered: function(by, game) {
        if (++this.triggerCount === this.neededTriggers) {
            this.trigger(by, game);
            if (!this.open) game.playSound('correct');
            this.open = true;
            this.joint.SetMotorSpeed(this.speed);
            this.animation = this.animations['open' + this.getTriggerAnim()];
        } else {
            this.animation = this.animations['closed' + this.getTriggerAnim()];
        }
    },

    untriggered: function(by, game) {
        if (--this.triggerCount < this.neededTriggers) {
            this.untrigger(game);
            if (this.open) game.playSound('wrong');
            this.open = false;
            this.joint.SetMotorSpeed(-this.speed);
            this.animation = this.animations['closed' + this.getTriggerAnim()];
        } else {
            this.animation = this.animations['open' + this.getTriggerAnim()];
        }
    },


});

module.exports = Door;
