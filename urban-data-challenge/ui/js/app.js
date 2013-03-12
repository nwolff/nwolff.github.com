/*global require, define, document, console, alert */

// Have to use lowercase 'jquery' otherwise jQuery won't recognise it's been loaded via AMD.
require.config({
    paths: {
        'jquery': 'lib/jquery-1.9.1',
        'moment': 'lib/moment'
    }
});


require(['jquery', 'lib/q', 'lib/hot-cold-map', 'moment', 'lib/request_anim_frame', 'lib/transform'], function ($, Q, hcmap, moment) {
    "use strict";

    var stopCoords, passengerData, mainCanvas, currentDate, timespan;


    function logAjaxError(jqXHR, textStatus) {
        console.log("error " + textStatus);
        console.log("incoming Text " + jqXHR.responseText);
    }


    function draw() {
        var ctx = mainCanvas.getContext("2d")
            , event, coords;

        // Display current time
        timespan.innerHTML = currentDate.format('YYYY-MM-DD HH:mm');

        // Fade
        //ctx.fillStyle = 'rgb(0,0,0)';
        //ctx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);

        // Collect passenger events for the current minute
        while (passengerData.length && currentDate.diff(passengerData[0].t) == 0) {
            event = passengerData.shift();
            coords = stopCoords[event.s];
            if (coords) {
                hcmap.drawScore(ctx, coords[0], coords[1], event.d);
            } else {
                console.log("unknown stop " + event.s);
            }
        }

        // Bump time
        currentDate.add('minutes', 1);
    }


    function animate() {
        if (passengerData.length) {
            requestAnimFrame(animate);
            draw();
        }
    }


    function dataReady() {
        if (passengerData.length) {
            currentDate = passengerData[0].t;
        }
        animate();
    }


    /**
     * - Parses the date inside each event with minute precision
     * - Normalizes the deltas to make them between -1 and 1
     */
    function normalizedPassengerData(data) {
        var maxAbsDelta, event, i;
        maxAbsDelta = 0;
        for (i = 0; i < data.length; i++) {
            event = data[i];
            maxAbsDelta = Math.max(maxAbsDelta, Math.abs(event.d));
            event.t = moment(event.t).seconds(0);
        }
        console.log('max abs delta was ' + maxAbsDelta);
        for (i = 0; i < data.length; i++) {
            event = data[i];
            event.d /= maxAbsDelta;
        }
        return data;
    }


    // This does not preserve aspect ratio!
    function normalizedCoords(d) {
        var t, bounds, result, stop, c;
        bounds = d.bounds;
        t = new Transform();
        t.scale(mainCanvas.width / (bounds.maxx - bounds.minx),
            mainCanvas.height / (bounds.maxy - bounds.miny));
        t.translate(-bounds.minx, -bounds.miny);
        result = [];
        for (stop in d.stops) {
            c = d.stops[stop];
            result[stop] = t.transformPoint(c[0], c[1]);
        }
        return result;
    }


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
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);

    //
    // Add the timer to the page
    //
    document.body.appendChild(document.createElement("br"));
    timespan = document.createElement("span");
    timespan.id = "timer";
    document.body.appendChild(timespan);

    //
    // Fetch data in parallel
    //
    Q.all([
            $.getJSON('data/gva-stops.json'),
            $.getJSON('data/gva-first-morning.json')
        ]).spread(
        function (rawStopData, rawPassengerData) {
            stopCoords = normalizedCoords(rawStopData);
            passengerData = normalizedPassengerData(rawPassengerData);
            dataReady();
        },
        logAjaxError
    ).fail(function (error) {
            console.log(error);
        });

});
