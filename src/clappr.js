'use strict';

angular.module('clappr',[])
.directive('clappr', function () {
  return {
    restrict: 'E',
    scope: {
      'src' : '='
    },
    template: '<div id="player"></div>',
    link: function(scope, element, attrs) {
      scope.$watch('src', function(newValue, oldValue) {
        if (!newValue)
          return;

        angular.element('#player').children().remove();

        var locationImage = "http://"+window.location.host + window.location.pathname + "images/logo_watermark.png";

        new Clappr.Player({
          source: scope.src,
          parentId: "#player",
          autoPlay: false,
          watermark: locationImage,
          width: "100%",
          height: "456px"
        });

        angular.element('video')[0].onended = function() {
            scope.$emit("clappr:finishVideo");
        };

        scope.$$watchers = [];
      });
    }
  };
});
