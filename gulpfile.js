
const {src, dest, parallel} = require('gulp');
const rename = require('gulp-rename');

const sass = require('gulp-sass')(require('sass'));


function demo_css() {
  return src('src/scss/demo_*.scss')
    .pipe(sass({
      loadPaths: [
        './node_modules/@loltgt/ensemble--demo/src/scss',
        './node_modules/@loltgt/ensemble-modal--demo/src/scss'
      ],
      silenceDeprecations: ['import'],
      style: 'compressed'
    }).on('error', sass.logError))
    .pipe(rename(function(srcpath) {
      srcpath.basename = srcpath.basename.replace('demo_', 'demo-ensemble-');
    }))
    .pipe(dest('demo'));
}


exports['demo.css'] = demo_css;
exports.default = parallel([demo_css]);
