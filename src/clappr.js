'use strict';

angular.module('clappr',[])
.directive('clappr', function () {
  return {
    restrict: 'E',
    scope: {
      'src' : '='
    },
    template: '<div class="embed-responsive embed-responsive-16by10"><div id="player" class="embed-responsive-item"></div></div>',
    link: function(scope, element, attrs) {
      scope.$watch('src', function(newValue, oldValue) {
        if (!newValue)
          return;

        angular.element('#player').children().remove();

        var locationImage = "http://" + window.location.host + window.location.pathname + "images/logo_watermark.png";

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
          watermark: locationImage,
          width: "100%",
          height: "100%" // 456px"
        });

        angular.element('video')[0].onended = function() {
            scope.$emit("clappr:finishVideo");
        };

        scope.$$watchers = [];
      });
    }
  };
});
