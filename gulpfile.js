
const {src, dest, series, parallel} = require('gulp');
const rename = require('gulp-rename');

const sass = require('gulp-sass')(require('sass'));


function demo_css() {
  return src('src/scss/demo_*.scss')
    .pipe(sass({
      loadPaths: [
        './node_modules/ensemble--demo/src/scss'
      ],
      silenceDeprecations: ['import'],
      style: 'compressed'
    }).on('error', sass.logError))
    .pipe(rename(function(srcpath) {
      srcpath.basename = srcpath.basename.replace('demo_', 'demo-ensemble-');
    }))
    .pipe(dest('demo'));
}

const demo_prepublish = series([
  function demo_prepublish() {
    return src(['LICENSE', 'README.md'], {cwd: '../'})
      .pipe(dest('.'));
  },
  function demo_prepublish() {
    // font binary bogus
    return src(['dist/**', '!dist/font/*.woff2'], {cwd: '../', base: '.'})
    .pipe(dest('dist'));
  }
]);


exports['demo:css'] = demo_css;
exports['demo:prepublish'] = demo_prepublish;
exports.default = parallel([demo_css, demo_prepublish]);
