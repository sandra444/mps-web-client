
MPS.directive(
    'heatmap',
    function () {
        'use strict';

        return {

            restrict: 'E',

            link: function(scope, element, attrs) {

                $(element).heatmap(
                    {
                        data: {
                            values: new jheatmap.readers.TableHeatmapReader(
                                { url: scope.data_url }
                            )
                        },

                        init: function (heatmap) {

                            // Setup default zoom
                            heatmap.cols.zoom = 12;
                            heatmap.rows.zoom = 12;

                            heatmap.cells.decorators["value"] = new
                                jheatmap.decorators.Heat(
                                {
                                    minValue: 0,
                                    midValue: 15000,
                                    maxValue: 30000,
                                    minColor: [85, 0, 136],
                                    nullColor: [255, 255, 255],
                                    maxColor: [255, 204, 0],
                                    midColor: [240, 240, 240]

                                }
                            );

                            heatmap.cells.decorators["bioactivity"] = new
                                jheatmap.decorators.Heat(
                                {
                                    minValue: 0,
                                    midValue: 20,
                                    maxValue: 200,
                                    nullColor: [255, 255, 255],
                                    minColor: [255, 0, 0],
                                    midColor: [255, 255, 0],
                                    maxColor: [0, 255, 0]
                                }
                            );


                        }
                    }
                );
            }
        }

    }
);



