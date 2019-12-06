function getUtilization(name,list){var utilization=1;angular.forEach(list,function(it){if(name===it.name)utilization=it.utilization});return utilization}
app.controller('RecipeLupuloCtrl', function ($scope, Recipe, $stateParams, BrewHelper, $rootScope) {

	  $scope.hopGramsPerLiter = function(hop,batchSize) {
            return hop.AMOUNT*1000/batchSize;
        };

        $scope.hopPercentage = function(hop,totalHop) {
            return hop.AMOUNT/totalHop*100;
        };

  $scope.hopIBU = function(hop) {
            var U = BrewHelper.calculateU($scope.recipe.OG_exclude,hop.TIME);
            var baseIBU = BrewHelper.toOz(hop.AMOUNT)*hop.ALPHA*U*(7489/100)/BrewHelper.toGal($scope.recipe.BATCH_SIZE);
            //add or remove by utilization (ej: mash use 20%)
            return baseIBU * getUtilization(hop.USE,$scope.hopUses) * getUtilization(hop.FORM,$scope.hopForms);
        };

}) 