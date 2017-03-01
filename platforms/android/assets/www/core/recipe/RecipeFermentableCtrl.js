app.controller('RecipeFermentableCtrl', function ($scope, Recipe, $stateParams, BrewHelper, $rootScope) {
	



    $scope.round = function(value) {
            return Math.round(value);
        };

        $scope.round1 = function(value) {
            return BrewHelper.round(value,10);
        };

        $scope.round2 = function(value) {
            return BrewHelper.round(value,100);
        };
        
})