
app.controller('timerCtrl', function ($scope, $cordovaLocalNotification, $ionicPopup, $interval, $filter) {

    $scope.alerts=[];
    $scope.newAlert = {};

    $interval(function(){    
        $scope.alerts.forEach(function(alert){
            
            if(alert.left == "Expirada" || alert.left == "Cancelada") return;
    
            var now = new Date();

            var timezoneOffset = now.getTimezoneOffset(); 

            var deadLine = alert.end;
            var timeDifference = (deadLine.getTime()) - (now.getTime()); // deadline data minus current date
            var dend = new Date(alert.end.getTime()-timezoneOffset*60*1000); 
            if(dend>now){  
                alert.left = $filter('date')(timeDifference,"HH:mm:ss")
            }else{
                 timeDifference = (now.getTime()-deadLine.getTime()  ); 
 
                alert.left = 'Expirada hace:' + $filter('date')(timeDifference,"HH:mm:ss", 'UTC');
            } 
            }, 1000,0,null);    

        });  
      
    $scope.add = function(){
        if($scope.newAlert.name && $scope.newAlert.time){
            var now = new Date();

            var timezoneOffset = now.getTimezoneOffset(); 
            var alert = angular.copy($scope.newAlert);
            var notificationTime = new Date(now.getTime() + alert.time*1000*60); 
            alert.time=(alert.time+timezoneOffset)*1000*60;  
            var time = new Date(now.getTime() + alert.time);//* 60 para minutos
            alert.end = time; 
            $scope.newAlert = {}; 
            alert.id = "bom-timer-"+$scope.alerts.length+1; 
            if(window.plugin){
                $cordovaLocalNotification.schedule({
                    id: alert.id, 
                    at: notificationTime,
                    title: 'Alerta: Brew-o-Matic',
                    text: alert.name,
                    sound: "file://resources/audio/alarm.mp3",
                });
            }
            

            $scope.alerts.push(alert);     
            

            

       } 
    }
    $scope.cancelNotification = function(alert){
        var confirmPopup = $ionicPopup.confirm({
           title: 'Cancelar alerta.',
           template: "Esta seguro que desea cancelar esta alerta?"
         });
         confirmPopup.then(function(res) {
           if(res) {
             alert.left = "Cancelada";
             if(window.plugin){ 
                $cordovaLocalNotification.cancel(alert.id, function(){alert('se ha removido con exito');})
             }   
           } else {
             
           }
         });
    }
 
    $scope.isScheduled = function() {
        $cordovaLocalNotification.isScheduled("1234").then(function(isScheduled) {
            alert("Notification 1234 Scheduled: " + isScheduled);
        });
    }   
    $scope.$on("$cordovaLocalNotification:added", function(id, state, json) {
        alert("Added a notification");
    });

}) 
