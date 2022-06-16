// vec2 rotateUV(vec2 uv, float rotation)
// {
//     float mid = 0.5;
//     return vec2(
//         cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
//         cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
//     );
// }

vec2 rotateUV(vec2 uv, float angle){
    vec2 st = uv - vec2(0.5);
    st = mat2(cos(angle),-sin(angle), sin(angle),cos(angle)) * st;
    st += vec2(0.5);
    return st;
}

#pragma glslify: export(rotateUV)