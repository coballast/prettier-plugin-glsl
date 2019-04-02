void main() {
    vec4 finalColor;
    if (length(testComputedVec3) > 1.5 && testUniformBool) {
        gl_FragCoord = vec4(testComputedVec3, 1.0);
    } else { gl_FragCoord= vec4(testComputedVec32, 0.5);}}
