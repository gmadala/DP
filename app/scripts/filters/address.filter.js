(function() {
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
  angular
    .module('nextgearWebApp')
    .filter('address', address);

  address.$inject = ['$interpolate', 'gettextCatalog'];

  function address($interpolate, gettextCatalog) {

    return function (input, selectedTemplate, showInactive) {
      var templates = {
        oneLine: '{{Line1}} {{Line2 && Line2+\' \'}}/ {{City}} {{State}} {{Zip}}',
        oneLineSelect: '{{Line1}} / {{City}} {{State}}'
      };

      if (input === null || !angular.isDefined(input)) {
        return input;
      }

      if(!selectedTemplate) {
        selectedTemplate = 'oneLine';
      }

      var result;
      try {
        var parsedTemplate = $interpolate(templates[selectedTemplate]);
        // Compile the template in the context of the input object
        result = parsedTemplate(input);
      } catch (e) {
        result = input;
      }

      if(showInactive && !input.IsActive) {
        result = '(' + gettextCatalog.getString('INACTIVE') + ') ' + result;
      }

      return result;
    };

  }
})();
