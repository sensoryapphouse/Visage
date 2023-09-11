// This work is modified based on Matter.js + p5.js Example from Daniel Shiffman
// https://github.com/CodingTrain/p5-matter

// Buttons
// L & R to change shapes (imageSet 0 - 4 )
// 1. normal, not blinking, shades or eyepatch
// 2. size of objects
// 3. Number of objects
// 4. Colours // use both sets of colours & invert with hue-shift

var Engine = Matter.Engine;
var Render = Matter.Render;
var World = Matter.World;
var Bodies = Matter.Bodies;
var Composite = Matter.Composite;
var Composites = Matter.Composites;

let colours0 = "008dd5-dfbbb1-f56476-e43f6f-F7A072".split("-").map(a => "#" + a)
let colours1 = "00FF00-00FFFF-FF0000-FF00FF-FF00FF".split("-").map(a => "#" + a)
var colours = colours0;

var Mouse = Matter.Mouse;
var MouseConstraint = Matter.MouseConstraint;

var engine;
var world;
var bodies = [];
var cir = [];

var mouseConstraint;
let overAllTexture
var ground;
var wall1;
var wall2;
var top;
var imageSet = 3;
var blinking = true;
var mouthAndNose = false;
var shades = false;
var eyePatch = false;
var number = 1; // 1, .7, .5

var splash;
var button;
var button1;
var button2;
var button3;
var buttonl;
var buttonr;
var crosshairs;
var canvas;
var bdy;

window.onload = function () {
    splash = document.querySelector('splash');
    splash.onmousedown = function (e) {
        e.stopPropagation();
        splash.hidden = true;
    }
    button = document.querySelector('button');
    button1 = document.querySelector('button1');
    button2 = document.querySelector('button2');
    button3 = document.querySelector('button3');
    buttonl = document.querySelector('buttonl');
    buttonr = document.querySelector('buttonr');
    bdy = document.getElementById('body');
    button.onmousedown = function (e) {
        e.stopPropagation();
        Action(1);
    }
    button1.onmousedown = function (e) {
        e.stopPropagation();
        Action(2);
    }
    button2.onmousedown = function (e) {
        e.stopPropagation();
        Action(3);
    }
    button3.onmousedown = function (e) {
        e.stopPropagation();
        Action(4);
    }
    buttonl.onmousedown = function (e) {
        e.stopPropagation();
        Action(5);
    }
    buttonr.onmousedown = function (e) {
        e.stopPropagation();
        Action(6);
    }

    crosshairs = document.querySelector('crosshairs');
    crosshairs.hidden = true;
}


window.onkeypress = function (e) {
    if (!splash.hidden) {
        splash.hidden = true;
        return;
    }

    if (e.repeat)
        return;
    switch (e.keyCode) {
        case 32:
        case 49:
            Action(1);
            break;
        case 50:
            Action(2);
            break;
        case 51:
        case 13:
            Action(3);
            break;
        case 52:
            Action(4);
            break;
        case 53:
            toggleButtons();
            break;
        case 95:
            Action(5);
            break;
        case 43:
            Action(6);
            break;
    }
}

function toggleButtons() {
    button.hidden = !button.hidden;
    button1.hidden = !button1.hidden;
    button2.hidden = !button2.hidden;
    button3.hidden = !button3.hidden;
    buttonl.hidden = !buttonl.hidden;
    buttonr.hidden = !buttonr.hidden;
}

var player;
var player1;
var player2;
var player3;

function PlaySound(i) {
    try {
        switch (i) {
            case 1:
                if (player == undefined) {
                    player = document.getElementById('audio');
                    player.loop = false;
                }
                player.load();
                player.play();
                break;
            case 2:
                if (player1 == undefined) {
                    player1 = document.getElementById('audio1');
                }
                player1.load();
                player1.play();
                break;
            case 3:
                if (player2 == undefined) {
                    player2 = document.getElementById('audio2');
                }
                player2.load();
                player2.play();
                break;
            case 4:
                if (player3 == undefined) {
                    player3 = document.getElementById('audio3');
                }
                player3.load();
                player3.play();
                break;
        }
    } catch (e) {};
}


//    Button 4: colours - change hue(canvas) and invert(body and canvas) + ghosting
alternating = false;
var huecount = 0;
var invert = false;
var style = 0;
var setSpanCount = 0;

function Action(i) {
    console.log(i);
    var tmp;
    var signx;
    var signy;
    // 1. normal, not blinking, shades or eyepatch
    // 2. size of objects
    // 3. Number of objects
    // 4. Colours // use both sets of colours & invert with hue-shift
    switch (i) {
        case 1: // make 3 object move - see cyclops code
            for (i = 0; i < 3; i++) {
                tmp = Math.floor(Math.random() * bodies.length);
                if (bodies[tmp].position.x < window.innerWidth / 2)
                    signx = 1;
                else
                    signx = -1;
                if (bodies[tmp].position.y < window.innerHeight / 2)
                    signy = 1;
                else
                    signy = -1;
                if (number == 1)
                    Matter.Body.applyForce(bodies[tmp], bodies[tmp].position, {
                        x: (Math.random() * signx) * 10,
                        y: (Math.random() * signy) * 10
                    });
                else
                    Matter.Body.applyForce(bodies[tmp], bodies[tmp].position, {
                        x: (Math.random() * signx) * 2,
                        y: (Math.random() * signy) * 2
                    });
            }
            PlaySound(1);
            break;
        case 2: //normal, shades or eyepatch
            style++;
            if (style > 2) {
                style = 0;
            }
            switch (style) {
                case 0: // default blinking, no shades, no eyepatch
                    blinking = true;
                    shades = false;
                    eyePatch = false;
                    break;
                case 1: // shades, no blinking, no eyepatch
                    blinking = false;
                    shades = true;
                    eyePatch = false;
                    break;
                case 2: // eyepatch
                    blinking = true;
                    shades = false;
                    eyePatch = true;
                    break;
            }
            PlaySound(2);
            break;
        case 3: // Number of objects 1; // 1, .7, .5
            switch (number) {
                case 1:
                    number = .7;
                    break;
                case .7:
                    number = .5;
                    break;
                case .5:
                    number = 1.
            }
            windowResized();
            PlaySound(3);
            break;
        case 4: //   Colours // use both sets of colours & invert with hue-shift
            huecount++;
            if (huecount > 5) {
                huecount = 0;
                if (colours == colours0)
                    colours = colours1;
                else {
                    colours = colours0;
                    invert = !invert;
                }
                windowResized();
            }
            if (invert) {
                bdy.style.filter = "invert(100%) hue-rotate(" + (huecount * 60) + "deg)";
                button.style.filter = button1.style.filter = button2.style.filter = button3.style.filter = buttonl.style.filter = buttonr.style.filter = "invert(100%)"
            } else {
                bdy.style.filter = "hue-rotate(" + (huecount * 60) + "deg)";
                button.style.filter = button1.style.filter = button2.style.filter = button3.style.filter = buttonl.style.filter = buttonr.style.filter = ""
            }
            PlaySound(4);
            break;
        case 5: // previous set
            imageSet--;
            if (imageSet < 0)
                imageSet = 6;
            break;
        case 6: // next set
            imageSet++;
            if (imageSet > 6)
                imageSet = 0;
            break;
        case 7: // toggle buttons
            toggleButtons();
            break;
    }
}

function setup() {
    canvas = createCanvas(window.innerWidth, window.innerHeight);
    overAllTexture = createGraphics(width, height)
    overAllTexture.loadPixels()
    // noStroke()
    for (var i = 0; i < width + 50; i++) {
        for (var o = 0; o < height + 50; o++) {
            overAllTexture.set(i, o, color(100, noise(i / 3, o / 10, i * o / 50) * random([0, 30, 60])))
        }
    }
    overAllTexture.updatePixels()

    // Mouse positions don't align
    // But it does work if I force pixel density of 1
    // pixelDensity(1);
    // Can I instead tell mouse to divide its xy by 2?

    // create an engine
    engine = Engine.create();
    world = engine.world;

    var mouse = Mouse.create(canvas.elt);
    var mouseParams = {
        mouse: mouse,
        constraint: {
            stiffness: 0.1,
        }
    }
    mouseConstraint = MouseConstraint.create(engine, mouseParams);
    mouseConstraint.mouse.pixelRatio = pixelDensity();
    World.add(world, mouseConstraint);

    var params = {
        isStatic: true
    }
    var ground = Bodies.rectangle(width / 2, height, width, 50, params);
    var wall1 = Bodies.rectangle(0, height / 2, 50, height, params);
    var wall2 = Bodies.rectangle(width, height / 2, 50, height, params);
    var top = Bodies.rectangle(width / 2, 0, width, 50, params);
    World.add(world, [ground, wall1, wall2, top]);

    function makeCircle(x, y, r) {
        var params = {
            restitution: 0.7,
            friction: 0.3
        }
        let cir = Bodies.circle(x, y, random(40, 70), params); // (49,51) ,(40,70), (20,90)

        cir.color = random(colours)
        cir.spots = []
        for (var i = 0; i < 10; i++) {
            cir.spots.push({
                x: random(-0.8, 0.8) * random(),
                y: random(-0.8, 0.8) * random(),
                r: random(0, 0.5)
            })
        }
        return cir;
    }

    for (var i = 0; i < width; i += 170) {
        for (var o = 0; o < height * number; o += 60) { // height, height *.5, height * .7
            let cir = makeCircle(i, o)
            World.add(world, cir);
            bodies.push(cir)
        }
    }

    drawingContext.shadowColor = color(0, 30);
    drawingContext.shadowOffsetY = 2
    drawingContext.shadowOffsetX = 2

    // run the engine
    Engine.run(engine);
}

function draw() {
    fill(20, 20, 80); // background colour
    rect(0, 0, width, height)
    strokeWeight(5) // width of mouth
    for (var i = 0; i < bodies.length; i++) {
        var circle = bodies[i];
        var pos = circle.position;
        var r = circle.circleRadius * 1.2;
        var angle = circle.angle;

        push();
        noStroke()
        translate(pos.x, pos.y);
        rotate(angle);
        var fringeSize = 1.4; // 1.5, 1.8, 1 (circle), .9
        scale(0.8) // .92, .8
        fill(circle.color)
        stroke(0, 30)
        //body
        drawingContext.shadowOffsetY = 0
        drawingContext.shadowOffsetX = 0
        //        if (imageSet == 0) {
        //        ellipse(0, 0, r * 2); // mane around edge
        //        } else {
        let spanCount = int(r * 2 / 20) * 20; // = 3 for triangle, 4 for kite, 5, 6, 11, also change *20 above for number of spikes
        switch (imageSet) {
            case 5:
                spanCount = 6;
                break;
            case 6:
                spanCount = 11;
                break;
            default:
                break;

        }
        var o = 20;
        if (imageSet == 0 || imageSet > 4) {
            beginShape()
            for (o = 0; o < spanCount; o++) { // body
                let useR = (o % 4 < 2 ? r : r / fringeSize) + sin(o / spanCount * 5 + frameCount / 10 + i) * 7;
                let useAng = o / spanCount * PI * 2 + (circle.active ? frameCount / 10 : 0)
                vertex(useR * cos(useAng), useR * sin(useAng))
            }
            endShape(CLOSE)
        } else if (imageSet == 2) {
            ellipse(0, 0, r * 2);
        } else if (imageSet == 1) {
            //var sq = square(-r, -r, r * 2);
            triangle(-r * 1.25, -r / 2, r * 1.25, -r / 2, 0, r * 1.5);
        } else if (imageSet == 3) {
            ellipse(0, 0, r * 1.8);
            triangle(-r, -r / 2, r, -r / 2, 0, r);
        } else if (imageSet == 4)
            square(-r, -r * .8, r * 1.7);

        noStroke()
        fill(255, 40)
        //         stroke(255,50)
        circle.spots.forEach(sp => { // spots
            ellipse(sp.x * r, sp.y * r, sp.r * r / 2)
        })

        o = 30;
        noFill() // open mouth
        //fill(255, 0, 0) / red mouse
        stroke(0)

        //mouth
        if (circle.active) {
            let mR = (sin(o / spanCount * 5 + frameCount + i) + 1) / 2 * r / 3;
            arc(0, r / 3, mR, mR, 0, PI * 2);
        } else {
            let mR = (sin(o / spanCount * 5 + frameCount / 3 + i) + 1) / 2 * r / 3
            if (circle.active2)
                arc(0, r / 3, mR, mR, 0, PI * 2);
            //arc(0, r / 3, r / 3, r / 3, PI, PI * 2)
            else {
                if (imageSet == 1) {
                    // add nose from movingEyes example
                    //                    stroke(255, 0, 0) // red lips
                    arc(0, r * .6, r / 3, r / 3, 0, PI)
                    arc(0, r * .6, r / 3, r / 6, 0, PI) // second lip
                } else {
                    arc(0, r / 3, r / 3, r / 3, 0, PI)
                }
            }
        }

        drawingContext.shadowOffsetY = 3
        drawingContext.shadowOffsetX = 3

        //eyes - take some eyes from moving eyes
        noStroke()
        //        if (blinking && !shades)
        //            scale(1, (frameCount + i + o) % 50 < 2 ? 0.01 : 1) // framecount to blink
        if (shades) {
            fill(0)
            arc(-r / 3, -r / 8, r / 2, r / 2, 0, PI); // whites of eyes
            arc(r / 3, -r / 8, r / 2, r / 2, 0, PI)
        } else {
            fill(255)
            if (eyePatch) {
                fill(0) // eye patch
                arc(r / 3, -r / 8, r / 2, r / 2, 0, PI)
            } else {
                if (blinking)
                    scale(1, (frameCount + i + o) % 50 < 2 ? 0.01 : 1) // framecount to blink
                arc(r / 3, -r / 8, r / 2, r / 2, 0, circle.active ? 2 * PI : PI)
            }
            fill(255)
            arc(-r / 3, -r / 8, r / 2, r / 2, 0, circle.active ? 2 * PI : PI); // whites of eyes

            translate(sin(o / spanCount * 5 + frameCount / r + i) * r / 10, 0) // move pupils.  Add follow cursor
            fill(0)
            arc(-r / 3, -r / 8, r / 4, r / 4, 0, circle.active ? 2 * PI : PI); // pupils
            arc(r / 3, -r / 8, r / 4, r / 4, 0, circle.active ? 2 * PI : PI)
        }

        pop();
        circle.active = false
        circle.active2 = false
    }

    var a = mouseConstraint.constraint.pointA;
    var bodyB = mouseConstraint.constraint.bodyB;
    var bodyC = Matter.Query.point(bodies, a);
    //    console.log(bodyC);
    if (bodyC.length > 0) {
        bodyC[0].active2 = true;
    }
    if (bodyB) {
        cursor('grab');
        strokeWeight(2);
        stroke(255, 20);
        line(a.x, a.y, bodyB.position.x, bodyB.position.y);
        bodyB.active = true
    } else {
        cursor('');
    }
    push()
    blendMode(MULTIPLY)
    image(overAllTexture, 0, 0)
    pop()
}

function windowResized() {
    bodies = [];
    cir = [];
    setup();
}

var gpad;

gamepads.addEventListener('connect', e => {
    //crosshairs.hidden = false;
    console.log('Gamepad connected:');
    console.log(e.gamepad);
    gpad = e.gamepad;
    e.gamepad.addEventListener('buttonpress', e => showPressedButton(e.index));
    e.gamepad.addEventListener('buttonrelease', e => removePressedButton(e.index));
});

gamepads.addEventListener('disconnect', e => {
    console.log('Gamepad disconnected:');
    console.log(e.gamepad);
});

gamepads.start();

function showPressedButton(index) {
    console.log("Press: ", index);
    if (!splash.hidden) {
        splash.hidden = true;
    } else switch (index) {
        case 0: // A click
            Action(1);
            break;
        case 1: // B
            Action(2);
            break;
        case 2: // x
            Action(3);
            break;
        case 3: // y
            Action(4);
            break;
        case 4: // LT
        case 6: //
            Action(5);
            break;
        case 5: // RT
        case 7: //
            Action(6);
            break;
        case 8:
            toggleButtons();
            break

        case 9:
        case 11:
        case 16:
            break;
        case 10: // XBox
            showMenu();
            break;
        default:
    }
}

function removePressedButton(index) {
    console.log("Releasd: ", index);
}
