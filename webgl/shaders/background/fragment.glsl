// Uniforms
uniform float uTime;
uniform vec2 uResolution;
uniform sampler2D uTexture;
uniform vec2 uTextureSize;
uniform vec3 uOverlayColor;
uniform float uOverlayOpacity;

// Varyings
varying vec2 vUv;

vec2 resizedUv(vec2 uv, vec2 size, vec2 resolution) {
    vec2 ratio = vec2(
        min((resolution.x / resolution.y) / (size.x / size.y), 1.0),
        min((resolution.y / resolution.x) / (size.y / size.x), 1.0)
    );

    return vec2(
        uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
        uv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );
}

float roundedBoxSDF(vec2 CenterPosition, vec2 Size, vec4 Radius) {
    Radius.xy = (CenterPosition.x>0.0)?Radius.xy : Radius.zw;
    Radius.x  = (CenterPosition.y>0.0)?Radius.x  : Radius.y;
    
    vec2 q = abs(CenterPosition)-Size+Radius.x;
    return min(max(q.x,q.y),0.0) + length(max(q,0.0)) - Radius.x;
}

void main() {
    vec2 uv = resizedUv(vUv, uTextureSize, uResolution);
    vec4 texture = texture2D(uTexture, uv);
    gl_FragColor = mix(texture, vec4(uOverlayColor, 1.0), uOverlayOpacity);

    // Test rounded rect
    vec2 size = uResolution;
    vec2 pos = vec2(uResolution.x, uResolution.y);
    float edgeSoftness  = 2.0;
    vec4 radius = vec4(100.0);
    float dist = roundedBoxSDF(gl_FragCoord.xy - pos, size, radius);
    float smoothedAlpha =  1.0 - smoothstep(0.0, edgeSoftness, dist);
    vec4 rectColor = texture;
    vec4 bgColor = vec4(1.0, 1.0, 1.0, 1.0);
    gl_FragColor = mix(bgColor, rectColor, smoothedAlpha);
}
