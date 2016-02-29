# Paint by Worms, Elemental Edition

An interactive, generative art piece for JS1k 2016

[Try it out](http://js1k.com/2016-elemental/demo/2493)

## How to use

Clicking anywhere on the canvas spawns a generation of elemental "worms" which 
compete to paint the canvas by squirming around randomly, affecting the canvas
pixels which they pass over according to which element they represent.

Creating a new generation retires the previous one.

You can select the mixture of elements that you'd like to be present by toggling
the four buttons at the top left of the canvas:

1. Earth - Brings the colors of life to any pixel they traverse
2. Air - Brings lightness, and if their population is high enough, clouds
3. Fire - Scorches any pixel they touch, may burn deep pits if dominant
4. Water - May either nourish colorful life, or wash it away

## Performance

There was an opportunity to increase the performance by only doing the HSL-RGB
calculations once for each pixel but it turned out to be slightly too expensive
in terms of code size. 

I tested in the following browers:

### Firefox

A bit slow when run in a full-screen browser window on a high def monitor - I
often resized the browser window to make it a bit nicer. Not too painful - I did
the bulk of the development in Firefox due to my being the most comfortable with 
its dev tools.

### Chrome

Fast on all of the computers I tried, even in full screen. Friends said it was
fast even on mobile Chrome. I did the bulk of play-testing in Chrome as it was 
smoothest to play with.

### Edge

Pretty bad. Locks up the browser for a few seconds at startup and then runs 
quite slowly painting worms too. Works though.

### Safari

Didn't try on a desktop Mac, friends said it was OK. Was slow on my aging iPhone 
4S and suprisingly fast on my iPad Air.

## Process

I iterated a number of prototypes to try to get the balance right to create 
what I considered to be aethetically pleasing results - this was the bulk of the
work and took several days - I made copies whenever I made major changes, but in
retrospect should probably have set up this Github project at the beginning and
tracked all of my changes.

### prototype-1.js

Done entirely in the RGB space. I wasn't happy with the results and felt 
that I could make something nicer by working in HSL. One thing I did like about 
it was the blur algorithm. RGB colors tend to average towards grey, which is 
balanced out by the color worms, whereas HSL colors tend to average towards the 
middle of the color spectrum, cyan, with medium saturation and lightness. This
can end up making many of the resulting works a bit sameish, however to use the 
RGB blur while working in the HSL space I would have needed to use not just 
an HSL to RGB conversion (to get the HSL data onto the canvas), but an RGB to 
HSL conversion to keep the HSL data in sync with the RGB blur function - RGB to 
HSL is very expensive, and I couldn't get it down to less than about 200 bytes, 
so I decided to forgo it.

### prototype-2.js

First version to use HSL space. Not terribly different from the finished 
version, aside from a lot of trial-and-error balancing work, and without any
interactivity. At this point the goal was to get a pleasing end result, and also
to try to stabilise the worms so that images didn't quickly degenerate into all
black, white or grey etc.

### prototype-3.js

First version to have interactivity. This is the version that I spent the most
time balancing. Very close to the finished result, except in the final version 
I decided to start the canvas off as blank instead of already populated with 
worms, and also made many changes to the balance.

#### source-es6.js

Hand-minified from prototype-3.js. It uses ES6, which is not allowed in the 
competition, however I transpiled it to ES5 before packing, so the entry I made
complies with the no-ES6 rule.

Optimisations included but not limited to:

* Inlining functions where it saved room, and in some cases the opposite, 
  turning inline code into functions. Essential the more sameish you can make 
  your code, the better the packer performs, sometimes inlining functions makes 
  it more sameish, sometimes the opposite is true. It takes mixture of 
  experience, intuition, trial and error and measured comparisons to get the 
  right balance.
* Moving variables into arrays and processing them in loops, or moving them out
  of arrays and processing them in an unrolled fashion - all the caveats listed
  above apply
* Using all globals (no var declaration) - impacts performance but significant 
  byte saving
* Single character variable names - any minifier would normally do this, but I'd
  made the choice to make them all global, which minifiers won't rename
* Simplifiying the blur algorithm to sample fewer neighbouring pixels

My final version, transpiled to ES5 and then packed, came to 1011 bytes. As I
had spent a massive amount of time on this already, and as 13 bytes didn't feel
like enough to add anything much, I reordered some of the source to make it more
readable (grouping related things) at a slight expense in packing effiency.
This came to exactly 1024 bytes once transpiled and packed, which I took as a 
sign that my work was done.

#### source-es5.js

Transpiled and minified with 
[Google Closure](http://closure-compiler.appspot.com), to comply  with the 
competition requirement for ES5.

#### packed.js (1024 bytes)

Final version, packed with [reg-pack](http://siorki.github.io/regPack.html).
Suprisingly the default settings gave the best result, in previous years I 
generally had to tweak them.