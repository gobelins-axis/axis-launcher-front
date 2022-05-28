// Uniforms
uniform float uTime;
uniform vec2 uResolution;
uniform float uBorderRadius;
uniform float uBorderWidth;
uniform vec3 uBorderColor;
uniform float uBorderAlpha;

// Varyings
varying vec2 vUv;

// https://www.shadertoy.com/view/tltXDl
float roundedBoxSDF(vec2 pos, vec2 size, vec4 radius) {
    radius.xy = (pos.x > 0.0) ? radius.xy : radius.zw;
    radius.x = (pos.y > 0.0) ? radius.x : radius.y;
    
    vec2 q = abs(pos) - size + radius.x;
    return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - radius.x;
}

void main() {
    vec2 cardSize = uResolution - 2.0;
    vec2 cardPosition = vec2(uResolution.x, uResolution.y);

    vec2 insetCardSize = uResolution - uBorderWidth;

    float edgeSoftness  = 2.0;

    vec4 radius = vec4(uBorderRadius);

    float cardAlpha = roundedBoxSDF(vUv * uResolution * 2.0 - cardPosition, cardSize, radius);
    cardAlpha = 1.0 - smoothstep(0.0, edgeSoftness, cardAlpha);

    float insetCardAlpha = roundedBoxSDF(vUv * uResolution * 2.0 - cardPosition, insetCardSize, radius - uBorderWidth / 2.0);
    insetCardAlpha = 1.0 - smoothstep(0.0, edgeSoftness, insetCardAlpha);

    float cardBorderAlpha = (1.0 - insetCardAlpha) * cardAlpha;

    vec4 background = vec4(1.0, 0.0, 0.0, 1.0);
    background.a *= cardAlpha - cardBorderAlpha;

    vec4 border = vec4(uBorderColor, uBorderAlpha);
    border.a *= cardBorderAlpha;
    
    gl_FragColor = background + border;
    gl_FragColor = mix(background, border, border.a - background.a);
    // gl_FragColor = border;
}
