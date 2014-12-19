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
        '!app/scripts/translations.js'
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
          debugInfo: true,
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
        ENV: grunt.option('target') || 'production',
        GIT_SHA: '<%= gitinfo.local.branch.current.shortSHA %>'
      }
    },
    preprocess: {
      inline : {
        src : [ '.tmp/concat/scripts/scripts.js' ],
        options: {
          inline : true,
          context : {
            DEBUG: false
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
          '<%= yeoman.app %>/scripts/translations.js': ['po/merged/*.po']
        }
      }
    },
    translations_merge: {
      all: {
        files: {
          'po/merged/fr_CA.po': [
            'po/translated/fr_CA2.po',
            'po/translated/fr_CA_translated.po',
            'po/translated/NextGear_Web_French (CA).po',
            'po/translated/untranslated_French (CA).po'
          ],
          'po/merged/es.po': [
            'po/translated/es2.po',
            'po/translated/es_MEX_translated.po',
            'po/translated/es.po',
            'po/translated/NextGear_Web_Spanish (Mex).po',
            'po/translated/untranslated_Spanish (Mex).po'
          ]
        }
      }
    },
    translations_missing: {
      all: {
        options: {
          pot_file: 'po/extracted.pot'
        },
        files: {
          'po/untranslated/fr_CA.po': [
            'po/merged/fr_CA.po'
          ],
          'po/untranslated/es.po': [
            'po/merged/es.po'
          ]
        }
      }
    },
    protractor: {
      options: {
        keepAlive: true,
        configFile: "e2e/protractor.conf.js",
        noColor: false,
        args: {
        }
      },
      run: {
      }
    }
  });

  grunt.renameTask('regarde', 'watch');

  grunt.registerTask('server', [
    'clean:server',
    'processhtml:server',
    'compass:server',
    'livereload-start',
    'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('test', [
    'clean:server',
    'compass',
    'connect:test',
    'karma',
    'connect:livereload',
    'protractor:run'
  ]);

  grunt.registerTask('build', [
    'gitinfo',
    'env',
    'clean:dist',
    'jshint',
    'test',
    'useminPrepare',
    'compass:dist',
    'concat',
    'preprocess',
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

  grunt.registerMultiTask('translations_merge', 'Merge multiple translations files into one', function () {
    var options = this.options();

    this.files.forEach(function (file) {

      var translations = {
        truncated: [],
        values: []
      };
      var dupes = 0;
      var first;

      file.src.forEach(function (filename) {
        var fileContents = grunt.file.read(filename).toString();
        var matches = fileContents.split("\n\n");

        // Set the opener
        if (translations.values.length === 0) {
          first = matches[0];
        }

        grunt.log.writeln('`'+filename+'`', 'Matches:', matches.length);

        matches.slice(1).forEach(function (val) {
          var splitter = (val.indexOf('msgid """') > -1) ? 'msgid """' : 'msgid "';
          var truncated = val.split(splitter)[1];
          truncated = truncated.slice(0, truncated.indexOf('msgstr')); // Removes duplicate translations

          if (translations.truncated.indexOf(truncated) === -1) {
            translations.truncated.push(truncated);
            translations.values.push(val);
          }
          else {
            dupes++;
          }
        });
      });

      translations.values = translations.values.sort(function (a, b) {
        var splitterA = (a.indexOf('msgid """') > -1) ? 'msgid """' : 'msgid "';
        var splitterB = (b.indexOf('msgid """') > -1) ? 'msgid """' : 'msgid "';

        a = a.split(splitterA)[1];
        b = b.split(splitterB)[1];
        return a > b ? 1 : -1;
      });
      translations.values.unshift(first);

      grunt.log.writeln(translations.truncated.length + ' Strings Found');
      grunt.log.writeln(dupes + ' Duplicates Found');

      grunt.file.write(file.dest, translations.values.join("\n\n"));

    }); // END files.forEach()
  });

  grunt.registerMultiTask('translations_missing', 'Generate a file of missing translations', function () {
    var options = this.options();

    var translations = {};
    var translationStrings = {
      matches: [],
      strings: [],
      matchesPlural: [],
      plurals: []
    };
    var untranslatedContents = grunt.file.read(options.pot_file).toString().split("\n\n");
    // We don't need the file definition
    untranslatedContents.shift();

    untranslatedContents.forEach(function (val) {
      var splitter = (val.indexOf('msgid """') > -1) ? 'msgid """' : 'msgid "';
      var truncated = val.split(splitter)[1];
      // If it's a plural, split before the plural definition
      splitter = (truncated.indexOf('msgid_plural') > -1) ? 'msgid_plural' : 'msgstr';

      // Push plurals onto a different array since we handle them differently
      if (splitter == 'msgid_plural') {
        // Truncate to just the string value
        truncated = truncated.slice(0, truncated.indexOf(splitter) - 2);

        translationStrings.matchesPlural.push(val);
        translationStrings.plurals.push(truncated);
        return;
      }

      // Truncate to just the string value
      truncated = truncated.slice(0, truncated.indexOf(splitter) - 2);

      translationStrings.matches.push(val);
      translationStrings.strings.push(truncated);
    });

    grunt.log.writeln(translationStrings.strings.length + ' Strings Found');
    grunt.log.writeln(translationStrings.plurals.length + ' Plurals Found');

    this.files.forEach(function (file) {

      /**
       * Loop through each translated file and see if we're missing translations
       * from the all strings file.
       */
      file.src.forEach(function (filename) {
        var fileContents = grunt.file.read(filename).toString();
        var matches = fileContents.toString().split("\n\n");

        if (!translations.hasOwnProperty(filename)) {
          translations[filename] = {
            truncated: [],
            values: []
          };
        }

        grunt.log.writeln('`'+filename+'`', matches.length - 1, 'Strings');

        translationStrings.strings.forEach(function (string, key) {
          if (fileContents.indexOf('msgid "' + string + '"') === -1) {
            translations[filename].values.push(translationStrings.matches[key]);
          }
        });

        // Match each of the plurals by testing for msgid_plural
        translationStrings.plurals.forEach(function (string, key) {
          if (fileContents.indexOf('msgid "' + string + '"' + "\n" + 'msgid_plural') === -1) {
            translations[filename].values.push(translationStrings.matchesPlural[key]);
          }
        });

        grunt.log.writeln(translations[filename].values.length + ' Translations Missing');

        translations[filename].values.unshift(matches[0]);

        grunt.file.write(file.dest, translations[filename].values.join("\n\n"));
      }); // END forEach file
    });

  });

  grunt.registerTask('default', ['build']);
  grunt.registerTask('translate', ['nggettext_extract', 'translations_merge', 'translations_missing', 'nggettext_compile']);
};
