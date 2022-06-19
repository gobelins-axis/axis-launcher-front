// Uniforms
uniform sampler2D uMap;

// Varyings
varying vec2 vUv;

void main() {
    gl_FragColor = texture2D(uMap, vUv);
}
