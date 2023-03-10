var config = require('./config');
var Level = require('./level');
var Entity = require('../entity');

var Input = require('./engine/input');
var Keys = require('./engine/keys');

var p = require('./engine/physics');

var Assets = require('./engine/assets');
var Message = require('./engine/message');

var Game = Class.extend({
    player: null,
    level: null,

    context: null,
    paused: true,

    currentLevelData: null,
    currentLevelId: 'intro',

    stats: {
        restarts: 0,
        deaths: 0,
        starttime: 0,
        transforms: 0
    },

    shakeDuration: -1,
    shakeForce: 0,

    soundMuted: false,

    bgMusicCurrent: null,
    bgMusic: true,

    waitingForNext: true,

    init: function(context) {
        Input.bind("right", [Keys.D, Keys.RIGHT_ARROW]);
        Input.bind("left", [Keys.Q, Keys.A, Keys.LEFT_ARROW]);
        Input.bind("up", [Keys.Z, Keys.SPACE, Keys.UP_ARROW, Keys.W]);
        Input.bind("down", [Keys.S, Keys.DOWN_ARROW]);
        Input.bind("morph", [Keys.E]);
        Input.bind("restart", [Keys.R]);
        Input.bind("nextLevel", [Keys.N, Keys.ENTER]);
        Input.bind("softlockreset", [Keys.X]);


        $('#ui').fadeIn(1000);
        $('#icons-top .right').fadeIn(1000);


        this.context = context;
        this.loadLevel('intro');

        var self = this;
        $('#levels').on('click', '.level', function() {
            var lvl = parseInt($(this).data('level'));
            if (lvl > parseInt(localStorage.getItem('unlocked'))) return;

            self.resetStats();
            self.loadLevel(lvl);
            showLevels(false);
            showGame();
        });

        $('.mute').click(function() {
            var a = $(this)
            a.toggleClass('muted');
            self.soundMuted = a.hasClass('muted');
        });

        $('.music').click(function() {
            var a = $(this);
            a.toggleClass('muted');
            self.bgMusic = !a.hasClass('muted');
            if (self.bgMusic) {
                self.playMusic();
            } else {
                if (self.bgMusicCurrent) self.bgMusicCurrent.stop();
            }
        });


        $('#menu .menu').click(function() {
            $('#leveltitle').hide();
            showLevels(false);
            showIntro(true);
            showGame(false);
            self.loadLevel('intro');
        });

        var b;
        $('.pause').click(function() {
            var a = $('.pause');
            if (a.hasClass('paused')) {
                self.pauseGame(false);
                showGame();
                b.fadeOut(300, function() {
                    $(this).remove();
                });
            } else {
                showGame(false, true);
                self.pauseGame(true);
                b = Message.spawn('Paused!', '#AAE0F4');
            }
        });

        $('.play').click(function() {
            showLevels(false);
            showGame();
            self.pauseGame(false);
        });

        $('#play').click(function() {
            showIntro(false);
            showLevels(true);
            self.pauseGame(true);
        });

        $('.restart').click(function() {
            showLevels(false);
            $('#morphs').fadeOut(500);
            $('#canvas').fadeTo(300, .05, function() {
                self.restartLevel();
                showGame();
            });
        });

        $('.retry').click(function() {
            showEnd(false);
            showGame();
            self.retryLevel();
        });

        $('#icons-top .menu').click(function() {
            showGame(false);
            showLevels();
            self.pauseGame(true);
        });

        $('#morphs > div').on('click', 'div', function(e) {
            self.level.setActiveMorph($(this).attr('id') - 1);
        });

        $('#morphs > div').on('mouseover', 'div', function(e) {
            var info = $(this).data('info');
            if (!info) info = "Empty";

            $('#morphs > span').text(info);
        });

        $('#morphs > div').on('mouseout', 'div', function(e) {
            var info = self.level.morphs[self.level.activemorph];
            info = (info && info.count > 0) ? info.info : 'Empty';
            $('#morphs > span').text(info);
        });



        $('#btns .menu').click(function() {
            showEnd(false);
            showLevels(true);
        });

        $('#btns .next').click(function() {
            showGame(false);
            showEnd(false);
            self.nextLevel();
            showGame();
        });

        this.initLevels();
        this.playMusic();

        if (config.debug) {
            self.resetStats();
            this.loadLevel(config.debug.level);
            showIntro(false);
            showGame();
        }


        function showGame(show, paused) {
            if (show == undefined || show) {
                $('#leveltitle').fadeIn();
                $('#icons-top .left').fadeIn();
                $('#canvas').fadeTo(300, 1);
                if (self.currentLevelId != '0') $('#morphs').delay(400).fadeIn();
            } else {
                if (!paused) $('#icons-top .left').hide();
                $('#canvas').fadeTo(300, 0.05);
                $('#morphs').hide();
            }
        }

        function showEnd(show) {
            if (show === undefined || show) {
                $('#end').fadeIn();
            } else {
                $('#end').hide();
                $('#ui .message').remove();
            }
        }

        function showIntro(show) {
            if (show === undefined || show) {
                $('#intro').fadeIn();
            } else {
                $('#intro').hide();
            }
        }

        function showLevels(show) {
            if (b) {
                b.remove();
            }


            if (self.currentLevelId != 'intro') {
                $('#menu .play:hidden').show();
                $('#menu .restart').show();
            } else {
                $('#menu .restart').hide();
                $('#menu .play').hide();
            }

            if (show === undefined || show) {
                $('#levelselect').fadeIn();
            } else {
                $('#levelselect').hide();
            }
        }

        this.ui = {
            showEnd: showEnd,
            showGame: showGame,
            showLevels: showLevels,
            showIntro: showIntro
        };
    },

    initLevels: function() {
        var n = 0,
            unlocked = localStorage.getItem('unlocked');
        if (!unlocked) {
            localStorage.setItem('unlocked', 0);
            unlocked = 0;
        }
        for (var i in Assets.Data.levels) {
            if (isNaN(i)) continue;
            var lvlbtn = $('<div class="level"></div>');

            if (parseInt(i) > parseInt(unlocked)) {
                lvlbtn.addClass('locked');
            }

            lvlbtn.data('level', i);
            lvlbtn.text(++n);
            $('#levels').append(lvlbtn);
        }
    },

    playMusic: function() {
        var self = this;
        var sound = soundManager.createSound({
            id: 'bg',
            url: 'media/music/bg.mp3',
            stream: true,
            volume: 5
        });

        var alt = soundManager.createSound({
            id: 'bg_alt',
            url: 'media/music/bg_alt.mp3',
            stream: true,
            volume: 5
        });

        var alt2 = soundManager.createSound({
            id: 'bg_alt_2',
            url: 'media/music/bg_alt_2.mp3',
            stream: true,
            volume: 5
        });

        sound.next = alt;
        alt.next = alt2;
        alt2.next = sound;

        function loopSound(sound) {
            if (!self.bgMusic) return;
            if (self.bgMusicCurrent) self.bgMusicCurrent.stop();
            sound.play({
                onfinish: function() {
                    loopSound(sound.next);
                }
            });
            self.bgMusicCurrent = sound;
        }

        loopSound(self.bgMusicCurrent ? self.bgMusicCurrent.next : sound);
    },

    playSound: function(sound, onlyOneInstance, options) {
        if (this.soundMuted) return;
        if (typeof(sound) === "string") {
            sound = Object.$get(Assets.Sounds, sound);
        }

        if (typeof(onlyOneInstance) === "object") {
            options = onlyOneInstance;
            onlyOneInstance = false;
        }

        if (!onlyOneInstance || (onlyOneInstance && sound.playState === 0)) sound.play(options);
    },

    showMessage: function(message, color, duration, options, nofade, callback) {
        return Message.spawn(message, color, duration, options, nofade, callback);
    },

    pauseGame: function(paused) {
        if (paused == undefined) paused = true;
        this.paused = paused;
        p.setPaused(paused);

        var a = $('.pause');
        if (!paused && a.hasClass('paused')) {
            a.removeClass('paused');
        } else {
            if (paused && !a.hasClass('paused')) a.addClass('paused');
        }
    },

    endLevel: function(flip) {
        this.level.camera.max.x = Infinity;
        this.level.camera.min.y = -Infinity;
        this.level.camera.max.y = Infinity;
        this.level.camera.min.x = -Infinity;
        this.level.player.endLevel(this.level, flip);

        var self = this;

        var time = ~~(((new Date()).getTime() - this.stats.starttime) / 1000);

        ga('send', 'event', 'finish level', this.currentLevelId, time);

        $('#stats #time').text(time + '');
        $('#stats #restarts').text(this.stats.restarts + '');
        $('#stats #deaths').text(this.stats.deaths + '');
        $('#stats #transforms').text(this.stats.transforms + '');
           
        $('#morphs').fadeOut();
        $('#icons-top .left').fadeOut();
        var a, b = $('#end').height();
        a = this.showMessage('Level Complete!', '#99FC87', 1500, {
            top: config.message.top - b,
            color: jQuery.Color('#FBCF95'),
            el: "#ui"
        }, true, function() {
            var h = a.height();

            $('#end').css('top', config.message.top - b / 2 + h).fadeIn(400);
            self.waitingForNext = true;
        });


        var next = this.currentLevelData.next;
        if (!isNaN(next)) {

            var unlocked = parseInt(localStorage.getItem('unlocked'));
            if (parseInt(next) > unlocked) {
                localStorage.setItem('unlocked', unlocked + 1);
                $($('.level')[parseInt(next)]).removeClass('locked');
            }
        }
    },

    retryLevel: function() {
        this.resetStats();
        this.loadLevel(this.currentLevelId);
    },

    resetStats: function() {
        this.stats.restarts = 0;
        this.stats.starttime = (new Date()).getTime();
        this.stats.deaths = 0;
        this.stats.transforms = 0;
    },

    nextLevel: function() {
        this.resetStats();
        this.loadLevel(this.currentLevelData.next);
    },

    showGame: function() {
        $('#levels').hide();
        $('#icons-top').show();
        $('#icons-menu').hide();
        $('#intro').hide();
        $('#canvas').fadeTo(300, 1);
    },

    restartLevel: function() {
        this.stats.restarts++;
        this.loadLevel(this.currentLevelId);
    },

    loadLevel: function(id) {
        ga('send', 'event', 'enter level', id);
        var level = Assets.Data.levels[id];
        if (!level) return;

        if (!isNaN(id)) {
            var n = parseInt(id);
            if (n > parseInt(localStorage.getItem('unlocked'))) return;
        }

        this.level = new Level(level, this.stats);
        this.currentLevelData = level;
        this.currentLevelId = id;

        var s = "";
        if (!isNaN(id)) {
            s = (parseInt(id) + 1) + ". ";
        }
        $('#leveltitle').text(s + level.title);

        if (id == '0') this.level.setActiveMorph(2);
        this.pauseGame(false);
        this.waitingForNext = false;
    },

    shake: function(duration, force) {
        this.shakeForce = force;
        this.shakeDuration = duration;
    },

    update: function() {
        var player = this.level.player;
        if (Input.isPressed('restart') && !this.waitingForNext) {
            var self = this;
            $('#morphs').fadeOut(500);
            $('#canvas').fadeTo(300, .05, function() {
                self.restartLevel();
                $('#icons-top .left').fadeIn();
                $('#canvas').fadeTo(300, 1);
                if (self.currentLevelId != '0') $('#morphs').delay(400).fadeIn();
            });
        }

        if(Input.isPressed('softlockreset')) {
            player.hitTime = 1;
            player.kill(this);
        }

        if(Input.isPressed('nextLevel') && this.waitingForNext) {
            this.ui.showGame(false);
            this.ui.showEnd(false);
            this.nextLevel();
            this.ui.showGame();
        }

        if (config.debug && Input.isPressed(Keys.P)) {
            config.physics.debug = !config.physics.debug;
        }


        this.level.update(this);

        if (this.shakeDuration > 0) {
            this.shakeDuration = this.shakeDuration - config.tick;
            var forceX = Math.random() * this.shakeForce / 2 - this.shakeForce;
            var forceY = Math.random() * this.shakeForce / 2 - this.shakeForce;
            config.display.shake = {
                x: forceX,
                y: forceY
            };

        } else {
            config.display.shake = {
                x: 0,
                y: 0
            };
        }
    },

    draw: function() {
        this.level.draw(this.context);
    }
});

module.exports = Game;
