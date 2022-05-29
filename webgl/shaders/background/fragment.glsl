// Uniforms
uniform float uTime;
uniform vec2 uResolution;
uniform sampler2D uTexture;
uniform vec2 uTextureSize;
uniform vec3 uOverlayColor;
uniform float uOverlayOpacity;

// Varyings
varying vec2 vUv;

// Requires
#pragma glslify: resizedUv = require(../partials/resizedUv)

void main() {
    vec2 uv = resizedUv(vUv, uTextureSize, uResolution);
    vec4 texture = texture2D(uTexture, uv);
    gl_FragColor = mix(texture, vec4(uOverlayColor, 1.0), uOverlayOpacity);
}
