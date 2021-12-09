#ifdef GL_ES

precision mediump float;

#endif

uniform vec4 uMaterialColor;

// void main() {
//   gl_FragColor = uMaterialColor;
// }
void main() {

    // Make a blue color. In shaders, the RGB color goes from 0 - 1 instead of 0 - 255

    vec3 color = vec3(0.0, 0.0, 1.0);

    gl_FragColor = vec4(color, 1.0);

}
