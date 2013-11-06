'use strict';
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function(connect, dir) {
  return connect.static(require('path').resolve(dir));
};
var mockApi = require('./api/mockApi.js');

module.exports = function(grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.loadNpmTasks('grunt-processhtml');

  // configurable paths
  var yeomanConfig = {
      app: 'app',
      dist: 'dist',
      api: 'api'
    },
    useMock = mockApi.mockApi(yeomanConfig.api);

  try {
    yeomanConfig.app = require('./bower.json').appPath || yeomanConfig.app;
  } catch (e) {
  }

  grunt.initConfig({
    yeoman: yeomanConfig,
    watch: {
      coffee: {
        files: ['<%= yeoman.app %>/scripts/**/*.coffee'],
        tasks: ['coffee:dist']
      },
      coffeeTest: {
        files: ['test/spec/**/*.coffee'],
        tasks: ['coffee:test']
      },
      compass: {
        files: ['<%= yeoman.app %>/styles/**/*.{scss,sass}'],
        tasks: ['compass']
      },
      livereload: {
        files: [
          '<%= yeoman.app %>/**/*.html',
          '{.tmp,<%= yeoman.app %>}/styles/**/*.css',
          '{.tmp,<%= yeoman.app %>}/scripts/**/*.js',
          '{.tmp,<%= yeoman.app %>}/private-components/**/*.js',
          '<%= yeoman.app %>/styles/img/**/*.{png,jpg,jpeg,gif,webp,svg}'
        ],
        tasks: ['livereload']
      }
    },
    connect: {
      options: {
        port: 9000,
        hostname: '0.0.0.0'
      },
      livereload: {
        options: {
          middleware: function(connect) {
            return [
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, yeomanConfig.app),
              mountFolder(connect, 'test'),
              mountFolder(connect, 'api'),
              useMock
            ];
          }
        }
      },
      test: {
        options: {
          middleware: function(connect) {
            return [
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'test')
            ];
          },
          port: 9002
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= connect.options.port %>'
      }
    },
    clean: {
      dist: {
        files: [
          {
            dot: true,
            src: [
              '.tmp',
              '<%= yeoman.dist %>/*',
              '!<%= yeoman.dist %>/.git*'
            ]
          }
        ]
      },
      server: '.tmp'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/scripts/**/*.js',
        '!app/scripts/services/base64.js',
        '!app/scripts/directives/nxgChart/nxgChart.js',
        '!app/scripts/directives/tooltip.js'
      ]
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },
    coffee: {
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.app %>/scripts',
            src: '**/*.coffee',
            dest: '.tmp/scripts',
            ext: '.js'
          }
        ]
      },
      test: {
        files: [
          {
            expand: true,
            cwd: 'test/spec',
            src: '**/*.coffee',
            dest: '.tmp/spec',
            ext: '.js'
          }
        ]
      }
    },
    compass: {
      options: {
        sassDir: '<%= yeoman.app %>/styles',
        cssDir: '.tmp/styles',
        imagesDir: '<%= yeoman.app %>/img',
        javascriptsDir: '<%= yeoman.app %>/scripts',
        fontsDir: '<%= yeoman.app %>/styles/fonts',
        importPath: '<%= yeoman.app %>/components',
        relativeAssets: true
      },
      dist: {
        options: {
          cssDir: '<%= yeoman.app %>/styles'
        }
      },
      server: {
        options: {
          debugInfo: true,
        }
      }
    },
    concat: {
      dist: {
        files: {
          '<%= yeoman.dist %>/scripts/scripts.js': [
            '.tmp/scripts/**/*.js',
            '<%= yeoman.app %>/scripts/**/*.js'
          ]
        }
      }
    },
    processhtml: {
      options: {},
      dist: {
        files: {
          '<%= yeoman.dist %>/index.html': ['<%= yeoman.dist %>/index.html'],
          '<%= yeoman.dist %>/unsupported.html': ['<%= yeoman.dist %>/unsupported.html']
        }
      }
    },
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>'
      }
    },
    usemin: {
      html: ['<%= yeoman.dist %>/**/*.html', '!<%= yeoman.dist %>/components/**/*.html'],
      css: ['<%= yeoman.dist %>/styles/**/*.css'],
      options: {
        dirs: ['<%= yeoman.dist %>']
      }
    },
    imagemin: {
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.app %>/images',
            src: '**/*.{png,jpg,jpeg}',
            dest: '<%= yeoman.dist %>/images'
          }
        ]
      }
    },
    cssmin: {
      dist: {
        files: {
          '<%= yeoman.dist %>/styles/main.css': [
            '<%= yeoman.dist %>/styles/main.css'
          ]
        }
      }
    },
    htmlmin: {
      dist: {
        options: {
          /*removeCommentsFromCDATA: true,
           // https://github.com/yeoman/grunt-usemin/issues/44
           //collapseWhitespace: true,
           collapseBooleanAttributes: true,
           removeAttributeQuotes: true,
           removeRedundantAttributes: true,
           useShortDoctype: true,
           removeEmptyAttributes: true,
           removeOptionalTags: true*/
        },
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.app %>',
            src: [
              '*.html',
              'index.html',
              'views/**/*.html',
              'scripts/directives/**/*.html',
              '!scripts/config/nxgConfig.mock.js',
              '!scripts/dev/autologin.js'
            ],
            dest: '<%= yeoman.dist %>'
          }
        ]
      }
    },
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },
    ngmin: {
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.dist %>/scripts',
            src: '*.js',
            dest: '<%= yeoman.dist %>/scripts'
          }
        ]
      }
    },
    uglify: {
      dist: {
        files: {
          '<%= yeoman.dist %>/scripts/scripts.js': [
            '<%= yeoman.dist %>/scripts/scripts.js'
          ]
        }
      }
    },
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/scripts/**/*.js',
            '<%= yeoman.dist %>/styles/**/*.css',
            '<%= yeoman.dist %>/img/**/*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= yeoman.dist %>/styles/fonts/*'
          ]
        }
      }
    },
    copy: {
      dist: {
        files: [
          { expand: true, dot: true, flatten: true, dest: '<%= yeoman.dist %>/', src: '<%= yeoman.app %>/version.txt' },
          { expand: true, dot: true, flatten: true, dest: '<%= yeoman.dist %>/', src: '<%= yeoman.app %>/favicon.ico' },
          { expand: true, dot: true, flatten: true, dest: '<%= yeoman.dist %>/img/', src: '<%= yeoman.app %>/img/*' },
          { expand: true, dot: true, flatten: true, dest: '<%= yeoman.dist %>/img/icons/', src: '<%= yeoman.app %>/img/icons/*' },
          { expand: true, dot: true, flatten: true, dest: '<%= yeoman.dist %>/img/browsers/', src: '<%= yeoman.app %>/img/browsers/*' },
          { expand: true, dot: true, flatten: true, dest: '<%= yeoman.dist %>/fonts/', src: '<%= yeoman.app %>/fonts/**/*' },
          { expand: true, dot: true, flatten: true, dest: '<%= yeoman.dist %>/documents/', src: '<%= yeoman.app %>/documents/**/*' },
          {
            expand: true,
            dot: true,
            cwd: '<%= yeoman.app %>',
            dest: '<%= yeoman.dist %>/',
            src: '**/*.html'
          }
        ]
      }
    }
  });

  grunt.renameTask('regarde', 'watch');

  grunt.registerTask('server', [
    'clean:server',
    'compass:server',
    'livereload-start',
    'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('test', [
    'clean:server',
    'coffee',
    'compass',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'jshint',
    'test',
    'compass:dist',
    'useminPrepare',
    'imagemin',
    'htmlmin',
    'concat',
    'copy',
    'cdnify',
    'ngmin',
//    'uglify',
    'rev',
    'usemin',
    'cssmin',
    'processhtml'
  ]);

  grunt.registerTask('default', ['build']);
};
