//CST325 Adam Houser and Jason Pettit

'use strict'

var gl;

var appInput = new Input();
var time = new Time();
var camera = new OrbitCamera(appInput);

var sphereGeometry = null; // this will be created after loading from a file
var barrelGeometry = null;
var lightGeometry = null;
var groundGeometry = null;

var projectionMatrix = new Matrix4();
var lightPosition = new Vector3(4, 1.5, 0);

// the shader that will be used by each piece of geometry (they could each use their own shader but in this case it will be the same)
var phongShaderProgram;
var flatShaderProgram;

// auto start the app when the html page is ready
window.onload = window['initializeAndStartRendering'];

// we need to asynchronously fetch files from the "server" (your local hard drive)
var loadedAssets = {
    phongTextVS: null, phongTextFS: null,
    flatTextVS: null, flatTextFS: null,
    vertexColorVS: null, vertexColorFS: null,
    sphereJSON: null,
    marbleImage: null,
    barrelJSON: null,
    barrelImage: null,
    crackedMudImage: null
};

// -------------------------------------------------------------------------
function initializeAndStartRendering() {
    initGL();
    loadAssets(function() {
        createShaders(loadedAssets);
        createScene();

        updateAndRender();
    });
}

// -------------------------------------------------------------------------
function initGL(canvas) {
    var canvas = document.getElementById("webgl-canvas");

    try {
        gl = canvas.getContext("webgl");
        gl.canvasWidth = canvas.width;
        gl.canvasHeight = canvas.height;

        gl.enable(gl.DEPTH_TEST);
    } catch (e) {}

    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}

// -------------------------------------------------------------------------
function loadAssets(onLoadedCB) {
    var filePromises = [
        fetch('./shaders/phong.vs.glsl').then((response) => { return response.text(); }),
        fetch('./shaders/phong.pointlit.fs.glsl').then((response) => { return response.text(); }),
        fetch('./shaders/flat.color.vs.glsl').then((response) => { return response.text(); }),
        fetch('./shaders/flat.color.fs.glsl').then((response) => { return response.text(); }),
        fetch('./data/sphere.json').then((response) => { return response.json(); }),
        fetch('./data/barrel.json').then((response) => { return response.json(); }),
        loadImage('./data/marble.jpg'),
        loadImage('./data/barrel.png'),
        loadImage('./data/crackedmud.png')
    ];

    Promise.all(filePromises).then(function(values) {
        // Assign loaded data to our named variables
        loadedAssets.phongTextVS = values[0];
        loadedAssets.phongTextFS = values[1];
        loadedAssets.flatTextVS = values[2];
        loadedAssets.flatTextFS = values[3];
        loadedAssets.sphereJSON = values[4];
        loadedAssets.barrelJSON = values[5];
        loadedAssets.marbleImage = values[6];
        loadedAssets.barrelImage = values[7];
        loadedAssets.crackedMudImage = values[8];
    }).catch(function(error) {
        console.error(error.message);
    }).finally(function() {
        onLoadedCB();
    });
}

// -------------------------------------------------------------------------
function createShaders(loadedAssets) {
    phongShaderProgram = createCompiledAndLinkedShaderProgram(loadedAssets.phongTextVS, loadedAssets.phongTextFS);

    phongShaderProgram.attributes = {
        vertexPositionAttribute: gl.getAttribLocation(phongShaderProgram, "aVertexPosition"),
        vertexNormalsAttribute: gl.getAttribLocation(phongShaderProgram, "aNormal"),
        vertexTexcoordsAttribute: gl.getAttribLocation(phongShaderProgram, "aTexcoords")
    };

    phongShaderProgram.uniforms = {
        worldMatrixUniform: gl.getUniformLocation(phongShaderProgram, "uWorldMatrix"),
        viewMatrixUniform: gl.getUniformLocation(phongShaderProgram, "uViewMatrix"),
        projectionMatrixUniform: gl.getUniformLocation(phongShaderProgram, "uProjectionMatrix"),
        lightPositionUniform: gl.getUniformLocation(phongShaderProgram, "uLightPosition"),
        cameraPositionUniform: gl.getUniformLocation(phongShaderProgram, "uCameraPosition"),
        textureUniform: gl.getUniformLocation(phongShaderProgram, "uTexture"),
    };

    flatShaderProgram = createCompiledAndLinkedShaderProgram(loadedAssets.flatTextVS, loadedAssets.flatTextFS);

    flatShaderProgram.attributes = {
        vertexPositionAttribute: gl.getAttribLocation(flatShaderProgram, "aVertexPosition"),
        vertexNormalsAttribute: gl.getAttribLocation(flatShaderProgram, "aNormal"),
        vertexTexcoordsAttribute: gl.getAttribLocation(flatShaderProgram, "aTexcoords")
    };

    flatShaderProgram.uniforms = {
        worldMatrixUniform: gl.getUniformLocation(flatShaderProgram, "uWorldMatrix"),
        viewMatrixUniform: gl.getUniformLocation(flatShaderProgram, "uViewMatrix"),
        projectionMatrixUniform: gl.getUniformLocation(flatShaderProgram, "uProjectionMatrix"),
        lightPositionUniform: gl.getUniformLocation(flatShaderProgram, "uLightPosition"),
        cameraPositionUniform: gl.getUniformLocation(flatShaderProgram, "uCameraPosition"),
        textureUniform: gl.getUniformLocation(flatShaderProgram, "uTexture"),
    };
}

// -------------------------------------------------------------------------
function createScene() {
    groundGeometry = new WebGLGeometryQuad(gl, phongShaderProgram);
    groundGeometry.create(loadedAssets.crackedMudImage);

    sphereGeometry = new WebGLGeometryJSON(gl, phongShaderProgram);
    sphereGeometry.create(loadedAssets.sphereJSON, loadedAssets.marbleImage);

    // adding in barrel
    barrelGeometry = new WebGLGeometryJSON(gl, phongShaderProgram);
    barrelGeometry.create(loadedAssets.barrelJSON, loadedAssets.barrelImage);

    // adding in light
    lightGeometry = new WebGLGeometryJSON(gl, flatShaderProgram);
    lightGeometry.create(loadedAssets.sphereJSON, loadedAssets.marbleImage);

    // Scaled it down so that the diameter is 3, (starts at 100)
    var sphereScale = new Matrix4().scale(0.03, 0.03, 0.03);
    var barrelScale = new Matrix4().scale(0.3, 0.3, 0.3);
    var lightScale = new Matrix4().scale(0.003, 0.003, 0.003);

    sphereGeometry.worldMatrix.identity();
    sphereGeometry.worldMatrix.multiplyRightSide(sphereScale);

    // adding in barrel scaling and translation
    barrelGeometry.worldMatrix.identity();
    barrelGeometry.worldMatrix.multiplyRightSide(barrelScale);

    // adding in light
    lightGeometry.worldMatrix.identity();
    lightGeometry.worldMatrix.multiplyRightSide(lightScale);

    // raise it by the radius to make it sit on the ground
    sphereGeometry.worldMatrix.translate(0, 1.5, 0);
    barrelGeometry.worldMatrix.translate(-5, 2, -5);
    lightGeometry.worldMatrix.translate(lightPosition.x, lightPosition.y, lightPosition.z);
}

// -------------------------------------------------------------------------
function updateAndRender() {
    requestAnimationFrame(updateAndRender);

    var aspectRatio = gl.canvasWidth / gl.canvasHeight;

    // todo - Done
    // make light orbit the sphere
    var rotateMatrix = new Matrix3();
    rotateMatrix.setRotationY(-1).multiplyVector(lightPosition);

    // in order to rotate light sphere since it isn't a matrix we can't use
    var lightScale = new Matrix4().scale(0.003, 0.003, 0.003);
    lightGeometry.worldMatrix.identity();
    lightGeometry.worldMatrix.multiplyRightSide(lightScale);
    lightGeometry.worldMatrix.translate(lightPosition.x, lightPosition.y, lightPosition.z);

    time.update();
    camera.update(time.deltaTime);

    // specify what portion of the canvas we want to draw to (all of it, full width and height)
    gl.viewport(0, 0, gl.canvasWidth, gl.canvasHeight);

    // this is a new frame so let's clear out whatever happened last frame
    gl.clearColor(0.707, 0.707, 1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(phongShaderProgram);
    var uniforms = phongShaderProgram.uniforms;
    var cameraPosition = camera.getPosition();
    gl.uniform3f(uniforms.lightPositionUniform, lightPosition.x, lightPosition.y, lightPosition.z);
    gl.uniform3f(uniforms.cameraPositionUniform, cameraPosition.x, cameraPosition.y, cameraPosition.z);

    projectionMatrix.setPerspective(45, aspectRatio, 0.1, 1000);
    groundGeometry.render(camera, projectionMatrix, phongShaderProgram);
    sphereGeometry.render(camera, projectionMatrix, phongShaderProgram);
    barrelGeometry.render(camera, projectionMatrix, phongShaderProgram);
    lightGeometry.render(camera, projectionMatrix, flatShaderProgram);
}
