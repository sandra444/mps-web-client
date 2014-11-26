/*global MPS:true*/

MPS.factory(
    'bioactivities_heatmap_filter', function($rootScope, $http, $q) {
        'use strict';
        
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
        var min_feat_count = 10;
        
        var get_list = function(data) {
            if (!data || data.length == 0){
                return [];
            }
            
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
            return result;
        }

        return {

            target_types: target_types,
            organisms: organisms,
            messages: messages,
            
            //AngularJS does not magically update returned values
            //That is, calling "targets" from the controller will be empty
            
            get_targets: function() {
                return targets;
            },
            
            get_bioactivities: function() {
                return bioactivities;
            },
            
            get_compounds: function() {
                return compounds;
            },
            
            get_normalize_bioactivities: function() {
                return $rootScope.normalize_bioactivities;
            },
            
            get_method: function() {
                return $rootScope.method;
            },
            
            get_metric: function() {
                return $rootScope.metric;
            },
            
            promise: function() {
                return $http({
                    method: 'GET',
                    params: {
                        'target_types': JSON.stringify(target_types),
                        'organisms': JSON.stringify(organisms)
                    },
                    url: '/bioactivities/all_data'
                })
                .then(function(response) {
                    min_feat_count = $rootScope.min_feat_count ? $rootScope.min_feat_count : 10;
                    if (typeof response.data === 'object') {
                        targets = get_list(response.data.targets);
                        compounds = get_list(response.data.compounds);
                        bioactivities = get_list(response.data.bioactivities);
                        return response.data
                    } else {
                        return $q.reject(response.data);
                    }
                }, function(response) {
                    return $q.reject(response.data);
                });
            }
        };
    });
