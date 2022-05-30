vec2 scaleUv(vec2 uv, float scale)
{
  return (uv - 0.5) * (1.0 / scale) + 0.5;
}

#pragma glslify: export(scaleUv)