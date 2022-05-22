// Uniforms
uniform float uTime;
uniform float uResolution;
uniform vec3 uColor;

// Varyings
varying vec2 vUv;

void main() {
    gl_FragColor = vec4(uColor.r, uColor.g, uColor.b, 1.0);
}
