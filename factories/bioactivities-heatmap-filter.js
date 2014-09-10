/*global MPS:true*/

MPS.factory(
    'bioactivities_heatmap_filter', function($rootScope, $http) {
        'use strict';

        var normalize_bioactivities = false;
        var messages = '';

        var target_types = [{
            name: 'Cell-Line',
            is_selected: false
        }, {
            name: 'Organism',
            is_selected: false
        }, {
            name: 'Single Protein',
            is_selected: false
        }, {
            name: 'Tissue',
            is_selected: false
        }];
        var organisms = [{
            name: 'Homo Sapiens',
            is_selected: false
        }, {
            name: 'Rattus Norvegicus',
            is_selected: false
        }, {
            name: 'Canis Lupus Familiaris',
            is_selected: false
        }];

        var compounds = [];
        var bioactivities = [];
        var targets = [];
        var min_feat_count = 10;

        var process_data = function(data, resource_url) {
            var result = [];
            var i;
            for (i = 0; i < data.length; i += 1) {

                if (data[i][1] >= min_feat_count) {
                    result.push({
                        name: data[i][0],
                        is_selected: false
                    });
                }
            }

            if (resource_url.search('all_compound') > -1) {
                compounds = result;
                //console.log(compounds);
            }

            else if (resource_url.search('all_targets') > -1) {
                targets = result;
                //console.log(targets);
            }
            
            else if (resource_url.search('all_bioactivities') > -1) {
                bioactivities = result;
                //console.log(bioactivities);
            }

            $rootScope.$broadcast('heatmap_selection_update');
        };

        var get_all_bioactivities_keys = function(resource_url) {
            $http({
                method: 'GET',
                params: {
                    'target_types': JSON.stringify(target_types),
                    'organisms': JSON.stringify(organisms)
                },
                url: resource_url
            }).success(
                function(data) {
                    process_data(data, resource_url);
                }
            ).error(
                function() {
                    console.log("ERROR: get_all_bioactivities_keys FAILED");
                }
            );
        };

        var refresh_all = function() {
            get_all_bioactivities_keys('/bioactivities/all_targets');
            get_all_bioactivities_keys('/bioactivities/all_compounds');
            get_all_bioactivities_keys('/bioactivities/all_bioactivities');
        };
        
        return {

            targets: targets,
            compounds: compounds,
            bioactivities: bioactivities,
            target_types: target_types,
            organisms: organisms,
            normalize_bioactivities: normalize_bioactivities,
            min_feat_count: min_feat_count,
            refresh_all: refresh_all,
            messages: messages,
            
            get_targets: function() {
                //get_all_bioactivities_keys('/bioactivities/all_targets');
                return targets;
            },
            
            get_bioactivities: function() {
                //get_all_bioactivities_keys('/bioactivities/all_bioactivities');
                return bioactivities;
            },
            
            get_compounds: function() {
                //get_all_bioactivities_keys('/bioactivities/all_compounds');
                return compounds;
            }
            
        };

    });
