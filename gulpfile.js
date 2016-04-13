var gulp = require("gulp"),
    connect = require("gulp-connect"),
    opn = require("opn"),
    csso = require('gulp-csso'),
    autoprefixer = require('gulp-autoprefixer'),
    plumber = require('gulp-plumber'),
    jade = require('gulp-jade'),
    stylus = require("gulp-stylus"),
    ts = require('gulp-typescript'),
    concat = require('gulp-concat');

//*************************************//
// 1.Локальный сервер и автообновление //
//*************************************//

// Запуск локального сервера
gulp.task('connect', function(){
    connect.server({
        root: 'app/public',
        livereload: true,
        port: 8888
    });                                                           // Создание локального сервера
    
    opn('http://localhost:8888');                                 // Открытие локального сервера в браузере
});

// LiveReload при изменении HTML и JS файлов
gulp.task('reload', function() {
  gulp.src(
      ['./app/public/**/*.html',
      './app/public/js/*.js',
      './app/public/data/*.json'])
      .pipe(connect.reload());
});

// LiveReload при изменении CSS файлов
gulp.task('reload-css', function() {
  gulp.src(
      ['./app/public/css/*.css'])
      .pipe(connect.reload());
});

// LiveReload при изменении файлов JS библиотек
gulp.task('js-libs', function() {
  gulp.src([
        './app/src/libs/jquery/jquery.min.js',
        './app/src/libs/angular/angular.min.js'])                 // Определение порядка склеивания файлов
      .pipe(concat('vendor.js'))                                  // Склеивание в vendor.js
      .pipe(gulp.dest('./app/public/js/'));                       // Помещение vendor.js в соответствующую папку js
});

// LiveReload при изменении файлов JS полифилов для IE
gulp.task('js-ie', function() {
  gulp.src([
        './app/src/libs/ie/es5-shim.min.js',
        './app/src/libs/ie/html5shiv.min.js',
        './app/src/libs/ie/html5shiv-printshiv.min.js',
        './app/src/libs/ie/respond.min.js'])                      // Определение порядка склеивания файлов
      .pipe(concat('ie.js'))                                      // Склеивание в vendor.js
      .pipe(gulp.dest('./app/public/js/'));                       // Помещение vendor.js в соответствующую папку js
});

// Компиляция Stylus
gulp.task('stylus', function (){
    return gulp.src('./app/src/app.styl')
        .pipe(plumber())
        .pipe(stylus({
            compress: true
        }))
        .pipe(autoprefixer(
            'last 7 version',
            '> 1%',
            'ie 8',
            'ie 9',
            'ios 6',
            'android 4'
        ))
        .pipe(csso())
        .pipe(gulp.dest('./app/public/css'));
});

// Компиляция Jade для *.jade
gulp.task('jade', function(){
    gulp.src("./app/src/*.jade")
        .pipe(plumber())
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest("./app/public/"));

    gulp.src([
        './app/src/**/*.jade',
        './app/src/**/*.jade',
        '!./app/src/*.jade'])                                     // исключение *.jade для index.jade
        .pipe(plumber())
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest('./app/public/partials/'));
});

// Компиляция TypeScript для *.ts
gulp.task('ts', function(){
    var tsProject = ts.createProject('tsconfig.json');
    tsProject.src(['./app/src/**/*.ts'])
        .pipe(ts(tsProject))
        .pipe(gulp.dest('./app/public/js'));
});

// Запуск слежения
gulp.task('watch', function() {
   gulp.watch([
     './app/public/**/*.html',
     './app/public/js/*.js',
     './app/public/data/*.json'],
     ['reload']);
   gulp.watch(['./app/public/css/*.css'],['reload-css']);                                                 // Watching for LiveReload
   gulp.watch(['./app/src/libs/**/*.js'], ['js-ie', 'js-libs']);
   gulp.watch(['./app/src/**/*.jade'], ['jade']);
   gulp.watch(['./app/src/**/*.styl'], ['stylus']);
   gulp.watch(['./app/src/**/*.ts'], ['ts']);
});

//*************************************//
// /1.Локальный сервер и автообновление//
//*************************************//

// Зачада по умолчанию
gulp.task('default',['connect', 'watch', 'js-ie', 'js-libs']);