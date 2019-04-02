import * as prettier from 'prettier';
const fs = require('fs');

console.log(
  prettier.format(fs.readFileSync('test/simpleTest.frag').toString(), {
    parser: 'glsl' as any,
    plugins: ['.'],
  })
);

console.log(
  prettier.format(fs.readFileSync('test/test.frag').toString(), {
    parser: 'glsl' as any,
    plugins: ['.'],
  })
);
