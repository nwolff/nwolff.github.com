/*global define, document, requestAnimFrame, Stats */


define(['../lib/hot-cold-map', '../lib/stats.min', '../lib/request_anim_frame'], function (hot_cold_map) {
    "use strict";

    var stats, mainCanvas, drawScore;

    drawScore = hot_cold_map.drawScore;


    function draw() {
        var ctx, time, i, score, x, y, snakeLen;

        stats.begin();

        ctx = mainCanvas.getContext("2d");

        ctx.fillStyle = 'rgb(0,0,0)';
        ctx.fillRect(0, 0, 500, 500);

        // A row of dark points
        drawScore(ctx, 30, 30, 1);
        drawScore(ctx, 120, 30, 0.75);
        drawScore(ctx, 150, 30, 0.5);
        drawScore(ctx, 190, 30, 0.25);
        drawScore(ctx, 220, 30, 0.1); // very faint
        drawScore(ctx, 250, 30, 0); // invisible

        // A row of bright points
        drawScore(ctx, 30, 70, -1);
        drawScore(ctx, 120, 70, -0.75);
        drawScore(ctx, 150, 70, -0.5);
        drawScore(ctx, 190, 70, -0.25);
        drawScore(ctx, 120, 70, -0.1); // very faint
        drawScore(ctx, 250, 70, 0); // invisible

        // A trail of circles turning around it
        time = new Date().getTime() * 0.0015;
        snakeLen = 20;
        for (i = 0; i < snakeLen; i += 1) {
            score = 1 - i / snakeLen;
            time -= 0.06;
            x = Math.sin(time) * 220 + 250;
            y = Math.cos(time * 0.8) * 220 + 250;
            drawScore(ctx, x, y, score);
            drawScore(ctx, y, x, -score);
        }
        stats.end();
    }


    function animate() {
        requestAnimFrame(animate);
        draw();
    }


    function demo() {
        mainCanvas = document.createElement("canvas");
        mainCanvas.id = "mainCanvas";
        mainCanvas.width = 500;
        mainCanvas.height = 500;
        document.body.appendChild(mainCanvas);

        stats = new Stats();
        document.body.appendChild(stats.domElement);

        animate();
    }

    demo();
});
