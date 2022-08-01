//CST325 Adam Houser

'use strict'

var gl;

var appInput = new Input();
var time = new Time();
var camera = new OrbitCamera(appInput);

// geometries to use
var sunGeometry = null; // this will be created after loading from a file
var earthGeometry = null;
var moonGeometry = null;
var backgroundGeometry = null;

var projectionMatrix = new Matrix4();

// initial positions to use
var lightPosition = new Vector3(0, 0, 0);
var earthPosition = new Vector3;
var moonPosition = new Vector3;

// scales to use
var sunScale = new Matrix4().scale(0.07, 0.07, 0.07);
var earthScale = new Matrix4().scale(0.03, 0.03, 0.03);
var moonScale = new Matrix4().scale(0.01, 0.01, 0.01);

// the shader that will be used by each piece of geometry (they could each use their own shader but in this case it will be the same)
var diffuseShaderProgram;
var textureShaderProgram;

// auto start the app when the html page is ready
window.onload = window['initializeAndStartRendering'];

// we need to asynchronously fetch files from the "server" (your local hard drive)
var loadedAssets = {
    diffuseTextVS: null, diffuseTextFS: null,
    textureTextVS: null, textureTextFS: null,
    sphereJSON: null,
    sunImage: null,
    earthImage: null,
    moonImage: null,
    backgroundImage: null,
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
        fetch('./shaders/diffuse.vs.glsl').then((response) => { return response.text(); }),
        fetch('./shaders/diffuse.fs.glsl').then((response) => { return response.text(); }),
        fetch('./shaders/unlit.textured.vs.glsl').then((response) => { return response.text(); }),
        fetch('./shaders/unlit.textured.fs.glsl').then((response) => { return response.text(); }),
        fetch('./data/sphere.json').then((response) => { return response.json(); }),
        loadImage('./data/sun.jpg'),
        loadImage('./data/earth.jpg'),
        loadImage('./data/moon.png'),
        loadImage('./data/starfield.jpg')
    ];

    Promise.all(filePromises).then(function(values) {
        // Assign loaded data to our named variables
        loadedAssets.diffuseTextVS = values[0];
        loadedAssets.diffuseTextFS = values[1];
        loadedAssets.textureTextVS = values[2];
        loadedAssets.textureTextFS = values[3];
        loadedAssets.sphereJSON = values[4];
        loadedAssets.sunImage = values[5];
        loadedAssets.earthImage = values[6];
        loadedAssets.moonImage = values[7];
        loadedAssets.backgroundImage = values[8];
    }).catch(function(error) {
        console.error(error.message);
    }).finally(function() {
        onLoadedCB();
    });
}

// -------------------------------------------------------------------------
function createShaders(loadedAssets) {
    diffuseShaderProgram = createCompiledAndLinkedShaderProgram(loadedAssets.diffuseTextVS, loadedAssets.diffuseTextFS);

    diffuseShaderProgram.attributes = {
        vertexPositionAttribute: gl.getAttribLocation(diffuseShaderProgram, "aVertexPosition"),
        vertexNormalsAttribute: gl.getAttribLocation(diffuseShaderProgram, "aNormal"),
        vertexTexcoordsAttribute: gl.getAttribLocation(diffuseShaderProgram, "aTexcoords")
    };

    diffuseShaderProgram.uniforms = {
        worldMatrixUniform: gl.getUniformLocation(diffuseShaderProgram, "uWorldMatrix"),
        viewMatrixUniform: gl.getUniformLocation(diffuseShaderProgram, "uViewMatrix"),
        projectionMatrixUniform: gl.getUniformLocation(diffuseShaderProgram, "uProjectionMatrix"),
        lightPositionUniform: gl.getUniformLocation(diffuseShaderProgram, "uLightPosition"),
        cameraPositionUniform: gl.getUniformLocation(diffuseShaderProgram, "uCameraPosition"),
        textureUniform: gl.getUniformLocation(diffuseShaderProgram, "uTexture"),
    };

    textureShaderProgram = createCompiledAndLinkedShaderProgram(loadedAssets.textureTextVS, loadedAssets.textureTextFS);

    textureShaderProgram.attributes = {
        vertexPositionAttribute: gl.getAttribLocation(textureShaderProgram, "aVertexPosition"),
        vertexTexcoordsAttribute: gl.getAttribLocation(textureShaderProgram, "aTexcoords")
    };

    textureShaderProgram.uniforms = {
        worldMatrixUniform: gl.getUniformLocation(textureShaderProgram, "uWorldMatrix"),
        viewMatrixUniform: gl.getUniformLocation(textureShaderProgram, "uViewMatrix"),
        projectionMatrixUniform: gl.getUniformLocation(textureShaderProgram, "uProjectionMatrix"),
        textureUniform: gl.getUniformLocation(textureShaderProgram, "uTexture"),
    };
}

// -------------------------------------------------------------------------
function createScene() {
    // background star field
    backgroundGeometry = new WebGLGeometryJSON(gl, textureShaderProgram);
    backgroundGeometry.create(loadedAssets.sphereJSON, loadedAssets.backgroundImage);

    // sun
    sunGeometry = new WebGLGeometryJSON(gl, textureShaderProgram);
    sunGeometry.create(loadedAssets.sphereJSON, loadedAssets.sunImage);
    sunGeometry.worldMatrix.identity();
    sunGeometry.worldMatrix.multiplyRightSide(sunScale);

    // earth
    earthGeometry = new WebGLGeometryJSON(gl, diffuseShaderProgram);
    earthGeometry.create(loadedAssets.sphereJSON, loadedAssets.earthImage);
    earthGeometry.worldMatrix.identity();
    earthGeometry.worldMatrix.multiplyRightSide(earthScale);

    // moon
    moonGeometry = new WebGLGeometryJSON(gl, diffuseShaderProgram);
    moonGeometry.create(loadedAssets.sphereJSON, loadedAssets.moonImage);
    moonGeometry.worldMatrix.identity();
    moonGeometry.worldMatrix.multiplyRightSide(moonScale);
}

// -------------------------------------------------------------------------
function updateAndRender() {
    requestAnimationFrame(updateAndRender);

    var aspectRatio = gl.canvasWidth / gl.canvasHeight;

    // spin
    // sun
    sunGeometry.worldMatrix.setRotationY(time.secondsElapsedSinceStart * 20);
    sunGeometry.worldMatrix.multiplyRightSide(sunScale);

    // earth
    earthGeometry.worldMatrix.identity();
    earthGeometry.worldMatrix.setRotationY(time.secondsElapsedSinceStart * 45);
    earthGeometry.worldMatrix.multiplyRightSide(earthScale);

    // moon
    moonGeometry.worldMatrix.identity();
    moonGeometry.worldMatrix.setRotationY(time.secondsElapsedSinceStart * 60);
    moonGeometry.worldMatrix.multiplyRightSide(moonScale);

    time.update();
    camera.update(time.deltaTime);

    // orbit
    var cosTime = Math.cos(time.secondsElapsedSinceStart);
    var sinTime = Math.sin(time.secondsElapsedSinceStart);
    var cos2Time = Math.cos(2.7 * time.secondsElapsedSinceStart);
    var sin2Time = Math.sin(2.7 * time.secondsElapsedSinceStart);

    // earth
    var earthDistance = 7;
    earthPosition.x = cosTime * earthDistance;
    earthPosition.y = 0;
    earthPosition.z = sinTime * earthDistance;

    earthGeometry.worldMatrix.elements[3] = earthPosition.x;
    earthGeometry.worldMatrix.elements[7] = earthPosition.y;
    earthGeometry.worldMatrix.elements[11] = earthPosition.z;

    // moon
    var moonDistance = 2.5;
    moonPosition.x = cos2Time * moonDistance + earthPosition.x;
    moonPosition.y = 0.5;
    moonPosition.z = sin2Time * moonDistance + earthPosition.z;

    moonGeometry.worldMatrix.elements[3] = moonPosition.x;
    moonGeometry.worldMatrix.elements[7] = moonPosition.y;
    moonGeometry.worldMatrix.elements[11] = moonPosition.z;

    // specify what portion of the canvas we want to draw to (all of it, full width and height)
    gl.viewport(0, 0, gl.canvasWidth, gl.canvasHeight);

    // this is a new frame so let's clear out whatever happened last frame
    gl.clearColor(0.707, 0.707, 1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(diffuseShaderProgram);
    var uniforms = diffuseShaderProgram.uniforms;
    var cameraPosition = camera.getPosition();
    gl.uniform3f(uniforms.lightPositionUniform, lightPosition.x, lightPosition.y, lightPosition.z);
    gl.uniform3f(uniforms.cameraPositionUniform, cameraPosition.x, cameraPosition.y, cameraPosition.z);

    projectionMatrix.setPerspective(45, aspectRatio, 0.1, 1000);
    backgroundGeometry.render(camera, projectionMatrix, textureShaderProgram);
    sunGeometry.render(camera, projectionMatrix, textureShaderProgram);
    earthGeometry.render(camera, projectionMatrix, diffuseShaderProgram);
    moonGeometry.render(camera, projectionMatrix, diffuseShaderProgram);
}
