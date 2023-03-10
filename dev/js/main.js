require('./lib/class.js');
require('./lib/requestAnimFrame');
require('./analytics');

var Input = require('./engine/input');

var engine;

$(function() {
    engine = new(require('./engine/engine'))();
});

$(window).resize(function() {
    if (engine) engine.resize.call(engine);
});

$(document).keydown(Input._down.bind(Input));
$(document).keyup(Input._up.bind(Input));
$(document).mousedown(Input._down.bind(Input));
$(document).mouseup(Input._up.bind(Input));
$(document).bind('contextmenu', function() {
    return false;
});


$('#github').click(function() {
    window.location = 'https://github.com/jeroenverfallie/game-off-2013';
});



