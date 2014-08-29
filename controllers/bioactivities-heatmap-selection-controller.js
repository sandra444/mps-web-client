/*global MPS:true*/

MPS.controller(
    'bioactivities_heatmap_selection_controller', [
        '$scope', '$location', 'bioactivities_heatmap_filter',
        function($scope, $location, bioactivities_heatmap_filter) {
            'use strict';

            $scope.targets = bioactivities_heatmap_filter.targets;
            $scope.bioactivities = bioactivities_heatmap_filter.bioactivities;
            $scope.compounds = bioactivities_heatmap_filter.compounds;
            $scope.normalize_bioactivities = bioactivities_heatmap_filter.normalize_bioactivities;
            $scope.min_feat_count = bioactivities_heatmap_filter.min_feat_count;
            $scope.target_types = bioactivities_heatmap_filter.target_types;
            $scope.organisms = bioactivities_heatmap_filter.organisms;
            $scope.refresh = bioactivities_heatmap_filter.refresh_all;

            $scope.$on('heatmap_selection_update', function() {
                $scope.targets = bioactivities_heatmap_filter.targets;
                $scope.bioactivities = bioactivities_heatmap_filter.bioactivities;
                $scope.compounds = bioactivities_heatmap_filter.compounds;
            });

            $scope.submit = function() {
                $location.path('/bioactivities/heatmap');
            };
        }
    ]
);
