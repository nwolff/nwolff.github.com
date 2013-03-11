/*global require, define, document, console, alert */

// Have to use lowercase 'jquery' otherwise jQuery won't recognise it's been loaded via AMD.
require.config({
    paths: {
        'jquery': 'lib/jquery-1.9.1'
    }
});


require(['jquery', 'lib/q',  'lib/hot-cold-map', 'lib/request_anim_frame'], function ($, Q, hot_cold_map) {
    "use strict";

    var stopCoords, passengerData, mainCanvas;


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
        var coords, delta, date, ctx;
  
        coords = stopCoords[event.s];
        // delta = event.d;
        // date = parseDate(event.t);
        // console.log([coords, delta, date]);

        ctx = mainCanvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(coords[0], coords[1], 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }


    function drawNextEvent() {
        requestAnimFrame(drawNextEvent);
        draw(passengerData.pop());
    }


    // This does not preserve aspect ratio!
    function normalizedCoords(d) {
        var bounds, w, h, result, stop, c, x, y;
        bounds = d.bounds;
        w = bounds.maxx - bounds.minx;
        h = bounds.maxy - bounds.miny;
        result = [];
        for(stop in d.stops) {
            c = d.stops[stop];
            x = (c[0] - bounds.minx) / w * mainCanvas.width;
            y = (c[1] - bounds.miny) / h * mainCanvas.height;
            result[stop] = [x, y];
        }
        return result;
    }


    //
    // Programmatically create the canvas
    //
    mainCanvas = document.createElement("canvas");
    mainCanvas.id = "mainCanvas";
    mainCanvas.width = 600;
    mainCanvas.height = 600;
    document.body.appendChild(mainCanvas);
    // Zero at bottom left
    var ctx;
    ctx = mainCanvas.getContext("2d");
    ctx.translate(0, mainCanvas.height);
    ctx.scale(1, -1);

    Q.all([
        $.getJSON('data/gva-stops.json'),
        $.getJSON('data/gva-first-morning.json')
    ]).spread(
        function (rawStopData, rawPassengerData) {
            stopCoords = normalizedCoords(rawStopData);
            passengerData = rawPassengerData;
            drawNextEvent();
        },
        logAjaxError
    ).fail( function (error) { console.log(error); });


});
