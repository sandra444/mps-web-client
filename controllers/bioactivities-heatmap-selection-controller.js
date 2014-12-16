/*global MPS:true*/

MPS.controller(
    'bioactivities_heatmap_selection_controller', [
        '$scope', '$location', 'bioactivities_heatmap_filter', '$rootScope',
        function($scope, $location, bioactivities_heatmap_filter, $rootScope) {
            'use strict';
            
            $scope.targets = [];
            $scope.bioactivities = [];
            $scope.compounds = [];
            $rootScope.normalize_bioactivities = true;
            $rootScope.min_feat_count = 10;
            $scope.target_types = bioactivities_heatmap_filter.target_types;
            $scope.organisms = bioactivities_heatmap_filter.organisms;
            
            $scope.isSaving = 0;
            
            $scope.refresh = function() {
                $scope.isSaving += 1;
                bioactivities_heatmap_filter.promise()
                    .then(function(data) {
                        if (data) {
                            console.log('accepted');
                            $scope.targets = bioactivities_heatmap_filter.get_targets();
                            $scope.bioactivities = bioactivities_heatmap_filter.get_bioactivities();
                            $scope.compounds = bioactivities_heatmap_filter.get_compounds();
                            $scope.isSaving -= 1;
                        } else {
                            console.log('no data');
                            $scope.isSaving -= 1;
                        }
                    }, function(error) {
                        console.log('rejected');
                        $scope.isSaving -= 1;
                    });
            };

            //Force refresh
            $scope.refresh();
            
            //Early handler for selectall, not optimal
            $scope.$on('heatmap_selection_update_all', function() {

                $scope.refresh();
            });
            
            //Early handler for changing min_feat_count
            $scope.new_min = function(val) {
                
                $rootScope.min_feat_count = val;
                $scope.refresh();
            }
            
            $scope.norm = function(val) {
                $rootScope.normalize_bioactivities = val;
            }
            
            $scope.submit = function() {
                $location.path('/bioactivities/heatmap');
            };
        }
    ]
);
