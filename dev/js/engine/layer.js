var Layer = Class.extend({
    name: null,
    data: [],

    width: 1,
    height: 1,

    tilewidth: 1,
    tileheight: 1,

    scale: 1,
    
    foreground: false,

    init: function(data, w, h, tw, th) {
        this.name = data.name;
        this.data = data.data;
        this.width = w;
        this.height = h;
        this.tilewidth = tw;
        this.tileheight = th;

        this.foreground = (data.properties && data.properties.foreground);
    },

    preRender: function() {

    },

});

module.exports = Layer;