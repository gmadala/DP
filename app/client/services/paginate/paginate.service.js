(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .factory('Paginate', Paginate);

  Paginate.$inject = ['nxgConfig'];

  function Paginate(nxgConfig) {
    var pageIndexStart = 1;

    return {
      PAGE_SIZE_SMALL: 5,
      PAGE_SIZE_MEDIUM: 15,
      PAGE_SIZE_LARGE: 45,

      firstPage: function () {
        return pageIndexStart;
      },
      addPaginator: function (data, totalItems, currentPageNumber, pageSize) {
        return angular.extend(data, {
          $paginator: {
            hitMaximumLimit: function() {
              var offset = 1 - pageIndexStart;
              return (currentPageNumber + offset) * pageSize >= nxgConfig.infiniteScrollingMax;
            },
            hasMore: function () {
              var offset = 1 - pageIndexStart;
              return (currentPageNumber + offset) * pageSize < Math.min(nxgConfig.infiniteScrollingMax, totalItems);
            },
            nextPage: function () {
              return currentPageNumber + 1;
            }
          }
        });
      }
    };

  }
})();
