 app.controller('RecipeLevaduraCtrl', function ($scope, Recipe, $stateParams, BrewHelper, $rootScope, BrewCalc) {
 	$scope.yeastNeed = BrewCalc.yeastNeed;
        $scope.totalYeast = function() {
            if ( !$scope.recipe || !$scope.recipe.YEASTS ) return 0;
            var total = 0;
            angular.forEach($scope.recipe.YEASTS.YEAST, function(y) {
                total += y.AMOUNT;
            });
            return total;
        };
        $scope.totalYeast = function() {
            if ( !$scope.recipe || !$scope.recipe.YEASTS ) return 0;
            var total = 0;
            angular.forEach($scope.recipe.YEASTS.YEAST, function(y) {
                total += y.AMOUNT;
            });
            return total;
        };
})