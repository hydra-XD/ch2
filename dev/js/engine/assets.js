var config = require('../config');
var Graphic = require('./graphic');
var Tilesheet = require('./tilesheet');

var Assets = {
    Graphics: {},
    Sounds: {},
    Data: {},

    _sounds: [],

    callback: null,
    callbackscope: null,

    _stack: {
        unloaded: 0,
        items: {},
        total: 0
    },

    get ready() {
        return this._stack.unloaded <= 0;
    },

    get completion() {
        return 100 - (~~((this._stack.unloaded / this._stack.total) * 100));
    },

    _doneLoading: function(path) {
        this._stack.unloaded--;

        if (this._stack.unloaded <= 0) {
            this._stack.unloaded = 0;
            this._stack.items = {};
            this._stack.total = 0;
        }

        $('#leveltitle').text(this.completion != 100 ? 'Loading.. ' + this.completion + '% done!' : '');
        console.info(path + ' loaded - Completion: %c' + this.completion + ' %', 'color: green; font-size: 14px;');

    },

    _errorLoading: function(path) {
        console.warn(path + 'could not be loaded!');
    },

    _getPath: function(path, file) {
        path = path.split('.');
        path.pop();
        path = path.join('/');
        path = config.assetsPath + path + '/' + file;

        return path;
    },

    _loadImage: function(path, resource) {
        if (resource.file.indexOf('.') == -1) {
            resource.file += '.' + config.defaultExt.img;
        }

        var p = path.replace('img.', '');
        path = this._getPath(path, resource.file);

        var obj;
        if (resource.tilesize || (resource.tileheight && resource.tilewidth)) {
            obj = new Tilesheet(path, resource, this._doneLoading.bind(this));
        } else {
            obj = new Graphic(path, resource, this._doneLoading.bind(this));
        }

        Object.$set(Assets.Graphics, p, obj);

        window.Assets = Assets;
    },

    loadSounds: function() {
        var self = this;
        for (var i = 0; i < this._sounds.length; i++) {
            var s = this._sounds[i];
            var sound = soundManager.createSound({
                id: s.path,
                url: 'media/sounds/' + s.res.file,
                autoLoad: !!!s.res.stream,

                volume: s.res.volume || 100,
                stream: !!s.res.stream,
                multiShot: true,
                
                onload: function() {
                    if(!this.stream) self._doneLoading(this.url);
                }
            });

            if(s.res.stream) {
                self._doneLoading(sound.url);
            }

            Object.$set(Assets.Sounds, s.path.replace('sfx.', ''), sound);
        }

        this._sounds = null;
    },

    _loadSound: function(path, resource) {
        this._sounds.push({
            path: path,
            res: resource
        });
    },

    _loadData: function(path, resource) {
        var self = this;
        if (resource.file.indexOf('.') == -1) {
            resource.file += '.' + config.defaultExt.data;
        }

        var p = path.replace('data.', '');
        path = this._getPath(path, resource.file);

        try {
            var req = new XMLHttpRequest();
            req.onreadystatechange = function() {
                if (req.readyState == 4) {
                    var data = JSON.parse(req.responseText);
                    Object.$merge(data, resource);
                    Object.$set(Assets.Data, p, data);
                    self._doneLoading(path);
                }
            };
            req.open('GET', path, true);
            req.send(null);
        } catch (e) {
            throw (e);
        }
    },

    _load: function(obj, path) {
        if (!path || !obj) return;

        var self = Assets;
        var resource = Object.$get(obj, path);

        if (!resource) return;

        var type = path.split('.')[0];
        switch (type) {
            case 'sfx':
                self._loadSound(path, resource);
                break;
            case 'img':
                self._loadImage(path, resource);
                break;
            case 'data':
                self._loadData(path, resource);
                break;
        }
    },

    loadAll: function(data, path) {
        var self = Assets;

        var obj = Object.$get(data, path);
        for (var o in obj) {
            var p = (path) ? path + '.' + o : o;

            if (obj[o].file) {
                this._stack.items[p] = obj[o];
                this._stack.unloaded++;
                this._stack.total++;
            } else if (typeof obj[o] == 'object') {
                self.loadAll(data, p);
            }
        }

        if (!path) {
            for (var a in this._stack.items) {
                this._load(data, a);
            }
        }
    },

    resizeAll: function(path) {
        var self = Assets;

        var obj = Object.$get(Assets.Graphics, path);
        for (var o in obj) {
            var p = (path) ? path + '.' + o : o;

            if (obj[o] instanceof Graphic) {
                obj[o].resizeAll();
            } else {
                self.resizeAll(p);
            }
        }
    },

    onReady: function(callback, scope) {
        this.callback = callback;
        this.callbackscope = scope;
        this.tick();
    },

    tick: function() {
        if (this.ready) {
            this.callback.call(this.callbackscope);
            return;
        }

        requestAnimFrame(this.tick.bind(this));
    }
};

module.exports = Assets;
