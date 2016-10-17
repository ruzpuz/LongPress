(function () {
    'use strict';

    var minify = require('gulp-minify'),
        gulp = require('gulp');

    gulp.task('compress', function() {
        gulp.src('src/*.js')
            .pipe(minify({
                ext:{
                    src:'-debug.js',
                    min:'-min.js'
                }
            }))
            .pipe(gulp.dest('dist'))
    });
}());