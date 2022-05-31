// Uniforms
uniform float uTime;
uniform vec2 uResolution;

uniform sampler2D uTexturePrevious;
uniform vec2 uTextureSizePrevious;
uniform float uScalePrevious;
uniform float uRotatePrevious;
uniform vec2 uTranslatePrevious;
uniform float uAlphaPrevious;

uniform float uBlurTextureSize;

uniform sampler2D uTextureCurrent;
uniform vec2 uTextureSizeCurrent;
uniform float uScaleCurrent;
uniform float uRotateCurrent;
uniform vec2 uTranslateCurrent;
uniform float uAlphaCurrent;

uniform vec3 uGradientColor;
uniform vec4 uGradientCurveX;
uniform float uGradientAlphaX;
uniform vec4 uGradientCurveY;
uniform float uGradientAlphaY;

uniform vec3 uOverlayColor;
uniform float uOverlayOpacity;

// Varyings
varying vec2 vUv;

// Requires
#pragma glslify: resizedUv = require(../partials/resizedUv)
#pragma glslify: scaleUv = require(../partials/scaleUv)
#pragma glslify: rotateUv = require(../partials/rotateUv)

// https://github.com/yiwenl/glsl-bezier-curve
vec3 bezier(vec3 A, vec3 B, vec3 C, vec3 D, float t) {
    vec3 E = mix(A, B, t);
    vec3 F = mix(B, C, t);
    vec3 G = mix(C, D, t);

    vec3 H = mix(E, F, t);
    vec3 I = mix(F, G, t);

    vec3 P = mix(H, I, t);

    return P;
}

float plot(float t, float pct){
  return  smoothstep( pct-0.02, pct, t) -
          smoothstep( pct, pct+0.02, t);
}

void main() {
    // Previous
    vec2 uvPrevious = resizedUv(vUv, uTextureSizePrevious / uBlurTextureSize, uResolution);
    uvPrevious = scaleUv(uvPrevious, uScalePrevious);
    uvPrevious = rotateUv(uvPrevious, uRotatePrevious);
    uvPrevious.x += uTranslatePrevious.x;
    uvPrevious.y += uTranslatePrevious.y;

    vec4 texturePrevious = texture2D(uTexturePrevious, uvPrevious);
    texturePrevious.a *= uAlphaPrevious;

    // Current
    vec2 uvCurrent = resizedUv(vUv, uTextureSizeCurrent / uBlurTextureSize, uResolution);
    uvCurrent = scaleUv(uvCurrent, uScaleCurrent);
    uvCurrent = rotateUv(uvCurrent, uRotateCurrent);
    uvCurrent.x += uTranslateCurrent.x;
    uvCurrent.y += uTranslateCurrent.y;

    vec4 textureCurrent = texture2D(uTextureCurrent, uvCurrent);
    textureCurrent.a *= uAlphaCurrent;

    // Horizontal Gradient
    vec3 gradientXcp1 = vec3(uGradientCurveX.x, uGradientCurveX.y, 0.0);
    vec3 gradientXcp2 = vec3(uGradientCurveX.z, uGradientCurveX.w, 0.0);
    vec3 gradientXcurve = bezier(vec3(0.0, 0.0, 0.0), gradientXcp1, gradientXcp2, vec3(1.0, 1.0, 0.0), vUv.x);
    float gradientX = (1.0 - gradientXcurve.y) * uGradientAlphaX;

    // Vertical Gradient
    vec3 gradientYcp1 = vec3(uGradientCurveY.x, uGradientCurveY.y, 0.0);
    vec3 gradientYcp2 = vec3(uGradientCurveY.z, uGradientCurveY.w, 0.0);
    vec3 gradientYcurve = bezier(vec3(0.0, 0.0, 0.0), gradientYcp1, gradientYcp2, vec3(1.0, 1.0, 0.0), vUv.y);
    float gradientY = (1.0 - gradientYcurve.y) * uGradientAlphaY;

    // Debug
    // float pct = plot(vUv.y, gradientY);
    // gl_FragColor = vec4(pct, 0.0, 0.0, 1.0);

    // Output
    gl_FragColor = mix(textureCurrent, vec4(uGradientColor, 1.0), gradientX);
    gl_FragColor = mix(gl_FragColor, vec4(uGradientColor, 1.0), gradientY);
    gl_FragColor = mix(gl_FragColor, vec4(uOverlayColor, 1.0), uOverlayOpacity);
}
