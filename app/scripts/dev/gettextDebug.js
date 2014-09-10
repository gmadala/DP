'use strict';

angular.module('nextgearWebApp')
    .run(function(gettextCatalog) {
        gettextCatalog.debug = true;
    });
