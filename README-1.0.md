# MyNextGear Web App

### Requirements

- [Git](https://git-scm.com/)
- [Node](https://nodejs.org/)
- [Python](https://www.python.org/downloads/)
- [Ruby](http://rubyinstaller.org/)

Windows requirement for angular translations: add both of these to your environment path variable

- [GetText](http://gnuwin32.sourceforge.net/downlinks/gettext.php)
- [Windows Resource Kit](https://www.windows-commandline.com/tail-command-for-windows/)

### Production

Dist build (defaults to test)

```sh
$ npm run build
```

Build for environment / version:

```sh
Append: -- --mng:buildEnv=envName
Append: -- --mng:buildVersion=versionNumber
```

Examples:

```sh
$ npm run build -- --mng:buildEnv=training
$ npm run build -- --mng:buildEnv=demo
$ npm run build -- --mng:buildEnv=test
$ npm run build -- --mng:buildEnv=uat --mng:buildVersion=1.0
$ npm run build -- --mng:buildEnv=production --mng:buildVersion=2.0
```

Maintenance build

```sh
$ npm run build:maintenance
```

### Development

Build for local environment ([localhost:9000](http://localhost:9000))
(this command will run grunt serve and webpack --watch concurrently)

```sh
$ npm start
```

Custom api endpoint (default value shown)

```sh
$ npm start -- --mng:apiBase=https://test.nextgearcapital.com/MobileService/api
```

Run angular and react unit tests

```sh
$ npm test
```

Run angular or react tests individually

```sh
$ npm run test:angular
$ npm run test:react
```

### Translations

Run react and angular translation procedures

```sh
$ npm run translate
```

Run react translation procedure

This will output untranslated strings to "/translations/language_translations.txt"
This will pull in any translated strings from the same file

```sh
$ npm run translate:react
```

Run angular translation procedure...

This will output untranslated strings to "/translations/language_untranslated.po"
This will insert new translations from "/translations/language_translated.po"

```sh
$ npm run translate:angular
```
