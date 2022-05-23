// Attribute
attribute vec2 layoutUv;
attribute float line;
attribute float letter;
attribute float lineLetters;
attribute float lineLettersTotal;

// Varyings
varying vec2 vUv;
varying vec2 vLayoutUv;
varying vec3 vViewPosition;
varying vec3 vNormal;
varying float lineIndex;
varying float letterIndex;
varying float lineLetterIndex;
varying float vLineLettersTotal;

void main() {
    // Output
    vec4 mvPosition = vec4(position, 1.0);
    mvPosition = modelViewMatrix * mvPosition;
    gl_Position = projectionMatrix * mvPosition;

    // Varyings
    vUv = uv;
    vLayoutUv = layoutUv;
    vViewPosition = -mvPosition.xyz;
    vNormal = normal;

    lineIndex = line;
    letterIndex = letter;
    lineLetterIndex = lineLetters;
    vLineLettersTotal = lineLettersTotal;
}
