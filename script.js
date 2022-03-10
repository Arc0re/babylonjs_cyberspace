"use strict";

const STATE_TITLESCREEN = 1,
      STATE_RUNGAME = 2;

var canvas, engine, scene, camera, currentState, controlEnabled;

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
    engine.inputElement = canvas;
    window.addEventListener('resize', function () {
        engine.resize();
    });

    canvas.addEventListener("click", function () {
        engine.enterPointerlock();
    });

    scene = new BABYLON.Scene(engine);
    scene.collisionsEnabled = true;
    var light = new BABYLON.HemisphericLight("Light1", new BABYLON.Vector3(1, 1, 0), scene);
    var sphere = BABYLON.MeshBuilder.CreateSphere("Sphere", { diameter: 1 }, scene);
    var material = new BABYLON.StandardMaterial("material01", scene);
    sphere.material = material;
    sphere.material.wireframe = true;

    var setupCamera = function () {
        camera = new BABYLON.FreeCamera('FPSCamera', new BABYLON.Vector3(1, 1, 0), scene);
        camera.checkCollisions = true;
        camera.fov = 0.80;
        camera.speed = 1;        
        camera.inertia = 0;        
        camera.invertRotation = false;
        camera.angularSensibility = 3000;
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl();
    
        // AZERTY
        camera.keysUp = [90]; // Z
        camera.keysLeft = [81]; // Q
        camera.keysRight = [68]; // S
        camera.keysDown = [83]; // D
        camera.keysUpward = [32]; // space
        camera.keysDownward = [17]; // ctrl
    };

    setupCamera();

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