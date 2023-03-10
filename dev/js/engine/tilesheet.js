var Graphic = require('./graphic');
var config = require('../config');

var Tilesheet = Graphic.extend({

    tileheight: 0,
    tilewidth: 0,

    pivot: {
        x: 0,
        y: 0
    },

    // drawRegion: null,

    r: 360 * Math.PI / 180,

    init: function(path, options, callback) {
        this.parent(path, options, callback);

        this.tileheight = options.tileheight || options.tilesize;
        this.tilewidth = options.tilewidth || options.tilesize;


        this.pivot = {};
        this.pivot.x = this.tilewidth / 2;
        this.pivot.y = this.tileheight / 2;
    },

    drawTile: function(ctx, x, y, tile, scale, flip, angle, alpha, ignoreoffscreen) {
        if (!this.loaded || alpha <= 0) return;

        var rect = this.getRect(tile || 0, scale);
        var data = this.scaled[scale] || this.image;

        flip = flip || {};

        var sx = flip.x ? -1 : 1;
        var sy = flip.y ? -1 : 1;

        x = this.applyScale(x) + ~~config.display.offset.x;
        y = this.applyScale(y) + ~~config.display.offset.y;

        if (angle) {
            // TODO -> FIX
            var rw = config.display.realwidth;
            var rh = config.display.realheight;

            var a = angle % this.r;
            var xx = (a > 2.35) ? x - this.applyScale(rect.width) : x;
            var yy = (a > 0.78 && a < 2.35) ? y - this.applyScale(rect.height) : y;
            var w = rect.width;
            var h = rect.height;

            if (xx + w < 0 || xx > rw || yy + h < 0 || yy > rh) return;
            if (config.fog.enabled &&
                (xx < config.fog.area.x || xx + w > rw - config.fog.area.x ||
                    yy < config.fog.area.y || yy + h > rh - config.fog.area.y)) return;
        }

        ctx.save();


        if (alpha !== undefined && alpha < 1) {
            ctx.globalAlpha = Math.max(0, Math.min(alpha, 1));
        }

        if (flip) ctx.scale(sx, sy);
        if (angle) {
            ctx.translate(x, y);
            ctx.rotate(angle);
            x = 0;
            y = 0;
            ignoreoffscreen = true;
        }

        this.drawArea(ctx, data, x, y, rect.x, rect.y, rect.width, rect.height, sx, sy, ignoreoffscreen);

        ctx.restore();
    },

    getRect: function(tile, scale) {
        scale = scale || 1;

        var w = (tile >= 0) ? this.tilewidth : this.width;
        var h = (tile >= 0) ? this.tileheight : this.height;

        if (tile <= 0) tile = 0;

        var x = ~~ (tile * this.tilewidth) % this.width;
        var y = ~~ (tile * this.tilewidth / this.width) * this.tileheight;

        // if(this.drawRegion) {
        //     x = x+this.drawRegion.x;
        //     y = y+this.drawRegion.y;
        //     w = this.drawRegion.w;
        //     h = this.drawRegion.h;
        // }

        return {
            x: this.applyScale(x * scale),
            y: this.applyScale(y * scale),
            width: this.applyScale(w * scale),
            height: this.applyScale(h * scale)
        };
    }
});


module.exports = Tilesheet;
