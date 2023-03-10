(function() {
    var initializing = false,
        fnTest = /xyz/.test(function() {
            xyz
        }) ? /\bparent\b/ : /.*/;
    this.Class = function() {};
    Class.extend = function(e) {
        function i() {
            if (!initializing && this.init) this.init.apply(this, arguments)
        }
        var t = this.prototype;
        initializing = true;
        var n = new this;
        initializing = false;
        for (var r in e) {
            n[r] = typeof e[r] == "function" && typeof t[r] == "function" && fnTest.test(e[r]) ? function(e, n) {
                return function() {
                    var r = this.parent;
                    this.parent = t[e];
                    var i = n.apply(this, arguments);
                    this.parent = r;
                    return i
                }
            }(r, e[r]) : e[r]
        }
        i.prototype = n;
        i.prototype.constructor = i;
        i.extend = arguments.callee;
        return i
    }

    Object.$get = function(o, path) {
        if (!path) return o;

        var a = path.split('.');
        while (a.length) {
            var n = a.shift();
            if (n in o) {
                o = o[n];
            } else {
                return;
            }
        }
        return o;
    };

    Object.$set = function(o, path, val) {
        if (!path) return;

        var a = path.split('.');
        while (a.length) {
            var n = a.shift();
            if (a.length > 0) {
                o[n] = o[n] || {};
                o = o[n];
            } else {
                o[n] = val;
            }
        }
    };

    Object.$merge = function(obj, other, override) {
        if (!obj || !other) return;

        for (var prop in other) {
            if (!obj[prop] || override) obj[prop] = other[prop];
        }
    };

    Array.prototype.indexOf = function(v) {
        for (var i = 0, l = this.length; i < l; i++) {
            if (this[i] === v) {
                return i;
            }
        }
        return -1;
    }
})();
