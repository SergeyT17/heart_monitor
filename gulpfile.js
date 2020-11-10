const {src, dest, parallel, series, watch} = require('gulp');
const browserSync  = require('browser-sync').create();
const sass         = require('gulp-sass');
const cleancss     = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const rename       = require('gulp-rename');
const concat       = require('gulp-concat');
const imagemin     = require('gulp-imagemin');
const newer        = require('gulp-newer');
const del          = require('del');
const uglify       = require('gulp-uglify-es').default;
const htmlmin         = require('gulp-htmlmin');

function browsersync() {
    browserSync.init({
        server: { baseDir: "src/" },
        notify: false,
    })
}

function html() {
    return src('src/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest('dist'))
}

function scripts() {
    return src([
        'node_modules/jquery/dist/jquery.min.js',
        'src/js/jquery.validate.min.js',
        'src/js/jquery.maskedinput.min.js',
        'src/js/slick.min.js',
        'src/js/wow.min.js',
        'src/js/scripts.js',
    ])
    .pipe(concat('scripts.min.js'))
    .pipe(uglify())
    .pipe(dest('src/js/'))
    .pipe(browserSync.stream())
}

function styles() {
    return src([
        'src/scss/libs/*.css',
        'src/scss/style.scss'
    ])
    .pipe(sass())
    .pipe(concat('style.min.css'))
    .pipe(autoprefixer({ overrideBrowserslist: ['last 7 versions'], grid: true }))
    .pipe(cleancss(({ level:{ 1: {specialComments: 0 }}})))
    .pipe(dest('src/css/'))
    .pipe(browserSync.stream())
}

function images() {
    return src('src/img/original/**/*')
    .pipe(newer('src/img/optimized/'))
    .pipe(imagemin())
    .pipe(dest('src/img/optimized/'))
}

function cleanimg() {
    return del('src/img/optimized/**/*', {force: true})
}

function cleandist() {
    return del(['dist', '!dist/*.html'], {force: true})
}

function startwatch() {
    watch('src/**/*.scss', styles);
    watch('src/**/*.html').on('change', browserSync.reload);
    watch('src/img/original/**/*', images);
    watch(['src/**/*.js', '!src/**/*.min.js'], scripts);
    watch('src/**/*.html', html);
}

function buildcopy() {
    return src([
        'src/css/**/*.min.css',
        'src/img/optimized/**/*',
        'src/fonts/*',
        'src/icons/*.png',
        'src/js/**/*.min.js',
        'src/mailer/**/*'
    ], { base: 'src'})
    .pipe(dest('dist'))
}

exports.browsersync = browsersync;
exports.html        = html;
exports.scripts     = scripts;
exports.styles      = styles;
exports.images      = images;
exports.cleanimg    = cleanimg;
exports.cleandist   = cleandist;
exports.buildcopy   = series(cleandist, html, styles, scripts, images, buildcopy);

exports.default     = parallel(styles, scripts, browsersync, startwatch); 