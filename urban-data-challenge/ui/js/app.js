/*global require, define, document, console, alert */

// Have to use lowercase 'jquery' otherwise jQuery won't recognise it's been loaded via AMD.
require.config({
    paths: {
        'jquery': 'lib/jquery-1.9.1.min'
    }
});


require(['jquery', 'lib/q.min',  'hot-cold-map', 'lib/json2'], function ($, Q, hot_cold_map) {
    "use strict";

    var stopData, passengerData;

    function parse(s) {
        return JSON.parse(s, dateJsonAdapter);
    }

    // Works for pseudo iso8601 (would need to fix this in the backend)
    function dateJsonAdapter (key, value) {
        var a;
        if (typeof value === 'string') {
            a = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z?$/.exec(value);
            if (a) {
                return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
            }
        }
        return value;
    };

    function logAjaxError(jqXHR, textStatus, errorThrown) {
        console.log("error " + textStatus);
        console.log("incoming Text " + jqXHR.responseText);
    }


    function onData() {
        console.log(stopData);
        console.log(passengerData);
    }


    Q.all([
        $.getJSON('data/gva-stops.json'),
        $.getJSON('data/gva-first-morning.json')
    ]).spread(function (rawStopData, rawPassengerData) {
        // XXX: why did I need to use responseText?
        stopData = parse(rawStopData.responseText);
        passengerData = parse(rawPassengerData.responseText);
        onData()
    }); // XXX error handling

});
