/*global require, define, document, console, alert */

// Have to use lowercase 'jquery' otherwise jQuery won't recognise it's been loaded via AMD.
require.config({
    paths: {
        'jquery': 'lib/jquery-1.9.1'
    }
});


require(['jquery', 'lib/q',  'lib/hot-cold-map', 'lib/request_anim_frame'], function ($, Q, hot_cold_map) {
    "use strict";

    var stopData, passengerData;


    // Works for pseudo iso8601 (would need to fix the backend to return proper iso8601)
    function parseDate(value) {
        var a;
        if (typeof value === 'string') {
            a = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z?$/.exec(value);
            if (a) {
                return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
            }
        }
        return value;
    }


    function logAjaxError(jqXHR, textStatus, errorThrown) {
        console.log("error " + textStatus);
        console.log("incoming Text " + jqXHR.responseText);
    }


    function draw(event) {
        var stop, stop_coords, delta, date;
        stop = event.s;
        stop_coords = stopData.stops[stop];
        delta = event.d;
        date = parseDate(event.t);
        console.log('aa');
    }


    function drawNextEvent() {
        requestAnimFrame(drawNextEvent);
        var event = passengerData.pop();
        draw(event);
    }


    function onData() {
        drawNextEvent();
    }


    Q.all([
        $.getJSON('data/gva-stops.json'),
        $.getJSON('data/gva-first-morning.json')
    ]).spread(
        function (rawStopData, rawPassengerData) {
            stopData = rawStopData;
            passengerData = rawPassengerData;
            onData();
        },
        logAjaxError
    ).fail( function (error) { console.log(error); });

});
