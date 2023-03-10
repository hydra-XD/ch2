var Entity = require('../entity');
var config = require('../../config');
var Assets = require('../../engine/assets');

var Laser = Entity.extend({

    active: true,

    background: true,

    axis: 'x',
    direction: 1,

    collisions: null,

    distance: 0,
    currentDistance: 0,

    delay: 0,

    color: '#ff0000',

    alpha: 1,
    ticks: 0,

    init: function(x, y, options) {
        var prop = options.properties ||  {};
        this.direction = prop.flip ? -1 : 1;
        this.color = prop.color || "#ff0000";

        x++;
        options.width--;

        this.axis = options.width > options.height ? 'x' : 'y';
        if (this.direction < 0) {
            x = this.axis === "x" ? x + options.width : x;
            y = this.axis === "y" ? y + options.height : y;
        }

        if(this.axis === "x") {
            options.height = 4;
        } else {
            options.width = 4;
        }

        this.parent(x, y, 1, {
            isSensor: true,
            width: options.width * (this.axis === "x" ? this.direction : 1),
            height: options.height * (this.axis === "y" ? this.direction : 1),
            bodytype: 'b2_staticBody'
        });


        this.width = options.width;
        this.height = options.height;


        this.distance = (this.axis === 'x' ? options.width : options.height) * this.direction;

        this.active = !(options.properties && options.properties.inactive);
    },

    triggered: function(by) {
         this.active = false;
    },

    untriggered: function(by) {
         this.active = true;
    },

    update: function(game) {
        if(!this.active) return;


        if (this.physicsInfo.collisions.length > 0) {
            var d = this.distance + this.pos[this.axis];
            for (var i = 0, n = this.physicsInfo.collisions.length; i < n; i++) {
                var ent = this.physicsInfo.collisions[i];
                if (this.direction > 0) {
                    d = Math.max(this.pos[this.axis], Math.min(ent.pos[this.axis], d));
                } else {
                    d = Math.min(this.pos[this.axis], Math.max(ent.pos[this.axis] + ent[this.axis === "y" ? "height" : "width"], d));
                }
            }
            this.currentDistance = d - this.pos[this.axis];
        } else {
            this.currentDistance = this.distance;
        }

        if (this.physicsInfo.playerCollision) {
            var player = game.level.player;
            var hit = false;
            if (this.direction > 0) {
                if (this.pos[this.axis] + this.currentDistance > player.pos[this.axis]) {
                    this.currentDistance = (player.pos[this.axis] - this.pos[this.axis]);
                    hit = true;
                }
            } else {
                if (this.pos[this.axis] + this.currentDistance < player.pos[this.axis] + player[this.axis === "y" ? "height" : "width"]) {
                    this.currentDistance = (player.pos[this.axis] + player[this.axis === "y" ? "height" : "width"] - this.pos[this.axis]);
                    hit = true;
                }
            }

            if (hit && player.hitTime <= 0) {
                player.kill(game);
            }
        }

    },

    draw: function(ctx) {
        if(!this.active) return;

        this.ticks = config.tick + this.ticks;
        if(this.ticks > Math.random()*40+20) {
            this.alpha = Math.random()*0.8+0.2;
            this.ticks = 0;
        }

        var w = (this.axis == "x") ? this.currentDistance : this.width;
        var h = (this.axis == "y") ? this.currentDistance : this.height;

        this.fillRect(ctx, this.pos.x, this.pos.y, w, h);
    },

    fillRect: function(ctx, x, y, w, h) {
        var rw = config.display.realwidth;
        var rh = config.display.realheight;

        x = this.applyScale(x) + ~~config.display.offset.x;
        y = this.applyScale(y) + ~~config.display.offset.y;
        w = this.applyScale(w);
        h = this.applyScale(h);

        var t;
        if (h < 0) {
            t = y;
            y = t + h;
            h = -h;
        }

        if (w < 0) {
            t = x;
            x = t + w;
            w = -w;
        }

        // if (x + w < 0 || x > rw || y + h < 0 || y > rh) return;

        // if (x + w > rw - config.fog.area.x) {
        //     w = (x + w - rw - config.fog.area.x)
        // }

        // if (y + h > rh - config.fog.area.y) {
        //     h = (y + h - rh - config.fog.area.y)
        // // }

        // if (x < config.fog.area.x) {
        //     t = config.fog.area.x - x;
        //     x = config.fog.area.x;
        //     w = w - t;
        // }

        // if (y < 0) {
        //     t = config.fog.area.y - y;
        //     y = config.fog.area.y;
        //     h = h - t;
        // }


        ctx.save();
        ctx.globalAlpha = this.alpha;

        var one = this.applyScale(1);
        var two = this.applyScale(2);
        var three = this.applyScale(3);

        ctx.fillStyle = this.color;
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';   
        ctx.fillRect(x, y, (this.axis == "x" ? w : one), (this.axis == "y" ? h : one));
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';   
        ctx.fillRect(x + (this.axis == "x" ? 0 : three), y + (this.axis == "y" ? 0 : three), (this.axis == "x" ? w : one), (this.axis == "y" ? h : one));
        
        // ctx.globalAlpha = 1;
        // if(this.axis == "x") {
        //     ctx.fillStyle = "#000000";
        //     ctx.fillRect(x, y-one, two, h+two);
        //     ctx.fillStyle = "#000000";
        //     ctx.fillRect(x+w-two, y-one, two, h+two);
        // } else {
        //     ctx.fillStyle = "#000000";
        //     ctx.fillRect(x-one, y, w+two, two);
        //     ctx.fillStyle = "#000000";
        //     ctx.fillRect(x-one, y+h-twodz, w+two, two);
        // }

        ctx.restore();
    }


});

module.exports = Laser;
