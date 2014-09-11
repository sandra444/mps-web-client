/*global MPS:true*/

MPS.controller(
    'bioactivities_heatmap_selection_controller', [
        '$scope', '$location', 'bioactivities_heatmap_filter',
        function($scope, $location, bioactivities_heatmap_filter) {
            'use strict';

            //console.log($scope);
            
            $scope.targets = bioactivities_heatmap_filter.targets;
            $scope.bioactivities = bioactivities_heatmap_filter.bioactivities;
            $scope.compounds = bioactivities_heatmap_filter.compounds;
            $scope.normalize_bioactivities = bioactivities_heatmap_filter.normalize_bioactivities;
            $scope.min_feat_count = bioactivities_heatmap_filter.min_feat_count;
            $scope.target_types = bioactivities_heatmap_filter.target_types;
            $scope.organisms = bioactivities_heatmap_filter.organisms;
            $scope.refresh = bioactivities_heatmap_filter.refresh_all;

            //In very poor taste: force refresh; remove after refactor
            $scope.refresh();
            
            //Originally called simply targets etc. from factory, that does not work
            $scope.$on('heatmap_selection_update', function() {
                $scope.targets = bioactivities_heatmap_filter.get_targets();
                $scope.bioactivities = bioactivities_heatmap_filter.get_bioactivities();
                $scope.compounds = bioactivities_heatmap_filter.get_compounds();
            });

            $scope.submit = function() {
                $location.path('/bioactivities/heatmap');
            };
        }
    ]
);
