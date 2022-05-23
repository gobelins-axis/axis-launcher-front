// Varyings
varying vec2 vUv;
varying vec2 vLayoutUv;
varying vec3 vViewPosition;
varying vec3 vNormal;

varying float lineIndex;
varying float letterIndex;
varying float lineLetterIndex;
varying float vLineLettersTotal;

// Uniforms
uniform float opacity;
uniform float threshold;
uniform float alphaTest;
uniform vec3 color;
uniform sampler2D map;
uniform float time;
// Outline
uniform vec3 outlineColor;
uniform float outlineOutsetWidth;
uniform float outlineInsetWidth;

// Utils
#pragma glslify: mapRange = require(../partials/mapRange)

#ifdef USE_MATCAP
    uniform sampler2D matcap;
#endif

#ifdef USE_TEXTURE
    uniform sampler2D patternTexture;
#endif

float median(float r, float g, float b) {
    return max(min(r, g), min(max(r, g), b));
}

float rand(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
    // Texture sample
    vec3 s = texture2D(map, vUv).rgb;

    // Signed distance
    float sigDist = median(s.r, s.g, s.b) - 0.5;

    // Outset
    float sigDistOutset = sigDist + outlineOutsetWidth * 0.5;
    float sigDistOutset2 = sigDist + (0.5) * 0.5;

    // Inset
    float sigDistInset = sigDist - outlineInsetWidth * 0.5;

    #ifdef IS_SMALL
        float afwidth = 1.4142135623730951 / 2.0;
        float alpha = smoothstep(threshold - afwidth, threshold + afwidth, sigDist);
        float outset = smoothstep(threshold - afwidth, threshold + afwidth, sigDistOutset);
        float outset2 = smoothstep(threshold - afwidth, threshold + afwidth, sigDistOutset2);
        float inset = 1.0 - smoothstep(threshold - afwidth, threshold + afwidth, sigDistInset);
    #else
        float alpha = clamp(sigDist / fwidth(sigDist) + 0.5, 0.0, 1.0);
        float outset = clamp(sigDistOutset / fwidth(sigDistOutset) + 0.5, 0.0, 1.0);
        float outset2 = clamp(sigDistOutset2 / fwidth(sigDistOutset2) + 0.5, 0.0, 1.0);
        float inset = 1.0 - clamp(sigDistInset / fwidth(sigDistInset) + 0.5, 0.0, 1.0);
    #endif

    // Border
    float border = outset * inset;

    // Alpha test
    if (alpha < alphaTest) discard;

    // Outputs
    vec4 filledFragColor = vec4(color, opacity * alpha);
    vec4 strokedFragColor = vec4(outlineColor, opacity * border);

    gl_FragColor = filledFragColor;
}
