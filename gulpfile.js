var gulp = require('gulp'),
    less = require('gulp-less'), //less编译
    autoprefixer = require('gulp-autoprefixer'), //前缀补全
    minifyCss = require('gulp-minify-css'), //css压缩
    rename = require("gulp-rename"), //文件改名
    uglify = require('gulp-uglify'), //压缩js
    babel = require('gulp-babel'),
    zip = require('gulp-zip'), //压缩打包文件
    del = require('del'), //删除文件
    gulpSequence = require('gulp-sequence'); //顺序执行


gulp.task('del', function(cb) {
    del(['dist'], cb);
})

gulp.task('wxss', function() {
    return gulp.src(['src/**/*.less'])
        //.pipe(less().on('error', less.logError))
        .pipe(autoprefixer('> 1%', 'last 9 versions', 'Firefox ESR', 'ios 5', 'android 2'))
        .pipe(minifyCss())
        .pipe(rename({
            extname: ".wxss"
        }))
        .pipe(gulp.dest('dist'))
});

gulp.task('js', function() {
    return gulp.src(['src/**/*.js'])
        // .pipe(babel({
        //     presets: ['es2015', 'react', 'stage-0']
        // }))
        // .pipe(uglify())
        .pipe(gulp.dest('dist/'))
})

gulp.task('wxml', function() {
    return gulp.src(['src/**/*.html'])
        .pipe(rename({
            extname: ".wxml"
        }))
        .pipe(gulp.dest('dist'))
});


gulp.task('image', function() {
    return gulp.src(['src/**/*.png', 'src/**/*.jpg'])
        .pipe(gulp.dest('dist'))
});

gulp.task('json', function() {
    return gulp.src(['src/**/*.json'])
        .pipe(gulp.dest('dist'))
});

gulp.task('delzip', function(cb) {
    del(['./test.zip'], cb);
})
gulp.task('zip', ['delzip'], function() {
    return gulp.src('dist/**/*')
        .pipe(zip('test.zip'))
        .pipe(gulp.dest('./'));
});

gulp.task('watch', function() {
    gulp.watch('src/**/*', ['wxss']);
    gulp.watch('src/**/*.js', ['js']);
    gulp.watch('src/**/*.html', ['wxml']);
    gulp.watch('src/**/*.png', ['image']);
    gulp.watch('src/**/*.json', ['json']);

});

gulp.task('default', function(cb) {
    gulpSequence('del', 'image', 'wxss', 'js', 'wxml', 'json', 'watch', cb);
});
