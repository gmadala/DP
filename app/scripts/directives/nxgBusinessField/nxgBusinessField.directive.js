(function() {
  'use strict';

/**
 * This is a hybrid input combining search field + selected business field.
 * Text entered here sets the initial search criteria to be used in the
 * business search modal. A business can only be selected from that modal
 * (doing so resets the search text to the name of the selected business as
 * user feedback). Any subsequent text changes in the field clear the selected
 * business.
 *
 * This supports the following attributes:
 * @param nxg-business-field="sellers|buyers" - required, type of business to match against
 * @param selected-business="expr" - selected business will be bound to this scope location
 * @param name="any" - if present, publish an ngModelController to the parent form controller under this name
 *  this controller's values will reflect the search field only, but validity will follow ng-required as below
 * @param ng-disabled="expr" - will disable both the input and the search button
 * @param ng-required="expr" - condition under which to validate that a business is selected ($error key is nxgRequires)
 */
angular
  .module('nextgearWebApp')
  .directive('nxgBusinessField', nxgBusinessField);

  nxgBusinessField.$inject = [];

  function nxgBusinessField() {

    return {
      restrict: 'A',
      templateUrl: 'scripts/directives/nxgBusinessField/nxgBusinessField.html',
      replace: true,
      scope: {
        inputId: '@id',
        mode: '@nxgBusinessField',
        disabled: '=ngDisabled',
        selection: '=selectedBusiness',
        isRequired: '&ngRequired',
        form: '=',
        validity: '='
      },
      controller: 'BusinessFieldCtrl',
      compile: function(element, attrs) {
        // apply original name onto the new input so it will publish ngModelController to its parent form controller
        element.find('input').attr('name', attrs.name);
        // remove some duplicate & unneeded attributes on the root element
        element.removeAttr('id name ng-disabled');
      }
    };
  }

})();
