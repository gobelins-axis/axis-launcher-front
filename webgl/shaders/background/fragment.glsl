// Uniforms
uniform float uTime;
uniform vec2 uResolution;

uniform sampler2D uTexturePrevious;
uniform vec2 uTextureSizePrevious;
uniform float uScalePrevious;
uniform float uRotatePrevious;
uniform vec2 uTranslatePrevious;
uniform float uAlphaPrevious;

uniform sampler2D uTextureCurrent;
uniform vec2 uTextureSizeCurrent;
uniform float uScaleCurrent;
uniform float uRotateCurrent;
uniform vec2 uTranslateCurrent;
uniform float uAlphaCurrent;

uniform vec3 uOverlayColor;
uniform float uOverlayOpacity;

// Varyings
varying vec2 vUv;

// Requires
#pragma glslify: resizedUv = require(../partials/resizedUv)
#pragma glslify: scaleUv = require(../partials/scaleUv)
#pragma glslify: rotateUv = require(../partials/rotateUv)

void main() {
    // Previous
    vec2 uvPrevious = resizedUv(vUv, uTextureSizePrevious, uResolution);
    uvPrevious = scaleUv(uvPrevious, uScalePrevious);
    uvPrevious = rotateUv(uvPrevious, uRotatePrevious);
    uvPrevious.x += uTranslatePrevious.x;
    uvPrevious.y += uTranslatePrevious.y;

    vec4 texturePrevious = texture2D(uTexturePrevious, uvPrevious);
    texturePrevious.a *= uAlphaPrevious;

    // Current
    vec2 uvCurrent = resizedUv(vUv, uTextureSizeCurrent, uResolution);
    uvCurrent = scaleUv(uvCurrent, uScaleCurrent);
    uvCurrent = rotateUv(uvCurrent, uRotateCurrent);
    uvCurrent.x += uTranslateCurrent.x;
    uvCurrent.y += uTranslateCurrent.y;

    vec4 textureCurrent = texture2D(uTextureCurrent, uvCurrent);
    textureCurrent.a *= uAlphaCurrent;

    // Output
    gl_FragColor = mix(texturePrevious, vec4(uOverlayColor, 1.0), uOverlayOpacity);
    gl_FragColor = mix(textureCurrent, vec4(uOverlayColor, 1.0), uOverlayOpacity);
}
