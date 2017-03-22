  var calculator = angular.module("calculator", ["helper"]);

    calculator.controller('calculatorMainCtrl', ['$scope', function ($scope) {
        $scope.values = $scope.values || {};

    }])

    calculator.controller("calculatorMixCtrl", function($scope, BrewCalc) {
            $scope.values = $scope.values || {};
                

                $scope.items = [];
                 $scope.items.push({
                        size: 20,
                        gravity: 1.050
                    });
                $scope.add = function() {
                    $scope.items.push({
                        size: 20,
                        gravity: 1.050
                    });
                };

                $scope.remove = function(item) {
                    util.Arrays.remove($scope.items, item);
                };

                $scope.gravity = 0;

                $scope.$watch('items', function() {
                    $scope.gravity = BrewCalc.calculateMix($scope.items);
                }, true);

    });

    calculator.controller("calculatorAbvCtrl", function($scope, BrewCalc) {
            $scope.values = $scope.values || {};
            

                $scope.alcohol = {
                    OG: $scope.values.OG || 1.050,
                    FG: $scope.values.FG || 1.010,
                    mode: 'ABV'
                };

                function updateABV() {
                    if ( $scope.alcohol.mode == 'ABV' ) {
                        // console.log("calculate ABV");
                        $scope.alcohol.ABV = BrewCalc.calculateABV($scope.alcohol.OG,$scope.alcohol.FG);

                    } else if ( $scope.alcohol.mode == 'OG' ) {
                        // console.log("calculate OG");
                        $scope.alcohol.OG = BrewCalc.calculateOG($scope.alcohol.FG,$scope.alcohol.ABV);
                    } else if ( $scope.alcohol.mode == 'FG' ) {
                        // console.log("calculate FG");
                        $scope.alcohol.FG = BrewCalc.calculateFG($scope.alcohol.OG,$scope.alcohol.ABV);
                    }
                    $scope.alcohol.attenuation = BrewCalc.attenuation($scope.alcohol.OG,$scope.alcohol.FG);
                }

                $scope.$watch("alcohol.OG+alcohol.FG+alcohol.ABV", function() {
                    $scope.alcohol.OGP = BrewCalc.toPlato($scope.alcohol.OG);
                    $scope.alcohol.FGP = BrewCalc.toPlato($scope.alcohol.FG);
                    updateABV();
                });

                $scope.updateOG = function() {
                    $scope.alcohol.OG = BrewCalc.fromPlato($scope.alcohol.OGP);
                };

                $scope.updateFG = function() {
                    $scope.alcohol.FG = BrewCalc.fromPlato($scope.alcohol.FGP);
                };

    });

    calculator.controller("calculatorHydroCtrl", function($scope, BrewCalc) {
            $scope.values = $scope.values || {};
            

                $scope.hydrometer = {
                    gravity: 1.050,
                    reading: 25,
                    calibration: 15
                };

                function updateValue() {
                    $scope.hydrometer.value = BrewCalc.adjustHydrometer(
                        $scope.hydrometer.gravity,
                        $scope.hydrometer.reading,
                        $scope.hydrometer.calibration);
                    $scope.hydrometer.valueP = BrewCalc.toPlato($scope.hydrometer.value);
                };

                $scope.$watch("hydrometer.gravity+hydrometer.reading+hydrometer.calibration", function() {
                    $scope.hydrometer.gravityP = BrewCalc.toPlato($scope.hydrometer.gravity);
                    updateValue();

                });

                $scope.updateGravity = function() {
                    $scope.hydrometer.gravity = BrewCalc.fromPlato($scope.hydrometer.gravityP);
                };

    });

    calculator.controller("calculatorRefractCtrl", function($scope, BrewCalc) {
            $scope.values = $scope.values || {};
            

                $scope.refractometer = {
                    OG: $scope.values.OG || 1.050,
                    FG: 1.025,
                    correction: 1
                };

                function updateValue() {
                    $scope.refractometer.valueP = BrewCalc.adjustRefractometer(
                        $scope.refractometer.OGP,
                        $scope.refractometer.FGP,
                        $scope.refractometer.correction);
                    $scope.refractometer.value = BrewCalc.fromPlato($scope.refractometer.valueP);
                    $scope.refractometer.ABV = BrewCalc.calculateABV($scope.refractometer.OG, $scope.refractometer.value);
                };

                $scope.$watch("refractometer.OG+refractometer.FG+refractometer.correction", function() {
                    $scope.refractometer.OGP = BrewCalc.toPlato($scope.refractometer.OG);
                    $scope.refractometer.FGP = BrewCalc.toPlato($scope.refractometer.FG);
                    updateValue();
                });

                $scope.updateOG = function() {
                    $scope.refractometer.OG = BrewCalc.fromPlato($scope.refractometer.OGP);
                };

                $scope.updateFG = function() {
                    $scope.refractometer.FG = BrewCalc.fromPlato($scope.refractometer.FGP);
                };

    });

    calculator.controller("calculatorDilutionCtrl", function($scope, BrewCalc) {
            $scope.values = $scope.values || {};
            

                $scope.dilution = {
                    currentGrav: 1.075,
                    currentVol: 20,
                    finalGrav: 1.050
                };

                function updateValue() {
                    $scope.dilution.finalVol = BrewCalc.dilution(
                        $scope.dilution.currentGrav,
                        $scope.dilution.currentVol,
                        $scope.dilution.finalGrav);
                    // $scope.refractometer.value = BrewCalc.fromPlato($scope.refractometer.valueP);
                    // $scope.refractometer.ABV = BrewCalc.calculateABV($scope.refractometer.OG, $scope.refractometer.value);
                };

                $scope.$watch("dilution.currentGrav+dilution.currentVol+dilution.finalGrav", function() {
                    $scope.dilution.currentGravP = BrewCalc.toPlato($scope.dilution.currentGrav);
                    $scope.dilution.finalGravP = BrewCalc.toPlato($scope.dilution.finalGrav);
                    updateValue();
                });

                $scope.updateOG = function() {
                    $scope.dilution.currentGrav = BrewCalc.fromPlato($scope.dilution.currentGravP);
                };

                $scope.updateFG = function() {
                    $scope.dilution.finalGrav = BrewCalc.fromPlato($scope.dilution.finalGravP);
                };

    });
