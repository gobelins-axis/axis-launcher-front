// Varyings
varying vec2 vUv;

uniform sampler2D uTexture;

uniform vec2 uResolution;
uniform vec2 uDirection;
uniform float uIntensity;

// #pragma glslify: blur = require('glsl-fast-gaussian-blur/13')
#pragma glslify: blur = require('glsl-fast-gaussian-blur')

void main() {
    vec4 texel = texture2D(uTexture, vUv);
    gl_FragColor = blur(uTexture, vUv, uResolution, uDirection * uIntensity);
}