// Uniforms
uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uColor;

// Varyings
varying vec2 vUv;

void main() {
    // Center UV
    float aspect = uResolution.x / uResolution.y;   // aspect ratio x/y
    vec2 ratio = vec2(aspect, 1.0);                 // aspect ratio (x/y,1)     
    vec2 uv = (2.0 * vUv - 1.0) * ratio;
    float l = length(uv);

    gl_FragColor = vec4(l, 0.0, 0.0, 1.0);
}
