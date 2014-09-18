/*global MPS:true*/

MPS.controller(
    'bioactivities_heatmap_selection_controller', [
        '$scope', '$location', 'bioactivities_heatmap_filter', '$rootScope',
        function($scope, $location, bioactivities_heatmap_filter, $rootScope) {
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
            $rootScope.isSaving = false;
            $rootScope.min_feat_count = 10;
            $scope.refresh();
            
            $rootScope.targets_clear = false;
            $rootScope.bioactivities_clear = false;
            $rootScope.compounds_clear = false;
            
            $scope.$on('heatmap_selection_update_targets', function() {
                
                console.log('Refresh Targets');
                $scope.targets = bioactivities_heatmap_filter.get_targets();
            });
            
            $scope.$on('heatmap_selection_update_bioactivities', function() {

                console.log('Refresh Bioactivities');
                $scope.bioactivities = bioactivities_heatmap_filter.get_bioactivities();
            });
            
            $scope.$on('heatmap_selection_update_compounds', function() {
                
                console.log('Refresh Compounds');
                $scope.compounds = bioactivities_heatmap_filter.get_compounds();
            });

            //Early handler for selectall, not optimal
            $scope.$on('heatmap_selection_update_all', function() {
                
                $rootScope.targets_clear = false;
                $rootScope.bioactivities_clear = false;
                $rootScope.compounds_clear = false;
                $rootScope.isSaving = true;
                
                console.log('Refresh All');
                $scope.refresh();
            });
            
            //Early handler for changing min_feat_count
            $scope.new_min = function(val) {
                
                $rootScope.targets_clear = false;
                $rootScope.bioactivities_clear = false;
                $rootScope.compounds_clear = false;
                $rootScope.isSaving = true;
                
                console.log('New Feature Count');
                $rootScope.min_feat_count = val;
                $scope.refresh();
            }
            
            $scope.submit = function() {
                $location.path('/bioactivities/heatmap');
            };
            
            //console.log($scope.min_feat_count);
        }
    ]
);
