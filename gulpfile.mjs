import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';

// css sass
import sassModule from 'gulp-sass';
import sassCompiler from 'sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

// js
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import stripComments from 'gulp-strip-comments';

// images
import webp from 'gulp-webp';
import avif from 'gulp-avif';

const sass = sassModule(sassCompiler);

/* ========== CSS ========== */
const compilerCSS = () => {
  return gulp
    .src('src/scss/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/css'));
};

const purgeCSS = async () => {
  const purgecss = (await import('@fullhuman/postcss-purgecss')).default;

  return gulp
    .src('build/css/main.css')
    .pipe(
      postcss([
        purgecss({
          content: ['./*.html', './src/js/*.js'],
          defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
        }),
      ])
    )
    .pipe(gulp.dest('build/css'));
};

/* ========== JavaScript ========== */
const scripts = () => {
  return gulp.src('src/js/**/*.js').pipe(uglify()).pipe(stripComments()).pipe(concat('main.js')).pipe(gulp.dest('build/js'));
};

/* ========== IMG ========== */
let imagemin;
const movImgs = async () => {
  await loadImagemin();
  return gulp
    .src('src/img/**/*')
    .pipe((await import('gulp-imagemin')).default({ optimizationLevel: 7 }))
    .pipe(gulp.dest('build/img'));
};

const loadWebp = () => {
  return gulp.src('src/img/**/*.{png,jpg}').pipe(webp()).pipe(gulp.dest('build/img'));
};

const loadAvif = () => {
  return gulp
    .src('src/img/**/*.{png,jpg}')
    .pipe(avif({ quality: 50 }))
    .pipe(gulp.dest('build/img'));
};

const loadImagemin = async () => {
  if (!imagemin) {
    imagemin = (await import('gulp-imagemin')).default;
  }
};

/* ========== fontawesome ========== */
const fontawesomeFonts = () => {
  return gulp.src('node_modules/@fortawesome/fontawesome-free/webfonts/*', { allowEmpty: true }).pipe(gulp.dest('build/fonts'));
};

const fontawesomeCss = () => {
  return gulp.src('node_modules/@fortawesome/fontawesome-free/css/all.min.css', { allowEmpty: true }).pipe(gulp.dest('build/css'));
};

/* ========== watch file ========== */
const watchFile = done => {
  gulp.watch('src/scss/**/*.scss', compilerCSS);
  gulp.watch('src/img/**/*', movImgs);
  gulp.watch('src/img/**/*', loadWebp);
  gulp.watch('src/img/**/*', avif);
  gulp.watch('src/js/**/*.js', scripts);

  done();
};

export { compilerCSS, movImgs, loadWebp, loadAvif, fontawesomeFonts, fontawesomeCss, buildForDeploy, watchFile };

const buildForDeploy = gulp.series(gulp.parallel(scripts, movImgs, loadWebp, loadAvif, fontawesomeFonts, fontawesomeCss), compilerCSS, purgeCSS);

export default gulp.series(buildForDeploy, watchFile);
