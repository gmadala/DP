'use strict';

/**
 * Format an object containing address information into a string based on the given interpolated string.
 * If no interpolation string is given, a default one is used.
 * Note that the ternary operator isn't supported by $interpolate in Angular 1.0 but it is in Angular 1.2
 * so until then ternary can't be used in this filter template string.
 * @param input An object with the following properties: Line1, Line2 (optional), City, State, Zip
 * @param template A string signifying which template to use (default is oneLine address)
 * @return A string of the compiled template against the input object. On failure it returns the input value
 */
angular.module('nextgearWebApp')
  .filter('address', function ($interpolate) {
    return function (input, selectedTemplate) {
      var templates = {
        oneLine: '{{Line1}} {{Line2 && Line2+\' \'}}/ {{City}} {{State}} {{Zip}}',
        twoLine: '{{Line1 + \', \'}}{{Line2 && Line2 + \', \'}}{{City && City + \', \'}}{{State}} {{Zip}}'
      };

      if (input === null || !angular.isDefined(input)) {
        return input;
      }

      if(!selectedTemplate) {
        selectedTemplate = 'oneLine';
      }

      try {
        var parsedTemplate = $interpolate(templates[selectedTemplate]);
        // Compile the template in the context of the input object
        return parsedTemplate(input);
      } catch (e) {
        return input;
      }

    };
  });
