'use strict';

var serveStatic = require('serve-static');
var mockApi = require('./api/mockApi.js');

module.exports = function(grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // configurable paths
  var yeomanConfig = {
      app: 'app',
      dist: 'dist',
      api: 'api'
    },
    useMock = mockApi.mockApi(yeomanConfig.api);

  var defaultTarget = 'test';
  var defaultVersion = '15.11.3';

  try {
    yeomanConfig.app = require('./bower.json').appPath || yeomanConfig.app;
  } catch (e) {}

  grunt.file.defaultEncoding = 'utf8';

  grunt.loadNpmTasks('grunt-browserify');

  grunt.initConfig({
    yeoman: yeomanConfig,
    watch: {
      compass: {
        files: ['<%= yeoman.app %>/styles/**/*.{scss,sass}'],
        tasks: ['compass']
      },
      livereload: {
        options: {
          livereload: true
        },
        files: [
          '<%= yeoman.app %>/**/*.html',
          '!<%= yeoman.app %>/index.html',
          '.tmp/index.html',
          '{.tmp,<%= yeoman.app %>}/styles/**/*.css',
          '{.tmp,<%= yeoman.app %>}/client/**/*.js',
          '{.tmp,<%= yeoman.app %>}/private-components/**/*.js',
          '<%= yeoman.app %>/styles/img/**/*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      },
      html: {
        files: ['<%= yeoman.app %>/index.html'],
        tasks: ['processhtml:server']
      },
      browserify: {
        files: ['app/react-components/**/*.jsx'],
        tasks: ['browserify:development']
      }
    },
    browserify: {
      development: {
          src: [
              "./app/react-components/src/**/*.jsx"
          ],
          dest: './app/react-components/dist/common-components.js',
          options: {
              browserifyOptions: { debug: true },
              transform: [["babelify", { "presets": ["es2015", "react"] }]],
              watch: true,
              keepAlive: true
          }
      },
      production: {
          src: [
              "./app/react-components/src/**/*.jsx"
          ],
          dest: './app/react-components/dist/common-components.js',
          options: {
              browserifyOptions: { debug: false },
              transform: [["babelify", { "presets": ["es2015", "react"] }]]
          }
      }
    },
    connect: {
      options: {
        port: 9000,
        hostname: '0.0.0.0',
        livereload: true
      },
      livereload: {
        options: {
          middleware: function(connect) {
            return [
              serveStatic('.tmp'),
              serveStatic(yeomanConfig.app),
              serveStatic('test'),
              serveStatic('api'),
              useMock
            ];
          }
        }
      },
      test: {
        options: {
          middleware: function(connect) {
            return [
              serveStatic('.tmp'),
              serveStatic('test')
            ];
          },
          port: 9002
        }
      },
      dist: {
        options: {
          middleware: function(connect) {
            return [
              serveStatic(yeomanConfig.dist),
              serveStatic('api'),
              useMock
            ];
          }
        }
      },
    },
    open: { // use shell:chrome when you need security disabled in Chrome
      server: {
        url: 'http://localhost:<%= connect.options.port %>'
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '<%= yeoman.app %>/styles/main*.css',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      maintenance: {
        src: [
          'maintenance/**/*'
        ]
      },
      server: '.tmp'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: 'checkstyle'
      },
      all: [
        //'Gruntfile.js',
        '<%= yeoman.app %>/client/**/*.js',
        '!app/client/**/*.spec.js',
        '!app/client/config/nxg-config.mock.processed.js',
        '!app/scripts/translations.js',
        '!app/client/services/base64.service.js',
        '!app/client/shared/directives/nxg-chart/nxg-chart.directive.js',
        '!app/client/shared/directives/tooltip.directive.js',
        'e2e/**/*.js',
        'api_tests/**/*.js'
      ]
    },
    jscs: {
      options: {
        config: '.jscsrc'
      },
      all: [
        //'Gruntfile.js',
        '<%= yeoman.app %>/client/**/*.js',
        '!app/client/config/nxg-config.mock.processed.js',
        '!app/scripts/translations.js',
        '!app/client/services/base64.service.js',
        '!app/client/shared/directives/nxg-chart/nxg-chart.directive.js',
        '!app/client/shared/directives/tooltip.directive.js',
        // TODO JSCS could be used for all test files depending on what rules we decide on
        'e2e/**/*.js',
        'api_tests/**/*.js'
      ]
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },
    compass: {
      options: {
        sassDir: '<%= yeoman.app %>/styles',
        cssDir: '.tmp/styles',
        imagesDir: '<%= yeoman.app %>/img',
        javascriptsDir: '<%= yeoman.app %>/client',
        fontsDir: '<%= yeoman.app %>/styles/fonts',
        importPath: '<%= yeoman.app %>/components',
        relativeAssets: true
      },
      dist: {
        options: {
          sassDir: '<%= yeoman.app %>/styles',
          cssDir: '<%= yeoman.app %>/styles',
          force: true
        }
      },
      maintenance: {
        options: {
          sassDir: '<%= yeoman.app %>/styles',
          cssDir: '<%= yeoman.app %>/styles',
          force: true
        }
      },
      server: {
        options: {
          debugInfo: true
        }
      }
    },
    // Run "bless" to make sure that there aren't too many rules in our css for ie9.
    // TODO: Update the package.json to use bless 0.3.0 once it is released (0.2.0 does not have a "failOnLimit" option)
    bless: {
      css: {
        options: {
          logCount: true,
          // overwrite original file
          force: true,
          imports: false
        },
        files: {
          '<%= yeoman.app %>/styles/main.css': '<%= yeoman.app %>/styles/main.css'
        }
      }
    },
    // grunt-usemin has a bug regarding build:remove blocks, so
    // processhtml is just used to remove that block. Changing
    // the commentMarker to tell them apart
    processhtml: {
      options: {
        commentMarker: 'processhtml',
        recursive: true // for files included via processhtml (aka our svg icons)
      },
      dist: {
        files: {
          '<%= yeoman.dist %>/index.html': ['<%= yeoman.dist %>/index.html']
        }
      },
      server: { // to pull svg in without overriding index file
        files: {
          '.tmp/index.html': ['<%= yeoman.app %>/index.html']
        }
      },
      svgDist: { // SVG for build
        files: {
          '<%= yeoman.dist %>/index.html': ['<%= yeoman.dist %>/index.html']
        }
      }
    },
    useminPrepare: {
      html: ['<%= yeoman.app %>/index.html', '<%= yeoman.app %>/tc.html'],
      options: {
        dest: '<%= yeoman.dist %>'
      }
    },
    usemin: {
      html: ['<%= yeoman.dist %>/**/*.html', '!<%= yeoman.dist %>/components/**/*.html'],
      css: ['<%= yeoman.dist %>/styles/**/*.css'],
      js: ['<%= yeoman.dist %>/scripts/**/*.js'],
      options: {
        assetsDirs: ['<%= yeoman.dist %>'],
        patterns: {
          js: [
            [/(img\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the JS to reference our revved images']
          ],
          css: [
            [/(img\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the CSS to reference our revved images']
          ]
        }
      }
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '**/*.{png,jpg,jpeg}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },
    cssmin: {
      dist: {
        options: {
          keepSpecialComments: 0
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: '404.html',
          dest: '<%= yeoman.dist %>'
        }]
      }
    },
    htmlmin: {
      dist: {
        options: {
          collapseBooleanAttributes: true,
          collapseWhitespace: false, // Breaks translations if we remove whitespace
          removeAttributeQuotes: true,
          removeComments: true, // Only if you don't use comment directives!
          removeEmptyAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: [
            '*.html',
            'client/**/*.html',
            'client/shared/directives/**/*.html',
            // Getting an error when uglifying this file. Should be looked into!
            '!client/shared/directives/nxg-stock-numbers-input/nxg-stock-numbers-input.html'
          ],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/scripts/**/*.js',
            '<%= yeoman.dist %>/styles/**/*.css',
            '<%= yeoman.dist %>/img/**/*.{png,jpg,jpeg,gif,webp}',
            '<%= yeoman.dist %>/styles/fonts/*'
          ]
        }
      }
    },
    copy: {
      notification: {
        files: [{
          expand: true,
          dot: true,
          flatten: true,
          dest: '<%= yeoman.dist %>/img/email',
          src: '<%= yeoman.app %>/img/email/*'
        }]
      },
      maintenance: {
        files: [{
          expand: true,
          dot: true,
          flatten: true,
          dest: 'maintenance/img/',
          src: '<%= yeoman.app %>/img/*'
        }, {
          expand: true,
          dot: true,
          flatten: true,
          dest: 'maintenance/img/icons/',
          src: '<%= yeoman.app %>/img/icons/*'
        }, {
          expand: true,
          dot: true,
          flatten: true,
          dest: 'maintenance/img/browsers/',
          src: '<%= yeoman.app %>/img/browsers/*'
        }, {
          expand: true,
          dot: true,
          flatten: true,
          dest: 'maintenance/fonts/',
          src: '<%= yeoman.app %>/fonts/**/*'
        }, {
          expand: true,
          dot: true,
          flatten: true,
          dest: 'maintenance',
          src: '<%= yeoman.app %>/favicon.ico'
        }, {
          expand: true,
          dot: true,
          flatten: true,
          dest: 'maintenance',
          src: '<%= yeoman.app %>/maintenance.html'
        }, {
          expand: true,
          dot: true,
          flatten: true,
          dest: 'maintenance/styles/',
          src: '<%= yeoman.app %>/styles/main*.css'
        }]
      },
      dist: {
        files: [{
          expand: true,
          dot: true,
          flatten: true,
          dest: '<%= yeoman.dist %>/',
          src: '<%= yeoman.app %>/version.txt'
        }, {
          expand: true,
          dot: true,
          flatten: true,
          dest: '<%= yeoman.dist %>/',
          src: '<%= yeoman.app %>/favicon.ico'
        }, {
          expand: true,
          dot: true,
          flatten: true,
          dest: '<%= yeoman.dist %>/img/',
          src: '<%= yeoman.app %>/img/*'
        }, {
          expand: true,
          dot: true,
          flatten: true,
          dest: '<%= yeoman.dist %>/img/icons/',
          src: '<%= yeoman.app %>/img/icons/*'
        }, {
          expand: true,
          dot: true,
          flatten: true,
          dest: '<%= yeoman.dist %>/img/browsers/',
          src: '<%= yeoman.app %>/img/browsers/*'
        }, {
          expand: true,
          dot: true,
          flatten: true,
          dest: '<%= yeoman.dist %>/fonts/',
          src: '<%= yeoman.app %>/fonts/**/*'
        }, {
          expand: true,
          dot: true,
          flatten: true,
          // cache bust language files using the GIT SHA - This is overly aggressive since the translations may not
          // have changed between revisions but typically they will change between releases anyways so this
          // approach should be good enough
          dest: '<%= yeoman.dist %>/languages-<%= gitinfo.local.branch.current.shortSHA %>/',
          src: '<%= yeoman.app %>/languages/*'
        }, {
          expand: true,
          dot: true,
          flatten: true,
          dest: '<%= yeoman.dist %>/documents/',
          src: '<%= yeoman.app %>/documents/*'
        }, {
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>/',
          src: [
            '**/*.html',
            '!components/**/*.html'
          ]
        }]
      }
    },
    env: {
      dev: {
        ENV: grunt.option('target') || defaultTarget,
        VERSION: grunt.option('buildVersion') || defaultVersion,
        GIT_SHA: '<%= gitinfo.local.branch.current.shortSHA %>'
      }
    },
    preprocess: {
      index: {
        files: {
          '<%= yeoman.dist %>/index.html': '<%= yeoman.dist %>/index.html',
          '<%= yeoman.dist %>/version.txt': '<%= yeoman.dist %>/version.txt'
        }
      },
      dist: {
        src: ['.tmp/concat/scripts/scripts.js'],
        options: {
          inline: true,
          context: {
            DEBUG: false
          }
        }
      },
      dev: {
        src: '<%= yeoman.app %>/client/config/nxg-config.mock.js',
        dest: '<%= yeoman.app %>/client/config/nxg-config.mock.processed.js',
        options: {
          context: {
            apiBase: grunt.option('apiBase') || '',
            apiDomain: grunt.option('apiDomain') || '',
            isDemo: grunt.option('noTrack') || false
          }
        }
      },
      debug: {
        src: '<%= yeoman.app %>/client/shared/directives/navbar/nxg-debug-title.directive.js',
        dest: '<%= yeoman.app %>/client/shared/directives/navbar/nxg-debug-title.processed.js'
      }
    },
    autoprefixer: {
      options: {
        browsers: ['ie >= 9', 'firefox >= 3.5', 'chrome >= 25', 'safari >= 5.1']
      },
      'no_dest': {
        src: '<%= yeoman.dist %>/styles/*.css'
      }
    },
    nggettext_extract: {
      pot: {
        files: {
          'po/extracted.pot': [
            '<%= yeoman.app %>/client/**/*.html',
            '<%= yeoman.app %>/client/**/*.js',
            '<%= yeoman.app %>/*.html'
          ]
        }
      }
    },
    nggettext_compile: {
      all: {
        options: {
          // format: 'json' - Use standard js angular module and not json because asynchronous loading will not
          // work since currently the window has to be reloaded on any language change due to binding issues
          // index.html loads the correct language file as needed before bootstrapping the app
        },
        files: [{
          expand: true,
          dot: true,
          cwd: 'po',
          dest: 'app/languages',
          src: ['*.po'],
          ext: '.js'
        }]
      }
    },
    gettext_update_po: {
      src: ['po/*.po']
    },
    po_validate: {
      src: ['po/*.po']
    },
    shell: {
      options: {
        failOnError: true,
        stderr: true,
        stdout: true
      },
      chrome: {
        command: 'open -n -a "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --args' +
          ' --user-data-dir="/Users/$USER/Library/Application Support/Google/Chrome/dealer-portal-dev"' +
          ' --disable-web-security --homepage http://localhost:<%= connect.options.port %>'
      },
      ie: {
        command: 'start iexplore.exe "http://localhost:<%= connect.options.port %>'
      },
      webdriverUpdate: {
        command: 'node_modules/protractor/bin/webdriver-manager update'
      },
      msgmerge: {
        command: function(filename) {
          // use -N for --no-fuzzy-matching and echo how many strings are untranslated (use 'tail' to skip opening
          // comment lines which typically have an irrelevant msgid)
          return 'msgmerge -U -N -v ' + filename + ' po/extracted.pot -C ../mobile-apps/' + filename + ' && ' +
            'msgattrib --untranslated ' + filename + ' | tail -n +10 | echo $(grep "msgid" -c) untranslated strings';
        }
      }
    },
    protractor: { // a specific suite can be run with grunt protractor:run --suite=suite_name
      options: {
        keepAlive: true,
        configFile: 'e2e/conf.js',
        noColor: false
      },
      run: {}
    },
    githooks: {
      all: {
        // Will run the jshint tasks at every commit
        'pre-commit': 'jshint jscs karma'
      }
    }
  });

  grunt.registerTask('dev-setup', [
    'gitinfo',
    'env:dev',
    'clean:server',
    'processhtml:server',
    'compass:server',
    'preprocess:dev',
    'preprocess:debug',
    'nggettext_compile',
    'browserify:development'
  ]);

  grunt.registerTask('server', [
    'dev-setup',
    'connect:livereload',
    'shell:chrome',
    'watch'
  ]);

  grunt.registerTask('server-np', [
    'dev-setup',
    'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('server-ie', [
    'dev-setup',
    'connect:livereload',
    'shell:ie',
    'watch'
  ]);
  grunt.registerTask('server-dist', [
    'build',
    'shell:chrome',
    'connect:dist:keepalive'
  ]);

  grunt.registerTask('test:unit', [
    'dev-setup',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('test:e2e', [
    'dev-setup',
    'shell:webdriverUpdate',
    'connect:livereload',
    'protractor'
  ]);

  grunt.registerTask('build-maintenance', [
    'gitinfo',
    'env',
    'clean:maintenance',
    'compass:maintenance',
    'copy:maintenance'
  ]);

  grunt.registerTask('build', [
    'browserify:production',
    'gitinfo',
    'env',
    'clean:dist',
    'nggettext_compile',
    'useminPrepare',
    'compass:dist',
    'bless',
    'concat',
    'preprocess:dist',
    'copy:dist',
    'preprocess:index',
    'cdnify',
    'ngAnnotate',
    'uglify',
    'cssmin',
    'autoprefixer',
    'rev',
    'processhtml:dist',
    'processhtml:svgDist',
    'imagemin',
    'usemin',
    'htmlmin',
    'copy:notification'
  ]);

  // Continuous Integration build -- call with --target={test|production|training|demo|rubydal} as defined in
  // app/scripts/config/nxgConfig.js
  grunt.registerTask('ci-build', 'Continuous Integration Build', function() {
    grunt.log.writeln('Running Continuous Integration Build --target=' + grunt.option('target'));
    grunt.task.run('test:unit');
    grunt.task.run('build');
    grunt.task.run('test:e2e:users');
    // run this last so that grunt returns an error code but doesn't abort before running the previous tasks
    grunt.task.run('jshint');
    grunt.task.run('jscs');
  });

  grunt.registerMultiTask('gettext_update_po', 'update PO files from the POT file', function() {

    this.filesSrc.forEach(function(filename) {

      console.log(filename);
      grunt.task.run('shell:msgmerge:' + filename);
    });
  });

  // apply validation/formatting/other post-processing as needed
  // TODO: Grunt translation tasks should be cleaned up slightly with MNGW-5568
  grunt.registerMultiTask('po_validate', 'update PO files from the POT file', function() {

    // Replace ’ with ' for apostrophe symbol - MNGW-5529
    this.filesSrc.forEach(function(filename) {

      var contents;
      var replace = /’/g;
      var replaceWith = '\'';

      contents = grunt.file.read(filename);

      if (replace.test(contents)) {

        console.log('Replacing "' + replace.source + '" with "' + replaceWith + '" in ' + filename);
        contents = contents.replace(replace, replaceWith);
        grunt.file.write(filename, contents);
      }
    });
  });

  grunt.registerTask('translate', ['nggettext_extract', 'gettext_update_po', 'po_validate', 'nggettext_compile']);

  grunt.registerTask('default', ['server']);
};
