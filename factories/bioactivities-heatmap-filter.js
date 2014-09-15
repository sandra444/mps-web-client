/*global MPS:true*/

MPS.factory(
    'bioactivities_heatmap_filter', function($rootScope, $http) {
        'use strict';

        //console.log($rootScope);
        
        var normalize_bioactivities = false;
        var messages = '';

        //Initial values are true: elimate in lieu of add
        var target_types = [{
            name: 'Cell-Line',
            is_selected: true
        }, {
            name: 'Organism',
            is_selected: true
        }, {
            name: 'Single Protein',
            is_selected: true
        }, {
            name: 'Tissue',
            is_selected: true
        }];
        var organisms = [{
            name: 'Homo Sapiens',
            is_selected: true
        }, {
            name: 'Rattus Norvegicus',
            is_selected: true
        }, {
            name: 'Canis Lupus Familiaris',
            is_selected: true
        }];

        var compounds = [];
        var bioactivities = [];
        var targets = [];
        //Currently hard-coded: Can change for testing purposes
        //Must bind to input soon
        
        //console.log(min_feat_count);
        
        var min_feat_count = min_feat_count ? min_feat_count : 10;
        
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

            //Early fix: determine whether or not to broadcast
            var broad = false;
            
            //Sloppy URL search: Originally redundant for bioactivities
            
            if (resource_url.search('all_compound') > -1) {
                if (compounds.length != result.length){
                    compounds = result;
                    broad = true;
                }
                //console.log(compounds);
            }

            else if (resource_url.search('all_targets') > -1) {
                if (targets.length != result.length){
                    targets = result;
                    broad = true;
                }
                //console.log(targets);
            }
            
            else if (resource_url.search('all_bioactivities') > -1) {
                if (bioactivities.length != result.length){
                    bioactivities = result;
                    broad = true;
                }
                //console.log(bioactivities);
            }

            //Moved broadcast: Race condition when inside refresh_all
            //Consider more effective solution
            if (broad) {
                $rootScope.$broadcast('heatmap_selection_update');
            }
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
            //Get min_feat_count from rootScope
            min_feat_count = $rootScope.min_feat_count ? $rootScope.min_feat_count : 10;
            get_all_bioactivities_keys('/bioactivities/all_targets');
            get_all_bioactivities_keys('/bioactivities/all_compounds');
            get_all_bioactivities_keys('/bioactivities/all_bioactivities');
        };
        
        //Force refresh to acquire initial values
        refresh_all();
        
        return {

            targets: targets,
            compounds: compounds,
            bioactivities: bioactivities,
            target_types: target_types,
            organisms: organisms,
            normalize_bioactivities: normalize_bioactivities,
            min_feat_count: function() {
                //get_all_bioactivities_keys('/bioactivities/all_targets');
                return min_feat_count;
            },
            refresh_all: refresh_all,
            messages: messages,
            
            //AngularJS does not magically update returned values
            //That is, calling "targets" from the controller will be empty
            //Crude solution below: functions for value return
            
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
