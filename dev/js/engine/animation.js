var Animation = Class.extend({
    tilesheet: null,
    scale: null,
    frametime: null,
    sequence: null,
    loop: null,

    looped: false,

    frame: 0,
    tile: 0,

    flip: {
        x: false,
        y: false
    },

    alpha: 1,

    offset: {
        x: 0,
        y: 0
    },

    init: function(tilesheet, scale, frametime, sequence, loop) {
        if (!tilesheet) throw ("Tilesheet not found!");


        this.flip = {
            x: false,
            y: false
        }
        this.offset = {
            x: 0,
            y: 0
        };

        this.scale = scale;
        this.tilesheet = tilesheet;
        this.frameTime = frametime;
        this.sequence = sequence;

        this.loop = loop == undefined ? true : false;

        this._initTime = (new Date()).getTime();

        this.tile = this.sequence[0];
    },

    reset: function() {
        this._initTime = (new Date()).getTime();
        this.tile = this.sequence[0];
        this.looped = false;
    },

    update: function() {
        var time = (new Date()).getTime();
        var currentFrame = ~~ (((time - this._initTime) / 1000) / this.frameTime);
        if (!this.loop && currentFrame > this.sequence.length - 1) {
            this.frame = this.sequence.length - 1;
            this.looped = true;
        } else {
            this.frame = currentFrame % this.sequence.length;
        }

        this.tile = this.sequence[this.frame];
    },

    forceNextFrame: function() {
        this.frame = (this.frame + 1) % sequence.length;
        this.tile = this.sequence[this.frame];
    },

    draw: function(ctx, x, y, angle) {
        this.tilesheet.drawTile(ctx, x+this.offset.x, y+this.offset.y, this.tile, this.scale, this.flip, angle, this.alpha);
    }

});


module.exports = Animation;
