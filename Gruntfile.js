'use strict';

module.exports = function(grunt) {

  require('jit-grunt')(grunt, {
    sprite: 'grunt-spritesmith'
  });

  require('time-grunt')(grunt);

  var appConfig = {
    app: 'app',
    dist: 'dist'
  };

  grunt.initConfig({

    yeoman: appConfig,

    connect: {
      options: {
        port: 3000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: '0.0.0.0',
        livereload: 35729
        // keepalive: true
      },
      livereload: {
        // options: {
        //   base: [
        //     '<%= yeoman.app %>'
        //   ]
        // },
        options: {
          open: false
        },

        middleware: function(connect) {
          return [
            // connect.static(appConfig.app),
            // connect().use(
            //   '/bower_components',
            //   connect.static('./bower_components')
            // ),
            // require('connect-livereload')()
          ];
        }
      }
    },

    sprite: {
      all: {
        src: '<%= yeoman.app %>/images/*.png',
        dest: '<%= yeoman.app %>/images/build/sprites.png',
        destCss: '<%= yeoman.app %>/css/sprites.css'
      }
    },

    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      sass: {
        files: ['<%= yeoman.app %>/scss/*.scss'],
        tasks: ['sass:server', 'autoprefixer:server']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/{,**/}*.html',
          '<%= yeoman.app %>/css/{,**/}*.css',
          '<%= yeoman.app %>/js/{*,**/}*.js'
        ]
      }
      
    },

    sass: {
      options: {
        sourcemap: 'none',
        style: 'compact'
      },

      server: {
        options: {
          compass: false
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/scss',
          src: ['*.scss'],
          dest: '<%= yeoman.app %>/css',
          ext: '.css'
        }]
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 2 versions', '> 5%']
      },
      server: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/css/',
          src: '{,*/}*.css',
          dest: '<%= yeoman.app %>/css/'
        }]
      }
    },

    wiredep: {
      app: {
        src: [
          // '<%= yeoman.app %>/guide_list.html',
          // '<%= yeoman.app %>/chat.html'
          '<%= yeoman.app %>/*.html'
        ]
      }
    },

    filerev: {
      options: {
        algorithm: 'md5',
        length: 8
      },
      dist: {
        src: [
          '<%= yeoman.app %>/test.html'
        ]
      }
    },

    useminPrepare: {
      html: '<%= yeoman.app %>/activity.html',
      options: {
        dest: '<%= yeoman.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglify'],
              css: ['concat', 'cssmin']
            },
            post: {}
          }
        }
      }
    },

    usemin: {
      html: ['<%= yeoman.dist %>/{,**/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      js: '<%= yeoman.dist %>/scripts/*.js',
    },

    concat: {

    },

    timestamp: {
      options: {
        file: '<%= yeoman.app %>/index.html'
      }
    }

  });

  grunt.registerTask('serve', [
    // 'wiredep',
    'sass:server',
    'autoprefixer:server',
    'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('build', [
    
  ]);

  grunt.registerTask('timestamp', function() {
    var options = this.options({
      file: '.timestamp'
    });

    var timestamp = + new Date();
    var contents = timestamp.toString();

    grunt.file.write(options.file, contents);
  });

};
