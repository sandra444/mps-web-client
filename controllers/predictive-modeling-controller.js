MPS.controller(
    'predictive_modeling_controller',
    [
        '$scope', '$http',

        function ($scope, $http) {
            'use strict';

            $scope.error_message_visible = false;

            /* destroy existing scatterplot if it exists upon navigation */
            $scope.$on('$routeChangeSuccess', function() {
                $('svg').remove();
                window.spinner.spin(
                    document.getElementById("spinner")
                );
            });

            $http(
                {
                    url: '/bioactivities/gen_plot/',
                    method: 'POST',
                    data: {
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                }
            ).success(
                function (data) {
                    window.spinner.stop();
//                    if (data["data_csv"] != undefined) {
                        $scope.scatterplot_data_csv = "/media/scatterplot/data.tsv"; // this was data["data_csv"];
                        window.d3_scatterplot_render($scope.scatterplot_data_csv);

//                    } else {
//                        $scope.error_message_visible = true;
//                        window.spinner.stop();
//                    }
                }
            ).error(
                function () {
                    window.spinner.stop();
                    $scope.error_message_visible = true;
                }
            );

        }
    ]
);
