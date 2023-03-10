var Entity = require('../entity');
var config = require('../../config');

var Platform = Entity.extend({
    width: 33,
    height: 6,

    background: true,

    offset: {
        y: 3,
        x: 0
    },

    active: true,

    axis: 'x',
    loop: true,

    direction: 1,

    speed: 10,

    triggerCount: 0,
    neededTriggers: 0,

    activatesButton: false,


    init: function(x, y, options) {
        y = y + options.height - 10;

        var prop = options.properties || {};
        this.axis = options.width > options.height ? 'x' : 'y';

        if (prop.inactive) this.active = false;

        var limit = (this.axis === "x" ? options.width : options.height);

        this.parent(x, y, 1, {
            density: 100,
            top: {
                friction: 10000
            },
            motor: {
                speed: this.direction * this.speed,
                maxForce: 100000
            },
            fixed: this.axis,
            limit: {
                upper: limit,
                lower: 0
            }
        });

        this.neededTriggers = (options.properties && options.properties.neededTriggers) ? parseInt(options.properties.neededTriggers) : 1;


        this.addAnimation('inactive', 'sprites.platform', 1, .1, [0]);
        this.addAnimation('active', 'sprites.platform', 1, .1, [1]);
        this.addAnimation('active_2_2', 'sprites.platform', 1, .1, [2]);
        this.addAnimation('inactive_1_2', 'sprites.platform', 1, .1, [3]);
        this.addAnimation('inactive_0_2', 'sprites.platform', 1, .1, [4]);


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

        this.animation = this.animations[(this.active ? '' : 'in') + 'active' + this.getTriggerAnim()];
    },

    getTriggerAnim: function() {
        if (this.neededTriggers !== 2) return '';
        return '_' + Math.max(0, Math.min(this.triggerCount, 2)) + '_2';
    },

    triggered: function(by, game) {
        if (++this.triggerCount === this.neededTriggers) {
            this.trigger(by, game);
            this.active = true;
            this.animation = this.animations['active' + this.getTriggerAnim()];
        } else {
            this.animation = this.animations['inactive' + this.getTriggerAnim()];
        }
    },

    untriggered: function(game) {
        if (--this.triggerCount < this.neededTriggers) {
            this.untrigger(game);
            this.active = false;
            this.animation = this.animations['inactive' + this.getTriggerAnim()];
        } else {
            this.animation = this.animations['active' + this.getTriggerAnim()];
        }
    },

    update: function(game) {
        this.animflip.x = config.perspective.flip;
        this.animoffset.x = config.perspective.flip ? 0 : -5;

        this.parent(game);

        var vel = this.body.GetLinearVelocity()[this.axis],
            trans = this.joint.GetJointTranslation();

        if (trans - 1 <= this.joint.GetLowerLimit() || (this.direction === -1 && vel > -0.001)) {
            this.direction = 1;
        } else if (trans + 2 >= this.joint.GetUpperLimit() || (this.direction === 1 && vel < 0.001)) {
            this.direction = -1
        };
        this.joint.SetMotorSpeed(this.active ? this.direction * this.speed : 0);


        this.angle = 0;

    }

});

module.exports = Platform;
