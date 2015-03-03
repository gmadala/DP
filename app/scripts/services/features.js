'use strict';

/**
 * @ngdoc service
 * @name nextgearWebApp.features
 * @description
 * # features
 * Provides a way to turn features on or off. The features can be for development purposes or for business purposes
 * (release or business feature toggles)
 */
angular.module('nextgearWebApp')
  .factory('features', function ($location) {

    // release features are features that need to be shown or hidden on a temporary basis as part of the development
    // workflow
    var service = {
      kbb: {
        enabled: false
      },
      loadFromQueryString: function () {
        var search = $location.search();

        if (search.features) {

          var regex = /\w+/g;
          var matches = search.features.match(regex);

          matches.forEach(function (value) {
            var feature = service[value];
            if (angular.isDefined(feature)) {
              feature.enabled = true;
            }
          });
        }
      }
    };
    service.loadFromQueryString();

    // Business features are features that need to be enabled or disabled based on rules such as which user is logged in.
    // Business features can be handled with this service but will need a separate configuration object, likely
    // coming from the API

    // features can be enabled using the query string: ?features=kbb,feature1,feature2

    return service;
  });
