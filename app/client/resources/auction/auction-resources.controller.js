(function() {
    function AuctionDocumentsCtrl($scope, gettextCatalog, User, segmentio, metric, kissMetricInfo) {

        // passing things to react aww yeah
        $scope.reactProps = {
            isUnitedStates: User.isUnitedStates(),
            language: gettextCatalog.currentLanguage,
            segmentio,
            kissMetricInfo
        }
    }

    angular
        .module('nextgearWebApp')
        .controller('AuctionDocumentsCtrl', AuctionDocumentsCtrl);

    AuctionDocumentsCtrl.$inject = ['$scope', 'gettextCatalog', 'User', 'segmentio', 'metric', 'kissMetricInfo'];
})();
