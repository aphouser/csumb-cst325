//CST325 Adam Houser and Jason Pettit

precision mediump float;

uniform sampler2D uTexture;
uniform float uAlpha;

// vTexcoords varying from vector shader
varying vec2 vTexcoords;

void main(void) {
    // below line for Todo #3, assuming it will comment out later
    //gl_FragColor = vec4(vTexcoords, 0.0, 1.0);
    //gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
    gl_FragColor = texture2D(uTexture, vTexcoords);
    gl_FragColor.a = uAlpha;

}
