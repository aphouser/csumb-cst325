//CST325 Adam Houser

precision mediump float;

uniform sampler2D uTexture;

// vTexcoords varying from vector shader
varying vec2 vTexcoords;

void main(void) {

    gl_FragColor = texture2D(uTexture, vTexcoords);

}
