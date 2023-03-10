var Layer = require('./layer');
var config = require('../config');
var Assets = require('./assets');

var ImageLayer = Layer.extend({
    asset: null,

    images: [],

    needDeaths: 0,


    init: function(data, w, h, tw, th) {
        this.images = [];

        this.parent(data, w, h, tw, th);

        Object.$merge(data.properties, config.image);

        this.needDeaths = data.properties.needDeaths || 0;

        this.asset = Object.$get(Assets.Graphics, data.properties.asset);

        var fgid = data.properties.firstgid;
        for(var i = 0; i < data.data.length; i++) {
            var img = data.data[i]; 
            this.images.push({
                tile: (img.gid - fgid),
                x: img.x,
                y: img.y-this.asset.tileheight,
                angle: img.rotation,
                ignoreoffscreen: img.igos || false,
                alpha: img.alpha,
                flip: img.flip
            });
        }
    },

    draw: function(ctx, stats) {
        if(stats.deaths < this.needDeaths) return;
        for(var i = 0; i < this.images.length; i++) {
            var img = this.images[i];

            this.asset.drawTile(ctx, img.x, img.y, img.tile, this.scale, img.flip, img.angle, img.alpha, img.ignoreoffscreen);
        }
    }
});


module.exports = ImageLayer;
