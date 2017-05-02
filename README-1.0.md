# MyNextGear Web App

### Requirements

- [Git](https://git-scm.com/)
- [Node](https://nodejs.org/)
- [Python](https://www.python.org/downloads/)
- [Ruby](http://rubyinstaller.org/)
- [Yarn](https://yarnpkg.com/en/)

Windows requirement for angular translations: add both of these to your environment path variable

- [GetText](http://gnuwin32.sourceforge.net/downlinks/gettext.php)
- [Windows Resource Kit](https://www.windows-commandline.com/tail-command-for-windows/)

### Production

Dist build (defaults to test)

NOTE: If you have any issues running the script, delete your node_modules folder and try again

```sh
$ yarn run build
```

Build for environment / version:

```sh
Append: -- --mng:buildEnv=envName
Append: -- --mng:buildVersion=versionNumber
```

Examples:

```sh
$ yarn run build -- --mng:buildEnv=training
$ yarn run build -- --mng:buildEnv=demo
$ yarn run build -- --mng:buildEnv=test
$ yarn run build -- --mng:buildEnv=uat --mng:buildVersion=1.0
$ yarn run build -- --mng:buildEnv=production --mng:buildVersion=2.0
```

Maintenance build

```sh
$ yarn run build:maintenance
```

### Development

Build for local environment ([localhost:9000](http://localhost:9000))
(this command will run grunt serve and webpack --watch concurrently)

NOTE: If you have any issues running the script, delete your node_modules folder and try again

```sh
$ yarn start
```

Custom api endpoint (default value shown)

```sh
$ yarn start -- --mng:apiBase=https://test.nextgearcapital.com/MobileService/api
```

Run angular and react unit tests

```sh
$ yarn run test
```

Run angular or react tests individually

```sh
$ yarn run test:angular
$ yarn run test:react
```

### Translations

Run react and angular translation procedures

```sh
$ yarn run translate
```

Run react translation procedure

This will output untranslated strings to "/translations/language_translations.txt"
This will pull in any translated strings from the same file

```sh
$ yarn run translate:react
```

Run angular translation procedure...

This will output untranslated strings to "/translations/language_untranslated.po"
This will insert new translations from "/translations/language_translated.po"

```sh
$ yarn run translate:angular
```
