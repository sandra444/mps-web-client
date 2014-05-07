MPS.controller(
    'bioactivities_heatmap_controller',
    [
        '$scope', '$http', 'bioactivities_heatmap_filter',
        function ($scope, $http, bioactivities_heatmap_filter) {
            'use strict';

            var bioactivities_filter = bioactivities_heatmap_filter.bioactivities;
            var targets_filter = bioactivities_heatmap_filter.targets;
            var compounds_filter = bioactivities_heatmap_filter.compounds;

            $scope.alerts = [];

            $scope.add_alert = function(message, level) {
                $scope.alerts.push({type: level, msg: message});
            };

            $scope.close_alert = function () {
                $scope.alerts.pop();
            };

            $http(
                {
                    url: '/bioactivities/gen_heatmap/',
                    method: 'POST',
                    data: {
                        'bioactivities_filter': bioactivities_filter,
                        'targets_filter': targets_filter,
                        'compounds_filter': compounds_filter
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                }
            ).success(
                function (data) {
                    $scope.heatmap_data_url = data["url"];
                }
            ).error(
                function() {
                }
            );
        }
    ]
);

