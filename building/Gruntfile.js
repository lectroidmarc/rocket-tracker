/*
 *
 */

module.exports = function(grunt) {
  grunt.initConfig({
    connect: {
      server: {
        options: {
          base: '..',
          port: 8001,
          protocol: 'http2',
          livereload: 35730,
          open: 'https://localhost:8001',
          middleware: function(connect, options, middlewares) {
            middlewares.unshift(function(req, res, next) {
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
    watch: {
      options: {
        livereload: {
          port: 35730,
          key: grunt.file.read('node_modules/grunt-contrib-connect/tasks/certs/server.key'),
          cert: grunt.file.read('node_modules/grunt-contrib-connect/tasks/certs/server.crt')
        },
        livereloadOnError: false
      },
      html: {
        files: ['../index.html', '../components/*.html']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['connect', 'watch']);
};
