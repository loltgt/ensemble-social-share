
const path = require('path');

const {src, dest, watch, series, parallel} = require('gulp');
const rename = require('gulp-rename');
const tap = require('gulp-tap');
const sourcemaps = require('gulp-sourcemaps');

const sass = require('gulp-sass')(require('sass'));
const rollup = require('@rbnlffl/gulp-rollup');
const {nodeResolve} = require('@rollup/plugin-node-resolve');
const babel = require('gulp-babel');
const terser = require('gulp-terser');

// flag: -- --sourcemap-debug
var sourcemap_debug = process.argv.indexOf('--sourcemap-debug') || false;


function remove_debug(file) {
  let contents = file.contents.toString();
  contents = contents.replace(/console\.(?!warn)\w+\(.+(?:(?:\);))/g, '');

  file.contents = Buffer.from(contents);
}

function remove_comments(file) {
  let contents = file.contents.toString();
  contents = contents.replace(/\/[\*]+(=?[\w\W]+?)\*\//g, '').replace(/(?:(?![:\\]).)\/\/(?!\.)[^\n]+/g, '');

  file.contents = Buffer.from(contents);
}

function bundle_basename() {
  let basename;

  if ('npm_package_name' in process.env) {
    basename = process.env.npm_package_name;
  } else {
    var npm_pkg = require('./package.json');
    basename = npm_pkg.name;
  }

  return basename;
}

function bundle_banner() {
  var npm_pkg = require('./package.json');

  const pkg = {
    name: npm_pkg.name.replace(/-/g, ' ').replace(/\b[a-z]/g, (v, i) => i ? v.toUpperCase() : v),
    version: npm_pkg.version,
    link: npm_pkg.homepage,
    copyright: 'Copyright (C) Leonardo Laureti',
    license: 'MIT License'
  };

  return '/*!\n\
 * ' + pkg.name + '\n\
 * @version ' + pkg.version + '\n\
 * @link ' + pkg.link + '\n\
 * @copyright ' + pkg.copyright + '\n\
 * @license ' + pkg.license + '\n\
 */\n';
}

function js() {
  return src('index.js')
    .pipe(sourcemaps.init({
        loadMaps: false,
        debug: sourcemap_debug,
    }))
    .pipe(rollup(
      {
        plugins: [nodeResolve()]
      },
      {
        sourcemap: false,
        format: 'iife',
        name: 'ensemble',
        extend: true
      }
    ))
    .pipe(tap(remove_comments))
    .pipe(tap(function(file) {
      file.contents = Buffer.from(bundle_banner() + file.contents.toString());
    }))
    .pipe(rename(function(srcpath) {
      srcpath.basename = bundle_basename();
    }))
    // .pipe(sourcemaps.mapSources(function(srcpath, file) {
    //   const base = path.relative(file.cwd, file.dirname);
    //   return path.relative(base, srcpath);
    // }))
    // .pipe(sourcemaps.write('.', { includeContent: false }))
    .pipe(dest('dist/js'));
}

function js_compat() {
  return src('index.js')
    .pipe(sourcemaps.init({
        loadMaps: false,
        debug: sourcemap_debug,
    }))
    .pipe(babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(rollup(
      {
        plugins: [nodeResolve()]
      },
      {
        sourcemap: false,
        format: 'umd',
        name: 'ensemble',
        extend: true
      }
    ))
    .pipe(tap(remove_comments))
    .pipe(tap(function(file) {
      file.contents = Buffer.from(bundle_banner() + file.contents.toString());
    }))
    .pipe(rename(function(srcpath) {
      srcpath.basename = bundle_basename();
      srcpath.basename += '-compat'; 
    }))
    // .pipe(sourcemaps.mapSources(function(srcpath, file) {
    //   const base = path.relative(file.cwd, file.dirname);
    //   return path.relative(base, srcpath);
    // }))
    // .pipe(sourcemaps.write('.', { includeContent: false }))
    .pipe(dest('dist/js'));
}

function _js_minify(options) {
  options = options || {compat: false};

  return (! options.compat ? js() : js_compat())
    .pipe(sourcemaps.init({
      loadMaps: false,
      debug: sourcemap_debug,
    }))
    .pipe(tap(remove_debug))
    .pipe(terser({
      keep_classnames: true,
      keep_fnames: true,
      format: {
        comments: false
      }
    }))
    .pipe(tap(function(file) {
      file.contents = Buffer.from(bundle_banner() + file.contents.toString());
    }))
    .pipe(rename(function(srcpath) {
      srcpath.extname = '.min' + srcpath.extname;
    }))
    // .pipe(sourcemaps.mapSources(function(srcpath, file) {
    //   const base = path.relative(file.cwd, file.dirname);
    //   return path.relative(base, srcpath);
    // }))
    // .pipe(sourcemaps.write('.', { includeContent: false }))
    .pipe(dest('dist/js'));
}

function js_minify() {
  return _js_minify();
}

function js_compat_minify() {
  return _js_minify({compat: true});
}

function _css(options) {
  options = options || {minify: false, compat: false};

  return src([
      ! options.compat ? 'src/scss/*.scss' : 'src/scss/*_compat.scss',
      ! options.compat ? '!src/scss/*_compat.scss' : '!',
      '!src/scss/demo_*.scss'
    ])
    .pipe(sourcemaps.init({
        loadMaps: false,
        debug: sourcemap_debug
    }))
    .pipe(sass({
      loadPaths: [
        './node_modules/@loltgt/ensemble-modal/src/scss'
      ],
      silenceDeprecations: ['import'],
      style: options.minify ? 'compressed' : 'expanded',
    }).on('error', sass.logError))
    .pipe(tap(remove_comments))
    .pipe(tap(function(file) {
      file.contents = Buffer.from(bundle_banner() + file.contents.toString());
    }))
    .pipe(rename(function(srcpath) {
      srcpath.basename = bundle_basename();

      if (options.compat) {
        srcpath.basename += '-compat';
      }
      if (options.minify) {
        srcpath.extname = '.min' + srcpath.extname;
      }
    }))
    // .pipe(sourcemaps.mapSources(function(srcpath, file) {
    //   const base = path.relative(file.cwd, file.dirname);
    //   return path.relative(base, srcpath);
    // }))
    // .pipe(sourcemaps.write('.', { includeContent: false }))
    .pipe(dest('dist/css'));
}

function css() {
  return _css();
}

function css_minify() {
  return _css({minify: true});
}

function css_compat() {
  return _css({compat: true});
}

function css_compat_minify() {
  return _css({compat: true, minify: true});
}

function demo_css() {
  return src('src/scss/demo_*.scss')
    .pipe(sourcemaps.init({
      loadMaps: false,
      debug: sourcemap_debug
    }))
    .pipe(sass({
      loadPaths: [
        './node_modules/@loltgt/ensemble/src/scss',
        './node_modules/@loltgt/ensemble-modal/node_modules/@loltgt/ensemble/src/scss'
      ],
      silenceDeprecations: ['import'],
      style: 'compressed'
    }).on('error', sass.logError))
    .pipe(rename(function(srcpath) {
      srcpath.basename = srcpath.basename.replace('demo_', 'demo-ensemble-');
    }))
    // .pipe(sourcemaps.mapSources(function(srcpath, file) {
    //   const base = path.relative(file.cwd, file.dirname);
    //   return path.relative(base, srcpath);
    // }))
    // .pipe(sourcemaps.write('.', { includeContent: false }))
    .pipe(dest('demo'));
}

function watcher() {
  watch('js/**/*.js', build_js);
  watch('scss/**/*.scss', build_css);
}


const build_js = series([js, js_minify]);
const build_css = series([css, css_minify]);
const build_compat_js = series([js_compat, js_compat_minify]);
const build_compat_css = series([css_compat, css_compat_minify]);
const build_compat = parallel([build_compat_js, build_compat_css]);
const build_demo_css = demo_css;
const build = parallel([build_js, build_css]);

exports['build'] = build;
exports['build.js'] = build_js;
exports['build.css'] = build_css;
exports['build.compat.js'] = build_compat_js;
exports['build.compat.css'] = build_compat_css;
exports['build.compat'] = build_compat;
exports['build.demo.css'] = build_demo_css;
exports['watch'] = watcher;
exports.default = build;
