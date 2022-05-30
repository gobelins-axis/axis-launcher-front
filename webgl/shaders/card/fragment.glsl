// Uniforms
uniform float uTime;
uniform vec2 uResolution;
uniform sampler2D uTexture;
uniform vec2 uTextureSize;
uniform float uBorderRadius;
uniform float uInsetBorderRadius;
uniform float uBorderWidth;
uniform vec3 uBorderColor;
uniform float uBorderAlpha;
uniform vec3 uOverlayColor;
uniform float uOverlayAlpha;

// Varyings
varying vec2 vUv;

// Requires
#pragma glslify: resizedUv = require(../partials/resizedUv)

// https://www.shadertoy.com/view/tltXDl
float roundedBoxSDF(vec2 pos, vec2 size, vec4 radius) {
    radius.xy = (pos.x > 0.0) ? radius.xy : radius.zw;
    radius.x = (pos.y > 0.0) ? radius.x : radius.y;
    
    vec2 q = abs(pos) - size + radius.x;
    return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - radius.x;
}

void main() {
    vec4 texture = texture2D(uTexture, resizedUv(vUv, uTextureSize, uResolution));

    vec2 cardSize = uResolution;
    vec2 cardPosition = vec2(uResolution.x, uResolution.y);

    vec2 insetCardSize = uResolution - uBorderWidth;

    float edgeSoftness  = 2.0;

    vec4 radius = vec4(uBorderRadius);
    vec4 insetRadius = vec4(uInsetBorderRadius);

    float cardAlpha = roundedBoxSDF(vUv * uResolution * 2.0 - cardPosition, cardSize, radius);
    cardAlpha = 1.0 - smoothstep(0.0, edgeSoftness, cardAlpha);

    float insetCardAlpha = roundedBoxSDF(vUv * uResolution * 2.0 - cardPosition, insetCardSize, insetRadius);
    insetCardAlpha = 1.0 - smoothstep(0.0, edgeSoftness, insetCardAlpha);

    float cardBorderAlpha = (1.0 - insetCardAlpha) * cardAlpha;

    vec4 background = texture;
    background.rgb = mix(uOverlayColor, background.rgb, uOverlayAlpha);
    background *= cardAlpha - cardBorderAlpha;
    // background.a *= cardAlpha;

    vec4 border = vec4(uBorderColor, uBorderAlpha);
    border *= cardBorderAlpha;
    
    gl_FragColor = background + border;
    // gl_FragColor = background;
}
