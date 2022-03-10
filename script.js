"use strict";

const STATE_TITLESCREEN = 1,
      STATE_RUNGAME = 2;

const BULLET_FRAMES_ALIVE = 100,
      BULLET_SPEED = 2;

var canvas, engine, scene, camera, currentState, controlEnabled, bulletCounter = 0, bulletMaterial, bullets = [];

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

function startBeginRun() {
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
    sphere.checkCollisions = true;

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

    var getForwardVector = function (rotation) {
        var rotationMatrix = BABYLON.Matrix.RotationYawPitchRoll(rotation.y, rotation.x, rotation.z);
        return BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(0, 0, 1), rotationMatrix);
    };

    bulletMaterial = new BABYLON.StandardMaterial("BulletMateriel", scene);
    bulletMaterial.alpha = 0.5;
    bulletMaterial.wireframe = true;
    var Bullet = function () {
        bullets.push(this);

        bulletCounter++;
        this.mesh = BABYLON.Mesh.CreateSphere("Bullet" + bulletCounter, 3, 3, scene);
        this.mesh.material = bulletMaterial;
        this.mesh.position = camera.position.clone();
        this.mesh.checkCollisions = true;
        this.scene = scene;
        this.speed = BULLET_SPEED;
        this.isAlive = true;
        this.frameCnt = BULLET_FRAMES_ALIVE;

        this.direction = getForwardVector(camera.rotation);
        this.direction.normalize();

        this.update = function () {
            if (!this.isAlive) {
                return;
            }
            
            this.mesh.position.x += this.direction.x * this.speed;
            this.mesh.position.y += this.direction.y * this.speed;
            this.mesh.position.z += this.direction.z * this.speed;

            // Cassé, blem de taille de mesh
            if (this.mesh.intersectsMesh(sphere, false)) {
                console.log("HIT SPHERE");
                const SPHERE_HIT_REDUCE = 0.05;
                sphere.scaling.x -= SPHERE_HIT_REDUCE;
                sphere.scaling.y -= SPHERE_HIT_REDUCE;
                sphere.scaling.z -= SPHERE_HIT_REDUCE;
                setTimeout(() => {
                    this.remove();
                }, 500);
            }

            this.frameCnt--;
            if (this.frameCnt <= 0) {
                this.remove();
            }
        };

        this.remove = function () {
            this.mesh.dispose();
            this.isAlive = false;
        };
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

    document.addEventListener("click", function () {
        let bullet = new Bullet();
        console.log("Pan");
    });

    // main loop
    engine.runRenderLoop(function () {
        if (currentState == STATE_TITLESCREEN) {
            showTitlescreen();
            currentState = STATE_RUNGAME;
        } else if (currentState == STATE_RUNGAME) {
            for (let i = 0; i < bullets.length; i++) {
                if (bullets[i].isAlive) {
                    bullets[i].update();
                }
            }

            scene.render();
        }
    });
}