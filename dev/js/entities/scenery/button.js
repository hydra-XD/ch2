var Entity = require('../entity');

var Btn = Entity.extend({

    triggered: false,
    width: 17,
    height: 16,

    align: null,

    init: function(x, y, options) {
        this.offset = {x: 0, y: 0}

        this.align = options.properties.align || 't';
        this.axis = options.properties.axis || "y";

        if(this.align === 't' || this.align.substr(0,1) === "t") this.offset.y = this.height - options.height;
        if(this.align === 'l' || this.align.substr(1) === "l") this.offset.x = this.width - options.width;

        this.parent(x, y, 1, {
            x: x,
            y: y,
            width: options.width,
            height: options.height,
            isSensor: true,
            bodytype: 'b2_staticBody'
        });





        var n = this.axis === "x" ? 2 : 0;
        this.addAnimation('pressed', 'sprites.button', 1, .1, [1+n]);
        this.addAnimation('unpressed', 'sprites.button', 1, .1, [0+n]);


        if(this.align === 'b' || this.align.substr(0,1) === 'b') {
            for(var anim in this.animations) {
                this.animations[anim].flip.y = true;
            }
        }

        if(this.align === 'r' || this.align.substr(1) === 'r') {
            for(var anim in this.animations) {
                this.animations[anim].flip.x = true;
            }
        }
    },

    countValid: function(cols) {
        var c = 0;
        for(var i = 0, n = cols.length; i < n; i++) {
            if (cols[i] && cols[i].activatesButton) c++;
        }
        return c;
    },

    update: function(game) {
        if(this.animation) this.animation.update();

        var t;
        if (this.body.m_userData.playerCollision) {
            t = [{ent: game.level.player}];
        } else {
            if (this.body.m_userData.collisions && this.countValid(this.body.m_userData.collisions) > 0) {

                t = this.body.m_userData.collisions;
            }
        }

        if (!this.triggered && t) {
            this.trigger(t, game);
            game.playSound('on');
            this.animation = this.animations['pressed'];
        }

        if (this.triggered && !t) {
            this.untrigger(game);
            game.playSound('off');
            this.animation = this.animations['unpressed'];
        }

        this.triggered = !!t;
    },



});

module.exports = Btn;
