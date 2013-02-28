/*global define, document */

define(['mout/math/clamp'], function (clamp) {
    "use strict";

    var radius, offset, darkCircleCanvas, lightCircleCanvas;
    radius = 30;
    offset = radius * 1.5;

    /**
     * Score is between -1 and 1
     */
    function drawScore(ctx, x, y, score) {
        score = clamp(score, -1, 1);
        ctx.save();
        if (score >= 0) {
            ctx.globalCompositeOperation = "lighter";
            ctx.globalAlpha = score;
            ctx.drawImage(darkCircleCanvas, x - offset, y - offset);
        } else {
            ctx.globalCompositeOperation = "lighter";
            ctx.globalAlpha = Math.abs(score);
            ctx.drawImage(lightCircleCanvas, x - offset, y - offset);
        }
        ctx.restore();
    }


    function drawBlurredCircle(ctx, x, y, color) {
        var shadowOffset = 1000;
        ctx.shadowOffsetX = shadowOffset;
        ctx.shadowOffsetY = shadowOffset;
        ctx.shadowBlur = 15;
        ctx.shadowColor = color;
        ctx.beginPath();
        ctx.arc(x - shadowOffset, y - shadowOffset, radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }


    function createCircleCanvas(color) {
        var canvas, ctx;
        canvas = document.createElement("canvas");
        canvas.width = canvas.height = radius * 3;
        drawBlurredCircle(canvas.getContext("2d"), offset, offset, color);
        return canvas;
    }


    function init() {
        // Prepare circles in offline buffers
        darkCircleCanvas = createCircleCanvas('rgb(0,64,127)');
        lightCircleCanvas = createCircleCanvas('rgb(127,64,0)');
    }

    init();

    return {
        drawScore: drawScore
    };

});