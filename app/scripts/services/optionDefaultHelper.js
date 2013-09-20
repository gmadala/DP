'use strict';

/**
 * Provides an object that can be used to check sets of options (e.g. for dropdowns), and
 * automatically apply the first or only option to an associated model property as the default value.
 *
 * This has a super power -- you don't have to care whether the option sets exist yet;
 * they can be loaded asynchronously and will be correctly applied regardless of timing.
 *
 * create - initialize a helper instance with mappings
 * @param {Array} mappings - list of mapping objects in the form:
 * {
 *   scopeSrc - {String} scope expression that yields an option list as array
 *   modelDest - {String} name of property on model object to apply the default value (does not currently support sub-objects)
 *   useFirst - {Boolean} if true, auto-select first option; otherwise only auto-select if there's just 1 option
 * }
 * @return helper instance with applyDefaults method (see below)
 *
 * applyDefaults - set any default values (solitary options) available according to mapping provided in create()
 * @param scope {Scope} scope object that holds the option sets
 * @param model {Object} model object to apply default values to
 */
angular.module('nextgearWebApp')
  .factory('OptionDefaultHelper', function () {
    return {
      create: function (mappings) {
        var unwatchers = [];
        return {
          applyDefaults: function(scope, model) {
            // de-register any existing watches
            unwatchers.forEach(function (unwatch) {
              unwatch();
            });
            unwatchers.length = 0;

            // apply the mappings via new watches
            mappings.forEach(function (mapping) {
              var unwatch = scope.$watch(mapping.scopeSrc, function (options) {
                if (angular.isArray(options) &&
                  options.length > 0 &&
                  (options.length === 1 || mapping.useFirst) &&
                  model[mapping.modelDest] === null) {

                  model[mapping.modelDest] = options[0];
                }
              });

              unwatchers.push(unwatch);
            });
            return this;
          }
        };
      }
    };
  });
