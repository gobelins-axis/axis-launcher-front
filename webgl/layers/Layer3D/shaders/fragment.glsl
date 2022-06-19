// Uniforms
uniform sampler2D uTexture;
uniform sampler2D uBloomTexture;
uniform float uBloomStrength;

// Varyings
varying vec2 vUv;

void main() {
    gl_FragColor = texture2D(uTexture, vUv) + texture2D(uBloomTexture, vUv) * uBloomStrength;
}
