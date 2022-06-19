// Uniforms
uniform sampler2D uAxisMachineTexture;
uniform sampler2D uAxisMachineTextureBlured;
uniform float uBloomStrength;
uniform float uIsAxis;

// Varyings
varying vec2 vUv;

void main() {
    // Axis Machine
    gl_FragColor = texture2D(uAxisMachineTexture, vUv);
    gl_FragColor += texture2D(uAxisMachineTextureBlured, vUv) * uBloomStrength;
    gl_FragColor = mix(vec4(0.0), gl_FragColor, uIsAxis);
}
