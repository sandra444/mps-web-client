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
                    var i;
                    var j;
                    var result;
                    var row = [];
                    var payload_columns_length;
                    var payload_index_length;
                    var payload;
                    try {
                        payload = JSON.parse(JSON.parse(data));
                    } catch (e) {
                        $scope.add_alert('Server returned no results!',
                                         'danger');
                        return;
                    }

                    $scope.add_alert('Server returned data! ' +
                                     'Please wait while processing data.',
                                     'success');

                    // column header [column id] [[target, bioactivity]]
                    payload_columns_length = payload["columns"].length;

                    // compound name
                    payload_index_length = payload["index"].length;

                    result = [];

                    // create column headers
                    row.push(''); // create offset for table top left corner
                    for (i = 0; i < payload_index_length; i += 1) {
                        if (payload["columns"][i]) {
                            row.push(
                                    payload["columns"][i][0]
                                    + ' '
                                    + payload["columns"][i][1]
                            );
                        }
                    }
                    result.push(row);

                    // left to right
                    for (i = 0; i < payload_columns_length; i += 1) {
                        row = [];
                        row.push(payload["index"][i]);
                        // top to bottom

                        for (j = 1; j <= payload_columns_length; j += 1) {
                            if (payload["data"][i][j] == null) {
                                row.push('');
                            } else {
                                row.push(payload["data"][i][j]);
                            }

                        }
                        result.push(row);
                    }

                    // Close the data processing alert
                    $scope.close_alert();

                    $scope.result = result;
                }
            ).error(
                function() {
                }
            );

            $scope.set_cell_color = function (value) {

                var the_rgb;
                var the_hex;

                var element_value = parseFloat(value);

                var min = 0; // min possible `value`
                var max = 80; // max possible `value`

                var spread_iteration = 255 / (
                    max - min
                    );

                var red = spread_iteration * element_value;
                var green = 0;
                var blue = 255 - (
                    spread_iteration * element_value
                    );

                if (red > 255) {
                    red = 255;
                }

                if (blue > 255) {
                    blue = 255;
                }

                if (red < 0) {
                    red = 0;
                }

                if (blue < 0) {
                    blue = 0;
                }

                the_rgb = blue | ( green << 8 ) | ( red << 16);

                the_hex = '#' + (
                    0x1000000 + the_rgb
                    ).toString(16).slice(1);

                return {
                    backgroundColor: the_hex,
                    color: 'white'
                };
            };
        }
    ]
);

