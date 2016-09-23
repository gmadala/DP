(function() {
    function DocumentsCtrl($scope, api, metric, gettextCatalog, User, kissMetricInfo, segmentio) {

        // passing things to react aww yeah
        $scope.reactProps = {
            isUnitedStates: User.isUnitedStates(),
            language: gettextCatalog.currentLanguage,
            segmentio,
            kissMetricInfo,
            api
        }
    }

    angular
        .module('nextgearWebApp')
        .controller('DocumentsCtrl', DocumentsCtrl);

    DocumentsCtrl.$inject = ['$scope', 'api', 'metric', 'gettextCatalog', 'User', 'kissMetricInfo', 'segmentio'];
})();
