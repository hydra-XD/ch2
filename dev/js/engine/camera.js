var config = require('../config');

Number.prototype.limit = function(min, max) {
    return Math.min(max, Math.max(min, this));
};

/* A camera implemenation by DOMINIC SZABLEWSKI., based on SHAUN INMAN's example trap based viewport */

var Camera = Class.extend({
    trap: {
        pos: {
            x: 0,
            y: 0
        },
        size: {
            x: 128,
            y: 16
        }
    },
    max: {
        x: 0,
        y: 0
    },
    min: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    pos: {
        x: 0,
        y: 0
    },
    damping: 5,
    lookAhead: {
        x: 0,
        y: 0
    },
    currentLookAhead: {
        x: 0,
        y: 0
    },


    init: function(offsetX, offsetY, damping) {
        this.offset.x = offsetX;
        this.offset.y = offsetY;
        this.damping = damping;
    },


    set: function(entity) {
        this.pos.x = entity.pos.x - this.offset.x;
        this.pos.y = entity.pos.y - this.offset.y;

        this.trap.pos.x = entity.pos.x - this.trap.size.x / 2;
        this.trap.pos.y = entity.pos.y - this.trap.size.y;
    },


    follow: function(entity) {
        this.pos.x = this.move('x', entity.pos.x, entity.width);
        this.pos.y = this.move('y', entity.pos.y, entity.height);

        config.display.offset.x = -this.pos.x * config.display.scale + config.display.shake.x;
        config.display.offset.y = -this.pos.y * config.display.scale + config.display.shake.y;
    },


    move: function(axis, pos, size) {
        var lookAhead = 0;
        if (pos < this.trap.pos[axis]) {
            this.trap.pos[axis] = pos;
            this.currentLookAhead[axis] = this.lookAhead[axis];
        } else if (pos + size > this.trap.pos[axis] + this.trap.size[axis]) {
            this.trap.pos[axis] = pos + size - this.trap.size[axis];
            this.currentLookAhead[axis] = -this.lookAhead[axis];
        }

        return (
            this.pos[axis] - (
                this.pos[axis] - this.trap.pos[axis] + this.offset[axis] + this.currentLookAhead[axis]
            ) * 0.16 * this.damping
        ).limit(this.min[axis], this.max[axis]);
    },


    draw: function(ctx) {
        ctx.fillStyle = 'rgba(255,0,255,0.3)';
        ctx.fillRect(
            (this.trap.pos.x - this.pos.x) * config.display.scale, (this.trap.pos.y - this.pos.y) * config.display.scale,
            this.trap.size.x * config.display.scale,
            this.trap.size.y * config.display.scale
        );
    }
});

module.exports = Camera;