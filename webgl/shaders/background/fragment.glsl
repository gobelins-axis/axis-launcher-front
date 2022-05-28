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

void main() {
    vec2 uv = resizedUv(vUv, uTextureSize, uResolution);
    vec4 texture = texture2D(uTexture, uv);
    gl_FragColor = mix(texture, vec4(uOverlayColor, 1.0), uOverlayOpacity);
}
