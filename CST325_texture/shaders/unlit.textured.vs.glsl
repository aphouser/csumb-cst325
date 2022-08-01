//CST325 Adam Houser and Jason Pettit

precision mediump float;

attribute vec3 aVertexPosition;
attribute vec2 aTexcoords;

uniform mat4 uWorldMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

// todo - make sure to pass texture coordinates for interpolation to fragment shader (varying) - Done
//        1. Declare the variable correctly, 2. Set it correctly inside main

// vTexcoords represents vertex texture coordinates
varying vec2 vTexcoords;

void main(void) {
    gl_Position = uProjectionMatrix * uViewMatrix * uWorldMatrix * vec4(aVertexPosition, 1.0);
    vTexcoords = aTexcoords;
}