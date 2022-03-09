"use strict";

const STATE_TITLESCREEN = 1,
      STATE_RUNGAME = 2;

var canvas, engine, scene, camera, currentState;

function showTitlescreen() {
    let tsElem = document.createElement("h1");
    tsElem.style.fontFamily = "Helvetica";
    tsElem.style.fontSize = "170px";
    tsElem.style.textAlign = "center";
    tsElem.style.width = "98%";
    tsElem.style.zIndex = "666";
    tsElem.style.position = "absolute";
    tsElem.style.top = "50%";
    tsElem.style.color = "lightblue";
    tsElem.style.letterSpacing = "-17px";

    tsElem.innerText = "CYBERSPACE";
    document.body.appendChild(tsElem);
    window.setTimeout(function () {
        tsElem.remove();
        console.log("removing ts");
    }, 2000);
}

function startGame() {
    if (!BABYLON.Engine.isSupported()) {
        alert("Babylon ne marche pas ici.");
    } else {
        console.log("Babylon yay !");
    }

    currentState = STATE_TITLESCREEN;

    canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.id = "CyberspaceCanvas";
    document.body.appendChild(canvas);

    engine = new BABYLON.Engine(canvas, false);
    scene = new BABYLON.Scene(engine);
    const alpha = Math.PI;
    const beta = 2.23;
    const radius = 2;
    camera = new BABYLON.ArcRotateCamera("Camera", alpha, beta, radius, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    var light = new BABYLON.HemisphericLight("Light1", new BABYLON.Vector3(1, 1, 0), scene);
    var sphere = BABYLON.MeshBuilder.CreateSphere("Sphere", { diameter: 1 }, scene);

    // debugger
    const F12KEY = 123;
    window.addEventListener("keydown", function (ev) {
        if (ev.keyCode == F12KEY) {
            if (scene.debugLayer.isVisible()) {
                scene.debugLayer.hide();
            } else {
                scene.debugLayer.show();
            }
        }
    });

    // main loop
    engine.runRenderLoop(function () {
        if (currentState == STATE_TITLESCREEN) {
            showTitlescreen();
            currentState = STATE_RUNGAME;
        } else if (currentState == STATE_RUNGAME) {
            scene.render();
        }
    });
}