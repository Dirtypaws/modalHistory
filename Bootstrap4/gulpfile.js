/// <binding Clean='clean' ProjectOpened='clean, css, js, watch' />
"use strict";

// ReSharper disable UndeclaredGlobalVariableUsing
var gulp = require("gulp"),
    rimraf = require("rimraf"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify"),
    flatten = require("gulp-flatten"),
    watch = require("gulp-watch"),
    less = require("gulp-less"),
    sass = require("gulp-sass"),
    merge = require("merge-stream"),
    rename = require("gulp-rename"),
    dest = "./wwwroot";

var paths = {
    libs: "./node_modules/",
    CSS: "./CSS/"
};

gulp.task("clean", function (cb) {
    rimraf(dest, cb);
});

gulp.task("js:libs",
    function() {
        return gulp.src([
                paths.libs + "jquery/dist/jquery.js",
                paths.libs + "bootstrap/dist/js/bootstrap.bundle.js"
            ])
            .pipe(concat("libs.min.js"))
            .pipe(uglify().on("error", handleError))
            .pipe(gulp.dest(dest).on("error", handleError));
    });

gulp.task("js:app",
    function () {
        gulp.src(["Scripts/**", "!Scripts/*.js"], { base: "Scripts" })
            .pipe(uglify().on('error', handleError))
            .pipe(rename(function (path) {
                if (path.extname.length > 0)
                    path.basename += ".min";
            }))
            .pipe(gulp.dest(dest));

        return gulp.src([
                "Scripts/*.js",
                "!Scripts/*.min.js"
            ])
            .pipe(concat("app.min.js").on('error', handleError))
            .pipe(uglify().on('error', handleError))
            .pipe(gulp.dest(dest));
    });

gulp.task("js", ["js:libs", "js:app"]);

gulp.task("css:app",
    function() {
        return gulp.src([paths.CSS + "*.scss"])
            .pipe(sass().on("error", handleError))
            .pipe(concat("app.min.css").on("error", handleError))
            .pipe(cssmin().on('error', handleError))
            .pipe(gulp.dest(dest).on("error", handleError));

    });

gulp.task("css", ["css:libs", "css:app", "css:fonts", "css:images"]);


gulp.task("css:libs",
    function() {
        var sassStream = gulp.src([
                paths.CSS + "bootstrap/bootstrap.scss",
                paths.CSS + "Font-Awesome/font-awesome.scss",
            ])
            .pipe(sass().on("error", handleError));

        var cssStream = gulp.src([
        ]);

        var lessStream = gulp.src([])
            .pipe(less().on("error", function(e) { console.log(e); }));

        return merge(sassStream, cssStream, lessStream)
            .pipe(concat("libs.min.css").on("error", handleError))
            .pipe(cssmin().on("error", handleError))
            .pipe(gulp.dest(dest).on("error", handleError));
    });

gulp.task("css:fonts",
    function () {
        return gulp.src([paths.libs + "font-awesome/fonts/**/*.{otf,ttf,woff,woff2,eot,svg}"])
            .pipe(flatten().on("error", handleError))
            .pipe(gulp.dest(dest + "/fonts").on("error", handleError));
    });

gulp.task("css:images",
    function() {
        return gulp.src([
                "images/*",
                "!" + paths.libs + "**/*.ico"
            ])
            .pipe(flatten().on("error", handleError))
            .pipe(gulp.dest(dest + "/images").on("error", handleError));

    });

gulp.task("watch",
    function() {
        watch([paths.bower + "*/*.scss", paths.bower + "palette.less", paths.bower + "palette.scss"],
            function() {
                gulp.start("css:libs");
            });

        watch(paths.bower + "*/*.less",
            function() {
                gulp.start("css:libs");
            });

        watch(["./CSS/**/*.scss",
                paths.bower + "palette.less", paths.bower + "palette.scss"
            ],
            function() {
                gulp.start("css:app");
            });

        watch(["./Scripts/**/*.js", "./Scripts/*.js"],
            function() {
                gulp.start("js:app");
            });
    });

function handleError(err) {
  console.log(err.toString());
  this.emit("end");
}