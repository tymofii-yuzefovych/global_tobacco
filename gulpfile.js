var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var pump = require('pump');
var uglify = require('gulp-uglify');
var htmlhint = require('gulp-htmlhint');
var browserSync = require('browser-sync').create();

var Files = {
    html: "./index.html",
    css_dest: "./css",
    scss_all: "./sass/**/*.scss",
    scss_main: "./sass/style.scss"
}

gulp.task('sass', function() {

    return gulp.src(Files.scss_main)
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: "expanded" }))
        .on('error', sass.logError)
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(Files.css_dest))
        .pipe(browserSync.stream())

});


// Minify CSS - Minifies CSS
gulp.task('minify-css', function() {
    gulp.src(['css/style.css', '!css/style.min.css'])
        .pipe(cleanCSS({ debug: true }, function(details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('css/'));
});

// Minify JS - Minifies JS
gulp.task('minify-js', function(cb) {
    pump([
            gulp.src(['js/**/*.js', '!js/**/*.min.js']),
            uglify(),
            rename({ suffix: '.min' }),
            gulp.dest('js/')
        ],
        cb
    );
});

// Htmlhint - Validate HTML
gulp.task('htmlhint', function() {
    gulp.src('*.html')
        .pipe(htmlhint())
        .pipe(htmlhint.reporter())
        .pipe(htmlhint.failReporter({ suppress: true }))
});

// This handles watching and running tasks
gulp.task('watch', function() {
    gulp.watch('scss/**/*.scss', ['sass']);
    gulp.watch('css/style.css', ['minify-css']);
    gulp.watch('js/**/*.js', ['minify-js']);
    gulp.watch('*.html', ['htmlhint']);
});

gulp.task('default', ['sass', 'minify-css', 'minify-js', 'htmlhint', 'watch'], function() {

    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch(Files.scss_all, ['sass']);
    gulp.watch(Files.html, browserSync.reload());

});