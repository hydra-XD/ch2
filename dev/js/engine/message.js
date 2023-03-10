var config = require('../config').message;

var Message = {

    spawn: function(message, color, duration, options, nofade, callback) {
        var element = $('<div class="message center"></div>');
        var e = "#container";
        if(options && options.el) e = options.el;
        $(e).append(element);

        element.text(message);
        element.css('top', config.top);
        element.css('color', color);

        if(!duration) return element;

        if (options !== false) {
            if (options) {
                if(!nofade) options.opacity = options.opacity || 0;
                element.animate(options, duration, function() {
                    if(!nofade) $(this).remove();
                    if(callback) callback();
                });
            } else {
                element.fadeOut(duration, function() {
                    $(this).remove();
                });
            }
        }

        return element;
        
    }


}

module.exports = Message;
