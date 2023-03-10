var Entity = require('./entity');

var Input = require('../engine/input');
var config = require('../config');

var stats = require('../stats')

var b2Vec2 = Box2D.Common.Math.b2Vec2;

var SPEED = 18;
var JUMP = 110;

var Player = Entity.extend({
    canJump: false,
    wentUp: false,

    width: 16,
    height: 18,

    morphing: false,

    offset: {
        x: 2,
        y: 1
    },

    bodyType: 'Player',

    couldJump: false,

    hitTime: 0,

    killed: false,

    init: function(x, y, sheet) {
        this.parent(x, y, 1);

        this.initAnim(sheet || 'sprites.player');
    },
    initAnim: function(sheet) {
        this.addAnimation('stand', sheet, this.scale, .1, [0]);
        this.addAnimation('walk', sheet, this.scale, .1, [1, 2, 3]);
        this.addAnimation('jump', sheet, this.scale, .15, [4, 5]);
        this.addAnimation('morph', sheet, this.scale, .06, [9, 10, 11, 12, 13, 14, 15, 14, 13], false);
        this.addAnimation('endlevel', sheet, this.scale, .15, [16, 17, 18]);
        this.addAnimation('hit', sheet, this.scale, .02, [19, 20]);
        this.animation = this.animations['stand'];
        this.animations['walk'].flip.x = true;
    },

    endLevel: function(level, flip) {
        stats.stattracker()
      
        this.animation = this.animations['endlevel'];
        this.animation.flip.x = !flip;


        var pos = this.body.GetPosition();
        pos.y -= this.height/2;


        var n = flip ? -1 : 1;

        this.body.SetPosition(pos);

        this.body.SetType(1);
        this.body.SetLinearVelocity(new b2Vec2(n*30, -15));
    },

    kill: function(game, time) {
        if(this.animation === this.animations['endlevel']) return;
        if(this.animation !== this.animations['hit']) {
            this.killed = true;
            this.morphing = false;
            game.level.morphing = false;
            this.animation = this.animations['hit'];
            this.animation.flip.x = true;
            this.hitTime = time || 300;
            game.shake(time || 300, 20);
            game.playSound('fail');
        }

        this.hitTime = this.hitTime - config.tick;
        if(this.hitTime < 0) {
            game.level.respawnPlayer(true);
        }
    },

    respawn: function(x, y) {
        this.setPos(x, y);
        this.animation = this.animations['stand'];
        //this.killed = false;
    },

    update: function(game) {
        if (this.hitTime > 0) {
            this.kill(game);
        }


        this.parent();

        if (this.morphing) {
            if (this.animation != this.animations['morph']) {
                this.animation = this.animations['morph'];
                this.animation.flip.x = this.animations['walk'].flip.x;
                this.animation.reset();
            } else {
                if (this.animation.looped) {
                    this.morphing = false;
                }
            }
        }

        if(this.animation == this.animations['endlevel']) {
            this.animation.alpha -= 0.008;
        }

        if (!this.morphing && this.animation != this.animations['endlevel'] && this.animation != this.animations['hit']) {
            if (!Input.isDown(0)) this.handleMovement(game);
        }

        if(!this.couldJump && this.canJump()) {
            game.playSound('fall', true);
            // config.display.clearColor = 'rgba(38,28,37,1)';
        }
        this.couldJump = this.canJump();
    },

    initMorph: function() {
        if(this.animation != this.animations['endlevel'] && this.animation != this.animations['hit']) this.morphing = true;
        return this.morphing;
    },

    isMorphing: function() {
        return this.morphing;
    },

    canJump: function() {
        return this.body.m_userData.footContacts > 0;
    },

    handleMovement: function(game) {
        var vel = this.body.GetLinearVelocity(),
            l = Input.isDown('left'),
            r = Input.isDown('right'),
            u = Input.isDown('up');

        this.animation = this.animations['stand'];

        var speed = 0,
            impulse = 0,
            change;
        if (l ^ r || vel.x != 0) {
            this.animation = this.animations['walk'];
            if (l) {
                speed = speed - SPEED;
                config.perspective.flip = true;
                this.animation.flip.x = false;
            }
            if (r) {
                speed = speed + SPEED;
                config.perspective.flip = false;
                this.animation.flip.x = true;
            }

            change = speed - vel.x;
            impulse = this.body.GetMass() * change;
            this.body.ApplyImpulse(new b2Vec2(impulse, 0), this.body.GetWorldCenter());
        }

        if (!this.canJump()) {
            this.animation = this.animations['jump'];
        } else {
            this.killed = false;
        }

        if (u && this.canJump()) {
            // config.display.clearColor = 'rgba(38,28,37,.4)';
            game.playSound('jump', true);
            impulse = this.body.GetMass() * JUMP;
            this.body.ApplyImpulse(new b2Vec2(0, impulse), this.body.GetWorldCenter());
        }


        this.animation.flip = this.animations['walk'].flip;

    }

});

module.exports = Player;
