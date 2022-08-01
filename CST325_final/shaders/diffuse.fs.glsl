//CST325 Adam Houser

precision mediump float;

uniform vec3 uLightPosition;
uniform vec3 uCameraPosition;
uniform sampler2D uTexture;

varying vec2 vTexcoords;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;

void main(void) {
    vec3 normalLightDirection = normalize(uLightPosition - vWorldPosition);

    vec3 normalWorldNormal = normalize(vWorldNormal);

    // float lambertian = max(dot(N, L), 0.0);
    float lambertian = max(dot(normalWorldNormal, normalLightDirection), 0.0);

    vec3 diffuseValue = texture2D(uTexture, vTexcoords).rgb * lambertian;

    gl_FragColor = vec4(diffuseValue, 1.0);
}
