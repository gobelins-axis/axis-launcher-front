vec2 rotateUV(vec2 uv, float rotation)
{
    vec2 mid = vec2(0.5, 0.5);
    return vec2(
      cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
      cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}

#pragma glslify: export(rotateUV)