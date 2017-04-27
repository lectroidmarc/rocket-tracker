/*
 *
 */

module.exports = function (grunt) {
  grunt.initConfig({
    concat: {
      js: {
        src: ['../js/*.js'],
        dest: 'concat.js',
      }
    },
    connect: {
      server: {
        options: {
          base: '..',
          port: 8000,
          protocol: 'http2',
          livereload: true,
          open: 'https://localhost:8000',
          middleware: function (connect, options, middlewares) {
            middlewares.unshift(function (req, res, next) {
              if (req.url === '/manifest.json') {
                res.setHeader('Content-Type', 'application/manifest+json');
              }
              return next();
            });

            return middlewares;
          }
        }
      }
    },
    jscs: {
      options: {
        config: true
      },
      js: ['../js/*.js', '../service-worker.js'],
    },
    jshint: {
      beforeconcat: {
        options: {
          jshintrc: true
        },
        files: {
          src: ['../js/*.js', '../service-worker.js']
        }
      },
      afterconcat: {
        options: {
          browser: true,
          devel: true,
          esversion: 6,
          undef: true,
          unused: true,
          globals: {
            componentHandler: true,
            firebase: true,
            google: true
          },
        },
        files: {
          src: ['concat.js']
        }
      }
    },
    watch: {
      options: {
        livereload: {
          key: grunt.file.read('node_modules/grunt-contrib-connect/tasks/certs/server.key'),
          cert: grunt.file.read('node_modules/grunt-contrib-connect/tasks/certs/server.crt')
        },
        livereloadOnError: false,
        maxListeners: 24,
      },
      html: {
        files: ['../index.html']
      },
      js: {
        files: ['../js/*.js', '../service-worker.js'],
        tasks: ['checkjs']
      },
      css: {
        files: ['../css/*.css']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks("grunt-jscs");

  grunt.registerTask('default', ['connect', 'watch']);
  grunt.registerTask('checkjs', ['jshint:beforeconcat', 'concat:js', 'jshint:afterconcat', 'jscs']);
};
