'use strict';

angular.module('clappr',[])
.directive('clappr', function ($interval) {
  return {
    restrict: 'E',
    scope: {
      'src' : '='
    },
    template: '<div class="embed-responsive embed-responsive-16by9">'+
                  '<div id="player" class="embed-responsive-item"></div>'+
              '</div>',
    link: function(scope, element, attrs) {
      scope.$watch('src', function(newValue, oldValue) {
        if (!newValue)
          return;

        angular.element('#player').children().remove();

        var locationBase = "http://" + window.location.host + window.location.pathname
        var locationWaterMark = locationBase + "images/logo_watermark.png";
        var locationPoster = locationBase + "images/black.png";

        $("#player").resizable({
          aspectRatio: 16/9,
          maxHeight: 720,
          maxWidth: 1280,
          minHeight: 240,
          minWidth: 320
        });

        new Clappr.Player({
          source: scope.src,
          parentId: "#player",
          autoPlay: false,
          watermark: locationWaterMark,
          width: "100%",
          poster: locationPoster,
          height: "100%"
        });

        scope.timer, scope.timeSpent = [];

        var player = angular.element('video')[0];

        player.addEventListener("playing",onPlayerStateChange,true);
        player.addEventListener("pause",function(){
          $interval.cancel(scope.timer);
        },true);

        function onPlayerStateChange() {
            if(!scope.timeSpent.length){
                for(var i=0, l=parseInt(player.duration); i<l; i++) scope.timeSpent.push(false);
            }

            scope.timer = $interval(record,100);
        }

        function record(){
          scope.timeSpent[ parseInt(player.currentTime)] = true;
          showPercentage();
        }

        function showPercentage(){
            var percent = 0;
            for(var i=0, l=scope.timeSpent.length; i<l; i++){
                if(scope.timeSpent[i]) percent++;
            }
            percent = Math.round(percent / scope.timeSpent.length * 100);
            //console.log(percent + "%");
            if(percent >= 10){
              broadcastWatchedMinPercentage();
              $interval.cancel(scope.timer);
            }
        }

        function broadcastWatchedMinPercentage(){
          if(!scope.watchedMinPercentage){
            scope.$emit("clappr:watchedMinPercentage");
            scope.watchedMinPercentage = true;
          }
        }

        player.onended = function() {
            scope.$emit("clappr:finishVideo");
        };

        scope.$$watchers = [];
        scope.$on("$destroy",function(){
          $interval.cancel(scope.timer);
        });
        element.on("$destroy",function() {
          $interval.cancel(scope.timer);
        })
      });
    }
  };
});
