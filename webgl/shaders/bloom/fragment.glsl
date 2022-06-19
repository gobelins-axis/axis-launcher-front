// Varyings
varying vec2 vUv;

uniform sampler2D uBloomTexture;
uniform sampler2D uBloomMaskTexture;

uniform float uBloomThreshold;

uniform vec2 uResolution;

void main() {
    vec4 mastTexture = texture2D(uBloomMaskTexture, vUv);
    float avgColorMask = (mastTexture.r + mastTexture.g + mastTexture.b) / 3.0;
    float mask = 1.0 - step(avgColorMask, 1.0 - uBloomThreshold);
    gl_FragColor = texture2D(uBloomTexture, vUv) * mask;
}