/*global MPS:true*/

MPS.controller(
    'bioactivities_heatmap_selection_controller', [
        '$scope', '$location', 'bioactivities_heatmap_filter', '$rootScope',
        function($scope, $location, bioactivities_heatmap_filter, $rootScope) {
            'use strict';

            //console.log($scope);
            
            $scope.targets = [];
            $scope.bioactivities = [];
            $scope.compounds = [];
            $rootScope.normalize_bioactivities = bioactivities_heatmap_filter.normalize_bioactivities;
            $rootScope.min_feat_count = bioactivities_heatmap_filter.min_feat_count;
            $scope.target_types = bioactivities_heatmap_filter.target_types;
            $scope.organisms = bioactivities_heatmap_filter.organisms;
            $scope.refresh = bioactivities_heatmap_filter.refresh_all;
            
            //console.log($rootScope.normalize_bioactivities);

            //In very poor taste: force refresh; remove after refactor
            $scope.refresh();
            
            //Originally called simply targets etc. from factory, that does not work
            $scope.$on('heatmap_selection_update', function() {
                
                //console.log('Refresh');
                
                $scope.targets = bioactivities_heatmap_filter.get_targets();
                $scope.bioactivities = bioactivities_heatmap_filter.get_bioactivities();
                $scope.compounds = bioactivities_heatmap_filter.get_compounds();
            });

            //Early handler for selectall, not optimal
            $scope.$on('heatmap_selection_update_all', function() {
                
                //console.log('Refresh All');
                $scope.refresh();
            });
            
            //Early handler for changing min_feat_count
            $scope.new_min = function(val) {
                
                //console.log('New Feature Count');
                $rootScope.min_feat_count = val;
                $scope.refresh();
            }
            
            $scope.norm = function(val) {
                $rootScope.normalize_bioactivities = val;
                //console.log($rootScope.normalize_bioactivities);
            }
            
            $scope.submit = function() {
                $location.path('/bioactivities/heatmap');
            };
            
            //console.log($scope.min_feat_count);
        }
    ]
);
