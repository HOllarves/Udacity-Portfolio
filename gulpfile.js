const gulp = require('gulp'),
    express = require('express'),
    nano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    livereload = require('gulp-livereload'),
    imagemin = require('gulp-imagemin'),
    del = require('del'),
    server = express()


/**
 * Setting up express
 * 
 */

server.use(express.static('dist'))


/**
 * Minifying CSS assets
 * 
 */

gulp.task('minify-css', (done) => {
    gulp.src('src/css/*.css')
        .pipe(gulp.dest('./dist/css/'))
        .pipe(nano())
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(gulp.dest('./dist/css/'))
        .pipe(livereload())
        .on('end', done)
})

/**
 * Starting webserver
 * Port: 8000
 * 
 */
const PORT = 8000
gulp.task('serve', ['index', 'minify-css', 'imagemin', 'fonts', 'watch' ], () => {
    server.listen(PORT, () => {
        console.log('App running on port', PORT)
    })
})

/**
 * Moving index to dist folder
 * Specially used for runtime dependency injection
 * 
 */

gulp.task('index', () => {
    gulp.src('src/index.html')
        .pipe(gulp.dest('dist'))
        .pipe(livereload())
})

/**
 * Moving fonts to dist folder
 * 
 */

gulp.task('fonts', () => {
    gulp.src('src/assets/fonts/*')
    .pipe(gulp.dest('dist/assets/fonts'))
    .pipe(livereload())
})

/**
 * Compressing images
 * and moving them to
 * dist folder
 * 
 */

gulp.task('imagemin', () => {
    gulp.src('src/assets/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/assets/images'))
})

/**
 * Clean latest build
 * 
 */

gulp.task('clean', () => {
    del.sync(['dist/']);
})

/**
 * Watching for changes
 * in css files and index
 */

gulp.task('watch', () => {
    gulp.watch('src/css/*.css', ['minify-css'])
    gulp.watch('src/index.html', ['index'])
    gulp.watch('src/assets/images/*', ['imagemin'])
    gulp.watch('src/assets/fonts/*', ['fonts'])
    livereload.listen({ start: true });
})
