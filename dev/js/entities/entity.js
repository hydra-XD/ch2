var Assets = require('../engine/assets');
var Animation = require('../engine/animation');
var config = require('../config');

var Input = require('../engine/input');
var p = require('../engine/physics');

var b2Vec2 = Box2D.Common.Math.b2Vec2;

var hashnum = 0;

var Entity = Class.extend({
    width: 16,
    height: 16,

    foreground: false,
    background: false,

    pos: {
        x: 100,
        y: 100
    },

    offset: {
        x: 0, 
        y: 0
    },

    body: null,
    joint: null,

    scale: 1,

    animations: {},
    animation: null,

    angle: 0,

    bodyType: 'Box',

    targets: null,

    hash: null,

    physicsInfo: null,

    activatesButton: true,

    init: function(x, y, scale, bodyoptions) {
        this.hash = hashnum++;

        this.pos = {
            x: x,
            y: y
        };

        // this.offset = {
        //     x: 0,
        //     y: 0
        // };

        this.scale = scale;

        this.animations = {};
        this.initBody(bodyoptions);
    },
    
    applyScale: function(n) {
        return Math.round(n*config.display.scale);
    },

    setPos: function(x, y) {
        this.body.SetPosition(new b2Vec2(x, y));
        this.body.SetAwake(true);
        this.body.SetLinearVelocity(new b2Vec2(0, 0));
    },

    initBody: function(bodyoptions) {
        if(bodyoptions) {
            bodyoptions.ent = this;
        }

        var b = p['add'+this.bodyType+'Entity'](this.pos.x+this.offset.x, this.pos.y+this.offset.y, this.width*this.scale, this.height*this.scale, bodyoptions);
        
        if (b && b.body && b.joint) {
            this.body = b.body;
            this.joint = b.joint;
        } else {
            this.body = b;
        }


        if (bodyoptions && bodyoptions.isSensor) {
            this.physicsInfo = this.body.m_userData
        }
    },

    removeBody: function() {
        p.removeBody(this.body);
    },

    addAnimation: function(name, tilesheet, scale, frametime, sequence, loop) {
        if(typeof(tilesheet) !== "object") {
            tilesheet = Object.$get(Assets.Graphics, tilesheet)
        }
        this.animations[name] = new Animation(tilesheet, scale, frametime, sequence, loop);
        this.animation = this.animations[name];
    },

    triggered: function(by, game) { },

    untriggered: function(by, game) { },

    trigger: function(by, game) {
        if(!this.targets) return;
        for(var i = 0; i < this.targets.length; i++)
            this.targets[i].triggered(by || this, game);
    },

    untrigger: function(game) {
        if(!this.targets) return;
        for(var i = 0; i < this.targets.length; i++)
            this.targets[i].untriggered(this, game);
    },

    update: function(game) {
        if(this.animation) {
            this.animation.update();
        }
        
        if(this.body) {
            var pos = this.body.GetPosition();
            this.pos.x = pos.x;
            this.pos.y = pos.y;

            this.angle = this.body.GetAngle();
        }
    },

    draw: function(ctx) {
        if(this.animation) {
            this.animation.draw(ctx, this.pos.x-this.offset.x, this.pos.y-this.offset.y, this.angle);
        }
    }


});

module.exports = Entity;
