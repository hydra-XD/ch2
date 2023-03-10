var config = require('../config');

var Graphic = Class.extend({

    loaded: false,
    path: '',

    width: 0,
    height: 0,

    image: null,

    scaled: {},
    scale: [],

    _onloadCallback: null,


    init: function(path, options, callback) {
        this.path = path;
        this.scale = (options && options.scale) ? options.scale : [1];
        this.scaled = {};

        this._onloadCallback = callback;
        this._load();
    },

    applyScale: function(p) {
        return Math.round(p * config.display.scale);
    },

    drawArea: function(ctx, data, x, y, xs, ys, w, h, sx, sy, ignoreoffscreen) {
        var rw = config.display.realwidth;
        var rh = config.display.realheight;

        if (!ignoreoffscreen) {

            if (x + w < 0 || x > rw || y + h < 0 || y > rh) return;
            if (config.fog.enabled &&
                (x < config.fog.area.x || x + w > rw - config.fog.area.x ||
                    y < config.fog.area.y || y + h > rh - config.fog.area.y))
                return;

            if (x < 0 && x + w > 0) {
                w = w + x;
                xs = xs - x;
                x = 0;
            }

            if (x < rw && x + w > rw) {
                w = w - (x + w - rw);
            }

            if (y < 0 && y + h > 0) {
                h = h + y;
                ys = ys - y;
                y = 0;
            }

            if (y < rh && y + h > rh) {
                h = h - (y + h - rh);
            }

        }

        if (sx) x = x * sx - (sx < 0 ? w : 0);
        if (sy) y = y * sy - (sy < 0 ? h : 0);

        // debug.draws++;
        ctx.drawImage(
            data,
            xs, ys, w, h,
            x, y, w, h
        );
    },

    draw: function(ctx, x, y, scale) {
        if (!this.loaded) return;

        var data = this.scaled[scale] || this.image;

        this.drawArea(ctx, data, this.applyScale(x), this.applyScale(y), 0, 0, data.width, data.height);
    },

    _load: function() {
        if (this.loaded) return;

        this.image = new Image();
        this.image.onload = this._onload.bind(this);
        this.image.onerror = this._onerror.bind(this);

        this.image.src = this.path;
    },

    _onload: function() {
        this.loaded = true;

        this.width = this.image.width;
        this.height = this.image.height;

        this.resizeAll();

        this._onloadCallback(this.path);
    },

    resizeAll: function() {
        for (var i = 0; i < this.scale.length; i++) {
            this.scaled[this.scale[i]] = this.resize(this.image, this.scale[i]);
        }
    },

    _onerror: function() {
        throw ('An error happened while loading ' + this.path);
    },

    resize: function(img, scale) {
        if (this.scale === 1 && config.display.scale === 1) {
            return img;
        }

        scale = this.applyScale(scale);

        var sCanvas = document.createElement('canvas');
        sCanvas.width = img.width;
        sCanvas.height = img.height;

        var sCtx = sCanvas.getContext('2d');
        sCtx.drawImage(img, 0, 0);
        var sData = sCtx.getImageData(0, 0, img.width, img.height).data;

        var dw = img.width * scale;
        var dh = img.height * scale;

        var dCanvas = document.createElement('canvas');
        dCanvas.width = dw;
        dCanvas.height = dh;

        var dCtx = dCanvas.getContext('2d');

        var dImgData = dCtx.getImageData(0, 0, dw, dh);
        var dData = dImgData.data;

        var src_p = 0;
        var dst_p = 0;
        for (var y = 0; y < this.height; ++y) {
            for (var i = 0; i < scale; ++i) {
                for (var x = 0; x < this.width; ++x) {
                    src_p = 4 * (y * this.width + x);
                    for (var j = 0; j < scale; ++j) {
                        var tmp = src_p;
                        dData[dst_p++] = sData[tmp++];
                        dData[dst_p++] = sData[tmp++];
                        dData[dst_p++] = sData[tmp++];
                        dData[dst_p++] = sData[tmp++];
                    }
                }
            }
        }

        dCtx.putImageData(dImgData, 0, 0);

        return dCanvas;
    }

});


module.exports = Graphic;
