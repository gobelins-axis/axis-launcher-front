// Uniforms
uniform float uTime;
uniform float uResolution;
uniform vec3 uColor;

// Varyings
varying vec2 vUv;

void main() {
    gl_FragColor = vec4(uColor.r * vUv.y, uColor.g * vUv.y, uColor.b * vUv.y, 1.0);
}
