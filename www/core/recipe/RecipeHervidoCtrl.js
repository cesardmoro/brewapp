app.controller('RecipeHervidoCtrl', function(
    $scope,
    BrewHelper,
    BrewCalc,
    FermentableUses
) {
    $scope.calculateSgBeforeBoil = function(BOIL_TIME, PercentEvap) {
        //Debo calcular la Densidad de los fermentables que van en el MASH
        //par excluir por ejemplo miel o candy que no cuenta como
        //SG Before Boil
        var og = 0;
        angular.forEach($scope.recipe.FERMENTABLES.FERMENTABLE,function(f) {
            if ( FermentableUses.valueOf(f.USE).mash ) {
                og += BrewHelper.toLbs(f.AMOUNT) *
                    BrewHelper.toPpg(f.POTENTIAL) *
                    ($scope.recipe.EFFICIENCY/100) /
                    BrewHelper.toGal($scope.recipe.BATCH_SIZE);
            }
        });
        return BrewHelper.toPotential(
            og * (1-BrewCalc.evapTotal(BOIL_TIME,PercentEvap))
        );
    };
    $scope.calculateSgDuringBoil = function(BOIL_TIME, PercentEvap) {
        var og = 0;
        angular.forEach($scope.recipe.FERMENTABLES.FERMENTABLE,function(f) {
            if ( f.USE === 'Boil' ) {
                og += BrewHelper.toLbs(f.AMOUNT) *
                BrewHelper.toPpg(f.POTENTIAL) *
                ($scope.recipe.EFFICIENCY/100) /
                BrewHelper.toGal($scope.recipe.BATCH_SIZE);
            }
        });
        return BrewHelper.round(
            BrewHelper.toPotential(
                og * (1-BrewCalc.evapTotal(BOIL_TIME,PercentEvap))
            ) - 1,
            1000
        );
    };
});