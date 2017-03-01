 app.controller("RecipeMashCtrl",function(
        $scope,
        BrewCalc,
        BrewHelper,
        FermentableUses
    ) {
$scope.styleTitle = function(onFocus) {
            if ( onFocus ) {
                return {background: 'white','border-color':'#ccc'};
            } else {
                return {background: 'white','border-color':'white',cursor:'pointer'};
            }
        };
        $scope.moment = function($index) {
            var time = 0;
            for (var i=0; i<$index; i++) {
                time += $scope.recipe.MASH.MASH_STEPS.MASH_STEP[i].STEP_TIME;
            }
            return time;
        };
        $scope.firstRunSg = function() {
            var og = 0;
            angular.forEach($scope.recipe.FERMENTABLES.FERMENTABLE,function(f) {
                if ( FermentableUses.valueOf(f.USE).mash ) {
                    og += BrewHelper.toLbs(f.AMOUNT) *
                        BrewHelper.toPpg(f.POTENTIAL) *
                        // ($scope.recipe.EFFICIENCY/100) /
                        0.75 /
                        BrewHelper.toGal($scope.recipe.StrikeWater);
                }
            });
            return BrewHelper.toPotential(og);
        };

        $scope.spargeWater = function() {
            return $scope.totalWater() -
                BrewCalc.actualMashVolume(
                    $scope.recipe.MASH.MASH_STEPS.MASH_STEP.length-1,
                   0,
                   $scope.recipe.MASH.MASH_STEPS.MASH_STEP
                ) -
                $scope.recipe.StrikeWater-
                ($scope.recipe.TopUpWater||0);
        };

        $scope.totalWater = function() {
            return BrewCalc
                        .calculateBoilSize($scope.recipe.BATCH_SIZE,
                                           $scope.recipe.TrubChillerLosses,
                                           $scope.recipe.BOIL_TIME,
                                           $scope.recipe.PercentEvap,
                                           $scope.recipe.TopUpWater)
                    +$scope.recipe.SpargeDeadSpace
                    +$scope.recipe.GrainAbsorbtion*$scope.recipe.totalAmountMash;
        };

        $scope.addWaterVol = function(STEP,$index) {
            //Hago los caclulos para el agregado de agua
            var ratio;
            if ( $index == 0 ) {
                ratio = $scope.recipe.WatertoGrainRatio;
            } else {
                var vol = BrewCalc.actualMashVolume($index-1,$scope.recipe.StrikeWater,$scope.recipe.MASH.MASH_STEPS.MASH_STEP);
                ratio = vol/$scope.recipe.totalAmountMash;
            }
            var botvol = 0.7; //Equivalente en agua del barril (absorcion de temp), por ahora desprecio y dejo en 0.
            //el otro cero es los litros perdidos debejo del FF, que deberia calcularlos antes.
            STEP.INFUSE_AMOUNT = restCalc($scope.recipe.totalAmountMash,ratio,0,0,STEP.STEP_TEMP,STEP.END_TEMP,STEP.INFUSE_TEMP);

            //Calculos para tamaño de la decoccion
            var volMash = BrewCalc.actualMashVolume($index-1,$scope.recipe.StrikeWater+$scope.recipe.totalAmountMash,$scope.recipe.MASH.MASH_STEPS.MASH_STEP);

            //Supongo q siempre decocciono a 100
            var decoctionTemp = 100;
            STEP.DECOCTION_AMT = BrewHelper.round(volMash * ( STEP.END_TEMP - STEP.STEP_TEMP ) / ( decoctionTemp - STEP.STEP_TEMP ),10);
        };

        function restCalc(weight,thick,botvol,eqvol,curtemp,tartemp,boiltemp) {
            var vol=weight*(0.417+thick)+botvol+eqvol;
            var watvol=vol*(tartemp-curtemp)/(boiltemp-tartemp);
            return BrewHelper.round(watvol,10);
        }

        $scope.strikeWaterTemp = function() {
            return ($scope.recipe.mashTemp-$scope.recipe.GrainTemp)*0.417/$scope.recipe.WatertoGrainRatio
                    +$scope.recipe.mashTemp
                    +$scope.recipe.lossMashTemp;
        };

        $scope.changeAction = function(STEP, actionValue) {
            if (actionValue == '0') {
                STEP.infuse = false;
                STEP.decoction = false;
            } else if (actionValue == '1') {
                STEP.infuse = true;
                STEP.decoction = false;
            } else if (actionValue == '2') {
                STEP.infuse = false;
                STEP.decoction = true;
            }
        };

        $scope.stepAction = function(STEP) {
            if (STEP.infuse) {
                return "Agregar Agua"
            } else if (STEP.decoction) {
                return "Decoccion";
            }
            return null;
        };

        $scope.initActionValue = function(STEP) {
            if (STEP.infuse) {
                return '1';
            } else if (STEP.decoction) {
                return '2';
            } else {
                return '0';
            }
        };

        $scope.addMashStep = function() {
            //ahora pongo esa, luego debeira obtene la del ultimo step.
            var temp = $scope.recipe.mashTemp;
            angular.forEach($scope.recipe.MASH.MASH_STEPS.MASH_STEP,function(step) {
                temp = step.END_TEMP;
            });
            //Idem anterior
            var ratio = $scope.recipe.WatertoGrainRatio;
            //Copiar ultimo
            var recirculate = false;

            $scope.recipe.MASH.MASH_STEPS.MASH_STEP.push({
                NAME: null,
                TYPE: 'Infusion',
                infuse: false,
                INFUSE_AMOUNT: 0, //Agua agregada
                INFUSE_TEMP: 100,   //Temp agua agregada
                STEP_TIME: 0,     //Duracion
                STEP_TEMP: temp,     //Temperatura buscada (si pongo INFUSE se calcula sola, pero se puede pisar)
                END_TEMP: temp,      //Temp final de la etapa.
                DESCRIPTION: null,   //texto libre
                WATER_GRAIN_RATIO: ratio, //relacion final (calculada, INFUSE_AMOUNT y DECOCTION_AMT)
                DECOCTION_AMT: 0,  //cantidad sacada para decocction
                recirculate: recirculate,
                compact:false
            });
        };

        $scope.updateInfuse = function() {

        };

        $scope.calculateVolume = function(step_index) {
            return BrewCalc.actualMashVolume(
                        step_index,
                        BrewCalc.initialMashVolume($scope.recipe.StrikeWater,$scope.recipe.totalAmountMash),
                        $scope.recipe.MASH.MASH_STEPS.MASH_STEP);
        };

        $scope.updateChart = function() {

        };

        $scope.moveUp = function(STEP,$index) {
            $scope.recipe.MASH.MASH_STEPS.MASH_STEP.splice($index,1);
            $scope.recipe.MASH.MASH_STEPS.MASH_STEP.splice($index-1,0,STEP);
        };

        $scope.moveDown = function(STEP,$index) {
            $scope.recipe.MASH.MASH_STEPS.MASH_STEP.splice($index,1);
            $scope.recipe.MASH.MASH_STEPS.MASH_STEP.splice($index+1,0,STEP);
        };
    });