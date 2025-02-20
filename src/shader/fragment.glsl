uniform sampler2D uTexture;
varying vec2 vUv;

void main() {

    vec4 final = texture2D(uTexture, vUv);

    //gl_FragColor = vec4(final.xyz, 1.0);
    gl_FragColor = vec4(vec3(1.0), 1.0);

}