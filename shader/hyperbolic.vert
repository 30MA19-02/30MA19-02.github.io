#ifdef GL_ES

precision mediump float;

#endif

attribute vec3 aPosition;
uniform mat3 u_transformation;
uniform int u_t;
float sinh(float x){
    return (exp(x)-exp(-x))/2.0;
}
float cosh(float x){
    return (exp(x)+exp(-x))/2.0;
}
mat3 trans(vec2 xy, float rot){
    return mat3(
        cosh(xy.x), sinh(xy.x), 0.0,
        sinh(xy.x), cosh(xy.x), 0.0,
        0.0,        0.0,        1.0
    ) * mat3(
        cosh(xy.y), 0.0,        sinh(xy.y),
        0.0,        1.0,        0.0,
        sinh(xy.y), 0.0,        cosh(xy.y)
    ) * mat3(
        1.0,        0.0,        0.0,
        0.0,        cos(rot),  -sin(rot),
        0.0,        sin(rot),   cos(rot)
    );
}
void main() {
    // mat3 vert = trans(aPosition.xy, 0.0);
    // mat3 trans = u_transformation;
    // vec3 b_position_ = trans * vert * vec3(1.0, 0.0, 0.0); // Apply
    // vec2 b_position = b_position_.yz / (1.0 + b_position_.x); // Projection
    // gl_Position = vec4(b_position, aPosition.z, 1.0);
    vec4 pos = vec4(aPosition, 1.0);
    // pos.xy = pos.xy * 2.0 - 1.0;
    gl_Position = pos;
}
