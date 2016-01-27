var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var less = require('gulp-less');
var path = require('path');
var minify_css = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var swig = require('gulp-swig');

/**
 * 监控javascripts/*和less/*.less文件
 */
gulp.task('watch', ['js', 'css', 'images','fonts', 'templates', 'components', 'libs'], function() {
  gulp.watch('public/js/**/*.js', ['js']);
  gulp.watch('public/css/**/*.*', ['css']);
  gulp.watch('public/images/**/*.*', ['images']);
  gulp.watch('public/fonts/**/*.*', ['fonts']);
  gulp.watch('public/views/**/*.html', ['templates']);
  gulp.watch('public/views/components/**/*.*', ['components']);
  gulp.watch('public/lib/**/*.*', ['libs']);
});

/**
 * 编译font文件
 */
gulp.task('fonts', function() {
  return gulp.src('./public/fonts/**/*.*')
    .pipe(gulp.dest('./build/public/fonts/'));
})


gulp.task('libs', function() {
  return gulp.src('./public/lib/**/*.*')
    .pipe(gulp.dest('./build/public/lib/'));
})

/**
 * 编译css文件
 */
gulp.task('css', function() {
  return gulp.src('./public/css/**/*.*')
    .pipe(gulp.dest('./build/public/css/'));
  // return gulp.src('./public/less/*.less')
  //   .pipe(less({
  //     paths: [ path.join(__dirname, 'less', 'includes') ]
  //   }))
  //   // .pipe(minify_css())
  //   .pipe(gulp.dest('./build/public/css'));
});

/**
 * 压缩js文件
 */
gulp.task('js', function() {
  return gulp.src('./public/js/**/*.js')
    .pipe(sourcemaps.init({ loadMaps: true }))
    //.pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./build/public/js/'));
});

gulp.task('images', function() {
  return gulp.src('./public/images/**/*.+(jp?(e)g|gif|png)')
    .pipe(gulp.dest('./build/public/images/'));
})

//components
gulp.task('components', function() {
  gulp.src('./public/views/components/**/*.+(html|css|js)')
    .pipe(gulp.dest('./build/public/views/components/'))
});

//templates
gulp.task('templates', function() {
  gulp.src('./public/views/pages/**/*.html')
    .pipe(swig({defaults: { cache: false }}))
    .pipe(gulp.dest('./build/public/views/'))
});

/**
 * 运行服务器程序， 进行调试
 */
gulp.task('server', function() {
  nodemon({
    script: 'server.js',
    ext: 'js',
    env: { 'NODE_ENV': 'development' },
    ignore: [
      '.git',
      'node_modules',
      'public',
      'build'
    ],
    verbose: true,
    watch: [
      //'./**/*.js'
      'config',
      'middlewares',
      'controllers',
      'models',
      'util',
      'routers',
      'services',
      'routers.js',
      'server.js'
    ]
  });
});

gulp.task('default', ['watch', 'server']);