/*global require, define, document, console, alert */

// Have to use lowercase 'jquery' otherwise jQuery won't recognise it's been loaded via AMD.
require.config({
    paths: {
        'jquery': 'lib/jquery-1.9.1.min'
    }
});


require(['jquery', 'lib/q.min',  'hot-cold-map'], function ($, Q, hot_cold_map) {
    "use strict";

    var stopData, passengerData;

    function logAjaxError(jqXHR, textStatus, errorThrown) {
        console.log("error " + textStatus);
        console.log("incoming Text " + jqXHR.responseText);
    }

    Q.all([
        $.getJSON('data/gva-stops.json'),
        $.getJSON('data/gva-first-morning.json')
    ]).spread(function (stopData, passengerData) {
        alert("stopData " + stopData);
        alert("passengerData" + passengerData);
    }); // XXX error handling

});
