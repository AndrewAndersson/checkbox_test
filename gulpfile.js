var gulp = require('gulp'),
    pug = require('gulp-pug'),
    sass = require('gulp-sass'),
    plumber = require('gulp-plumber'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    prefix = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    cssmin = require('gulp-clean-css'),
    rimraf = require('rimraf'),
    notify = require('gulp-notify'),
    browserSync = require('browser-sync').create();


var paths = {
    blocks: 'blocks/',
    devDir: 'app/',
    outputDir: 'build/'
};

//pug
gulp.task('pug', function() {
    return gulp.src([paths.blocks + '*.pug', '!' + paths.blocks + 'template.pug'])
        .pipe(plumber())
        .pipe(pug({ pretty: true }))
        .pipe(gulp.dest(paths.devDir))
        .pipe(browserSync.stream())
});

//sass
gulp.task('sass', function() {
    return gulp.src(paths.blocks + '*.sass')
        .pipe(plumber())
        .pipe(sass().on('error', sass.logError))
        .pipe(prefix({
            browsers: ['last 10 versions'],
            cascade: true
        }))
        .pipe(gulp.dest(paths.devDir + 'css/'))
        .pipe(browserSync.stream());
});

//js
gulp.task('scripts', function() {
    return gulp.src([
            paths.blocks + '**/*.js',
            '!' + paths.blocks + '_assets/**/*.js'
        ])
        .pipe(concat('main.js'))
        .pipe(gulp.dest(paths.devDir + 'js/'))
        .pipe(browserSync.stream());
});


//watch
gulp.task('watch', function() {
    gulp.watch(paths.blocks + '**/*.pug', ['pug']);
    gulp.watch(paths.blocks + '**/*.sass', ['sass']);
    gulp.watch(paths.blocks + '**/*.js', ['scripts']);
});
// BrowserSync
gulp.task('browser-sync', function() {
    browserSync.init({
        port: 3000,
        server: {
            baseDir: paths.devDir
        },
        notify: false
    });
});
//clean
gulp.task('clean', function(cb) {
    rimraf(paths.outputDir, cb);
});

//css + js
gulp.task('build', ['clean'], function() {
    return gulp.src(paths.devDir + '*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', cssmin()))
        .pipe(gulp.dest(paths.outputDir));
});

//copy images to outputDir
gulp.task('imgBuild', ['clean'], function() {
    return gulp.src(paths.devDir + 'img/**/*.*')
        .pipe(imagemin())
        .pipe(gulp.dest(paths.outputDir + 'img/'));
});

//copy fonts to outputDir
gulp.task('fontsBuild', ['clean'], function() {
    return gulp.src(paths.devDir + '/fonts/*')
        .pipe(gulp.dest(paths.outputDir + 'fonts/'));
});

//default
gulp.task('default', ['browser-sync', 'watch', 'pug', 'sass', 'scripts']);

//production
gulp.task('prod', ['build', 'imgBuild', 'fontsBuild']);