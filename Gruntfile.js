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
  grunt.loadNpmTasks('grunt-angular-gettext');

  // configurable paths
  var yeomanConfig = {
      app: 'app',
      dist: 'dist',
      api: 'api'
    },
    useMock = mockApi.mockApi(yeomanConfig.api);

  var defaultTarget = 'test';
  var defaultProtractorSuite = 'login'; // TODO may want to change to smoke or dealer later

  // element format:
  // 0 = 'mock' if the user will be available in the mockApi (mockApi currently only care about 'auction':'test')
  // 1 = suite name to be run (ex: payments, auction, login)
  // 2 = username with the correct privilege to the suite
  // 3 = password for the username
  var counter = 0;
  var effectiveUsers = [];
  var users = [
    ['non-mock', 'payments', '53190md', 'password@1'],
    ['non-mock', 'receipts', '53190md', 'password@1'],
    ['non-mock', 'auction', '10264', 'password@1'],
    ['mock', 'payments', 'dealer', 'test'],
    ['mock', 'receipts', 'dealer', 'test'],
    ['mock', 'auction', 'auction', 'test']
  ];

  try {
    yeomanConfig.app = require('./bower.json').appPath || yeomanConfig.app;
  } catch (e) {
  }

  grunt.initConfig({
    yeoman: yeomanConfig,
    watch: {
      compass: {
        files: ['<%= yeoman.app %>/styles/**/*.{scss,sass}'],
        tasks: ['compass']
      },
      livereload: {
        files: [
          '<%= yeoman.app %>/**/*.html',
          '!<%= yeoman.app %>/index.html',
          '.tmp/index.html',
          '{.tmp,<%= yeoman.app %>}/styles/**/*.css',
          '{.tmp,<%= yeoman.app %>}/scripts/**/*.js',
          '{.tmp,<%= yeoman.app %>}/private-components/**/*.js',
          '<%= yeoman.app %>/styles/img/**/*.{png,jpg,jpeg,gif,webp,svg}'
        ],
        tasks: ['livereload']
      },
      html: {
        files: ['{.tmp,<%= yeoman.app %>}/index.html'],
        tasks: ['processhtml:server']
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
      },
      dist: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, yeomanConfig.dist)
            ];
          }
        }
      }
    },
    open: { // use shell:chrome when you need security disabled in Chrome
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
              '<%= yeoman.app %>/styles/main.css',
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
        //'Gruntfile.js',
        '<%= yeoman.app %>/scripts/**/*.js',
        '!app/scripts/services/base64.js',
        '!app/scripts/directives/nxgChart/nxgChart.js',
        '!app/scripts/directives/tooltip.js',
        '!app/scripts/translations.js',
        'e2e/**/*.js'
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
        javascriptsDir: '<%= yeoman.app %>/scripts',
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
      server: {
        options: {
          debugInfo: true
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
      html: '<%= yeoman.app %>/index.html',
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
          js: [[/(img\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the JS to reference our revved images']],
          css: [[/(img\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the CSS to reference our revved images']]
        }
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
        options: {
          keepSpecialComments: 0
        },
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.dist %>',
            src: '404.html',
            dest: '<%= yeoman.dist %>'
          }
        ]
      }
    },
    htmlmin: {
      dist: {
        options: {
          collapseBooleanAttributes:      true,
          collapseWhitespace:             false, // Breaks translations if we remove whitespace
          removeAttributeQuotes:          true,
          removeComments:                 true, // Only if you don't use comment directives!
          removeEmptyAttributes:          true,
          removeScriptTypeAttributes:     true,
          removeStyleLinkTypeAttributes:  true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: [
            '*.html',
            'views/**/*.html',
            'scripts/directives/**/*.html',
            // Getting an error when uglifying this file. Should be looked into!
            '!scripts/directives/nxgStockNumbersInput/nxgStockNumbersInput.html'
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
    ngmin: {
      dist: {
        files: [
          {
            expand: true,
            cwd: '.tmp/concat/scripts',
            src: '*.js',
            dest: '.tmp/concat/scripts'
          }
        ]
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
      dist: {
        files: [
          { expand: true, dot: true, flatten: true, dest: '<%= yeoman.dist %>/', src: '<%= yeoman.app %>/version.txt' },
          { expand: true, dot: true, flatten: true, dest: '<%= yeoman.dist %>/', src: '<%= yeoman.app %>/favicon.ico' },
          { expand: true, dot: true, flatten: true, dest: '<%= yeoman.dist %>/img/', src: '<%= yeoman.app %>/img/*' },
          { expand: true, dot: true, flatten: true, dest: '<%= yeoman.dist %>/img/icons/', src: '<%= yeoman.app %>/img/icons/*' },
          { expand: true, dot: true, flatten: true, dest: '<%= yeoman.dist %>/img/browsers/', src: '<%= yeoman.app %>/img/browsers/*' },
          { expand: true, dot: true, flatten: true, dest: '<%= yeoman.dist %>/fonts/', src: '<%= yeoman.app %>/fonts/**/*' },
          {
            expand: true,
            dot: true,
            flatten: true,
            dest: '<%= yeoman.dist %>/documents/',
            src: '<%= yeoman.app %>/documents/*'
          },
          {
            expand: true,
            dot: true,
            cwd: '<%= yeoman.app %>',
            dest: '<%= yeoman.dist %>/',
            src: [
              '**/*.html',
              '!components/**/*.html'
            ]
          }
        ]
      }
    },
    env: {
      dev: {
        ENV: grunt.option('target') || defaultTarget,
        GIT_SHA: '<%= gitinfo.local.branch.current.shortSHA %>'
      }
    },
    preprocess: {
      dist : {
        src : [ '.tmp/concat/scripts/scripts.js' ],
        options: {
          inline : true,
          context : {
            DEBUG: false
          }
        }
      },
      dev: {
        src: '<%= yeoman.app %>/scripts/config/nxgConfig.mock.js',
        dest: '<%= yeoman.app %>/scripts/config/nxgConfig.mock.processed.js',
        options: {
          context: {
            apiBase: grunt.option('apiBase') || '',
            apiDomain: grunt.option('apiDomain') || '',
            isDemo: grunt.option('noTrack') || false
          }
        }
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
            '<%= yeoman.app %>/scripts/**/*.html',
            '<%= yeoman.app %>/scripts/**/*.js',
            '<%= yeoman.app %>/views/**/*.html',
            '<%= yeoman.app %>/*.html'
          ]
        }
      }
    },
    nggettext_compile: {
      all: {
        files: {
          '<%= yeoman.app %>/scripts/translations.js': ['po/*.po']
        }
      }
    },
    gettext_update_po: {
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
        ' --disable-extensions -–allow-file-access-from-files --incognito --disable-web-security' +
        ' --homepage http://localhost:<%= connect.options.port %>'
      },
      webdriverUpdate: {
        command: ' ./node_modules/protractor/bin/webdriver-manager update'
      },
      msgmerge: {
        command: function (filename) {
          // use -N for --no-fuzzy-matching and echo how many strings are untranslated (subtract 1 for the PO header)
          return 'msgmerge -U -N -v ' + filename + ' po/extracted.pot -C ../dealer-portal/' + filename + ' && ' +
            'msgattrib --untranslated ' + filename + ' | echo $(($(grep "msgid" -c) - 1)) untranslated strings';
        }
      }
    },
    protractor: { // a specific suite can be run with grunt protractor:run --suite=suite_name
      options: {
        keepAlive: true,
        configFile: 'e2e/protractor.conf.js',
        noColor: false,
        args: { // the args here are for when this task is run directly from the command line with --options
          suite: grunt.option('suite') || defaultProtractorSuite, // change to smoke or dealer later
          params: {
            user: grunt.option('params.user'),
            password: grunt.option('params.password'),
            suite: grunt.option('suite') || defaultProtractorSuite,
            env: (grunt.option('apiBase') || '') ? 'dev' : 'non-dev'
          }
        }
      },
      run: {
      }
    },
    githooks: {
      all: {
        // Will run the jshint tasks at every commit
        'pre-commit': 'jshint'
      }
    }
  });

  grunt.renameTask('regarde', 'watch');

  grunt.registerTask('dev-setup', [
    'clean:server',
    'processhtml:server',
    'compass:server',
    'preprocess:dev'
  ]);

  grunt.registerTask('server', [
    'dev-setup',
    'livereload-start',
    'connect:livereload',
    'shell:chrome',
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
    'protractor:run'
  ]);

  grunt.registerTask('test:e2e:users', 'Runs e2e tests with multiple logins', function () {
    // a target will be specified when doing a build to 'dist' so server those files for that case.
    var useDist = grunt.option('target');
    var apiBase = grunt.option('apiBase');
    grunt.log.writeln('Running test:e2e:users with target "' + (useDist || 'dev') + '" build.');
    grunt.task.run('dev-setup', 'shell:webdriverUpdate', 'connect:' + (useDist ? 'dist' : 'livereload'));
    // find out which users configuration can be run based on the target of this grunt task.
    for (var j = 0; j < users.length; j++) {
      var user = users[j];
      if ((apiBase || '') === '' && (useDist || '') === '') {
        if (user[0] === 'mock') {
          effectiveUsers.push(user);
        }
      } else {
        if (user[0] !== 'mock') {
          effectiveUsers.push(user);
        }
      }
    }
    // prepare the protractor configuration and then run protractor
    for (var i = 0; i < effectiveUsers.length; i++) {
      grunt.task.run('prepare-protractor');
      grunt.task.run('protractor:run');
    }
  });

  grunt.registerTask('prepare-protractor', 'Build config and run protractor.', function () {
    var effectiveUser = effectiveUsers[counter];
    var target = grunt.option('target');
    var apiBase = grunt.option('apiBase');
    // create param object needed to run protractor
    var params = {};
    params.user = effectiveUser[2];
    params.password = effectiveUser[3];
    params.suite = effectiveUser[1];
    if ((apiBase || '') === '' && (target || '') === '') {
      // this is the values set inside the mock api
      params.validVin = '1234567';
      params.invalidVin = '123456';
    }
    // set the configuration
    grunt.config(['protractor', 'run'], {
      options: {
        args: {
          suite: effectiveUser[1],
          params: params
        }
      }
    });
    counter++;
  });

  grunt.registerTask('build', [
    'gitinfo',
    'env',
    'clean:dist',
    'useminPrepare',
    'compass:dist',
    'concat',
    'preprocess:dist',
    'copy',
    'cdnify',
    'ngmin',
    'uglify',
    'cssmin',
    'autoprefixer',
    'rev',
    'processhtml:dist',
    'processhtml:svgDist',
    'imagemin',
    'usemin',
    'htmlmin'
  ]);

  // Continuous Integration build -- call with --target={test|production|training|demo|rubydal} as defined in
  // app/scripts/config/nxgConfig.js
  grunt.registerTask('ci-build', 'Continuous Integration Build', function () {
    if (!grunt.option('target')) {
      grunt.log.warn('No Continuous Integration build --target was specified, defaulting to: ' + defaultTarget);
      grunt.option('target', defaultTarget);
    }
    // removing the target from option to test out mockApi
    grunt.option('target', undefined);

    grunt.log.writeln('Running Continuous Integration Build --target=' + grunt.option('target'));
    grunt.task.run('test:unit');
    grunt.task.run('build');
    grunt.task.run('test:e2e:users');
    // run this last so that grunt returns an error code but doesn't abort before running the previous tasks
    grunt.task.run('jshint');
  });

  grunt.registerMultiTask('gettext_update_po', 'update PO files from the POT file', function () {

    this.filesSrc.forEach(function (filename) {

      console.log(filename);
      grunt.task.run('shell:msgmerge:' + filename);
    });
  });

  grunt.registerTask('translate', ['nggettext_extract', 'gettext_update_po', 'nggettext_compile']);

  grunt.registerTask('default', ['server']);
};
