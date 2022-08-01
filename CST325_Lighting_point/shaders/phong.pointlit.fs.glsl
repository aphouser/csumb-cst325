//CST325 Adam Houser and Jason Pettit

precision mediump float;

uniform vec3 uLightPosition;
uniform vec3 uCameraPosition;
uniform sampler2D uTexture;

varying vec2 vTexcoords;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;

void main(void) {
    // todo - diffuse contribution - Done
    // 1. normalize the light direction and store in a separate variable
    vec3 normalLightDirection = normalize(uLightPosition - vWorldPosition);
    // 2. normalize the world normal and store in a separate variable
    vec3 normalWorldNormal = normalize(vWorldNormal);
    // 3. calculate the lambert term
    // float lambertian = max(dot(N, L), 0.0);
    float lambertian = max(dot(normalWorldNormal, normalLightDirection), 0.0);

    // todo - specular contribution - Done
    // 1. in world space, calculate the direction from the surface point to the eye (normalized)
    vec3 normalEyeDirection = normalize(uCameraPosition - vWorldPosition);
    // 2. in world space, calculate the reflection vector (normalized)
    // vec3 R = reflect(-L, N);      // Reflected light vector
    vec3 reflection = reflect(-normalLightDirection, normalWorldNormal);
    // this would also work 2(N dot L)N - L
    // (dot(normalLightDirection, normalWorldNormal)) * normalWorldNormal + (dot(normalLightDirection, normalWorldNormal)) * normalWorldNormal - normalLightDirection;

    // 3. calculate the phong term
    // Compute the specular term
    // float specAngle = max(dot(R, V), 0.0);
    // specular = pow(specAngle, shininessVal);
    float specularPower = 64.0;
    float specularAngle = max(dot(reflection, normalEyeDirection), 0.0);
    float phong = pow(specularAngle, specularPower);

    vec3 albedo = texture2D(uTexture, vTexcoords).rgb;

    // todo - combine - Done
    // 1. apply light and material interaction for diffuse value by using the texture color as the material
    vec3 diffuseValue = albedo * lambertian;
    // 2. apply light and material interaction for phong, assume phong material color is (0.3, 0.3, 0.3)
    vec3 specularValue = albedo * phong;

    vec3 ambient = albedo * 0.1;
    vec3 diffuseColor = diffuseValue;
    vec3 specularColor = specularValue * 0.3;
    vec3 finalColor = ambient + diffuseColor + specularColor;

    gl_FragColor = vec4(finalColor, 1.0);
}
