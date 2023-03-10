var config = require('../config');
var Input = require('./input');
var p = require('./physics');
var media = require('../data/media');
var Assets = require('./assets');
var game = require('../game');

var Engine = Class.extend({
    game: null,

    canvas: null,
    context: null,
    ui: null,

    draws: 0,

    lastUpdate: 16,

    profiles: 0,

    init: function(gameConst) {
        this.initCanvas();

        if (!this.game) {
            Assets.loadAll(media);
            Assets.onReady(function() {
                if (!this.game) {
                    this.game = new game(this.context);
                }

            }, this);
        }

        this.initSounds();

        p.initDebug(this.context, config.display.scale);
        p.dragNDrop(window);

        this.tick();
    },

    initSounds: function() {
        soundManager.setup({
            url: 'media/swf/',
            flashVersion: 9,
            preferFlash: true,
            useHTML5Audio: true,
            useHighPerformance: false,
            onready: function() {
                Assets.loadSounds();
            }
        });
    },

    initCanvas: function() {
        this.canvas = document.getElementById('canvas');

        this.canvas.style.imageRendering = '-moz-crisp-edges';
        this.canvas.style.imageRendering = '-o-crisp-edges';
        this.canvas.style.imageRendering = '-webkit-optimize-contrast';
        this.canvas.style.imageRendering = 'crisp-edges';
        this.canvas.style.msInterpolationMode = 'nearest-neighbor';

        this.context = this.canvas.getContext('2d');
        this.context.imageSmoothingEnabled = false;
        this.context.webkitImageSmoothingEnabled = false;
        this.context.mozImageSmoothingEnabled = false;

        this.resize();
    },

    resize: function() {
        var w = window.innerWidth,
            h = window.innerHeight,
            s = (w > 1260 && h > 700) ? 3 : 2;

        this.canvas.width = config.display.width * s;
        this.canvas.height = config.display.height * s;
        config.display.realwidth = this.canvas.width;
        config.display.realheight = this.canvas.height;

        $('#ui').css('width', this.canvas.width);
        var uh = $('#ui').css('height').replace('px', '');
        $('#ui').css('padding-top', ~~ (h / 2 - uh / 2));
        $('#canvas').css('left', ~~ (w / 2 - this.canvas.width / 2) + "px").css('top', ~~ (h / 2 - this.canvas.height / 2) + "px");
        config.message.top = ~~ (h / 2 - 50);

        if (this.game && config.display.scale != s) {
            p.resizeDebug(s);
            config.display.scale = s;
            Assets.resizeAll();
        }

        config.display.scale = s;
    },

    update: function() {
        p.step();
        this.game.update();
    },

    clear: function() {
        if (!config.display.clearColor) {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        } else {
            this.context.fillStyle = config.display.clearColor;
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    },

    draw: function() {
        this.clear();

        this.game.draw();
        if (config.physics.debug) {
            p.draw();
        }
    },

    togglePause: function() {
        this.game.paused = !this.game.paused;

        if (!this.game.paused) {
            this.tick();
        }
    },

    tick: function() {
        if (!this.game || this.game.paused) {
            if (this.game) this.draw();
            return requestAnimFrame(this.tick.bind(this));
        }

        // Stats.begin();

        config.tick = (new Date()).getTime() - this.lastUpdate;
        this.lastUpdate = this.lastUpdate + config.tick;
        this.update();
        Input.update();

        requestAnimFrame(this.tick.bind(this));
        this.draw();

        // Stats.end();
    }
});


module.exports = Engine;
