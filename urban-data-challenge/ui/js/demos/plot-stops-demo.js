/*global require, define, document, console */

// Have to use lowercase 'jquery' otherwise jQuery won't recognise it's been loaded via AMD.
require.config({
    paths: {
        'jquery': '../lib/jquery-1.9.1'
    }
});

define(['jquery'], function ($) {
    "use strict";

    var radius;
    radius = 0.05;

    function drawCircle(ctx, x, y) {
        ctx.beginPath();
        ctx.arc(x * 100, y * 100, radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }


    function drawData(stopData) {
        var mainCanvas, ctx, bounds, stops, stop_name, stop_coords;

        mainCanvas = document.createElement("canvas");
        mainCanvas.id = "mainCanvas";
        mainCanvas.width = 600;
        mainCanvas.height = 600;
        document.body.appendChild(mainCanvas);

        ctx = mainCanvas.getContext("2d");

        // Zero at bottom left
        ctx.translate(0, mainCanvas.height);
        ctx.scale(1, -1);

        // Make our dots visible
        bounds = stopData.bounds;
        ctx.scale(18, 18);
        ctx.translate(-(bounds.minx * 100), -(bounds.miny * 100));

        ctx.fillStyle = 'rgb(255,0,0)';
        drawCircle(ctx, 6.15, 46.2);

        ctx.fillStyle = 'rgb(127,127,127)';

        stops = stopData.stops;
        for (stop_name in stops) {
            stop_coords = stops[stop_name];
            drawCircle(ctx, stop_coords[0], stop_coords[1]);
        }
    }

    function start() {
        var gvaStopsPromise = $.getJSON('data/gva-stops.json');

        gvaStopsPromise.done(drawData);

        gvaStopsPromise.fail(function (jqXHR, textStatus) {
            console.log("error " + textStatus);
            console.log("incoming Text " + jqXHR.responseText);
        });
    }

    start();

});
