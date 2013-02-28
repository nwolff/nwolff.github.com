Tech
----

Want to run in the browser. Will use javascript or coffeescript.

- A heatmap library: http://www.patrick-wied.at/static/heatmapjs/showcases.html 
- With an animation library: http://www.patrick-wied.at/blog/heatmap-js-just-got-an-animation-package

A user of that lib: 

- http://heatmapdemo.alastair.is/
- http://blogging.alastair.is/improving-performance-never-underestimate-copy-and-paste/

I cannot use the heatmap lib as is, because I want negative scores as well. Will re-use ideas from the lib and hopefully some code,
the main thing I need to check is if I can use the canvas composition flags to manage negative scores http://tutorials.jenkov.com/html5-canvas/composition.html
In theory the 'lighter' globalCompositeOperation should do the trick.

Just remembered an old technique for aging: start each animation pass not by clearing the background but by fading it, 
either by copying it onto a blank canvas (with alpha), or by drawing a uniform rectangle of the neutral color on top (with alpha)).

Refs
----

- http://www.html5rocks.com/en/tutorials/canvas/performance/
- http://diveintohtml5.info/canvas.html

animating: 

- http://mrdoob.com/lab/javascript/requestanimationframe/
- http://www.html5canvastutorials.com/advanced/html5-canvas-animation-stage/

Canvas wrappers
---------------

Want to make life easier but don't want to spend ages learning these so I don't know if I will use one.


- http://jster.net/category/canvas-wrappers
- https://github.com/bebraw/jswiki/wiki/Canvas-wrappers
- http://www.designresourcebox.com/html5-canvas-wrapper-libraries-based-on-javascript/
