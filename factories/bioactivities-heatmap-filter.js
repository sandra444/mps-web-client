MPS.factory(
    'bioactivities_heatmap_filter', function ($http) {
        'use strict';

        var target_types = [
            {name: 'Cell-Line', is_selected: false},
            {name: 'Organism', is_selected: false},
            {name: 'Single Protein', is_selected: false},
            {name: 'Tissue', is_selected: false}
        ];
        var organisms = [
            {name: 'Homo Sapiens', is_selected: false},
            {name: 'Rattus Norvegicus', is_selected: false},
            {name: 'Canis Lupus Familiaris', is_selected: false}
        ];

        var min_feat_count = 10;
        var compounds = get_all_bioactivities_keys('/bioactivities/all_compounds');
        var bioactivities = get_all_bioactivities_keys('/bioactivities/all_bioactivities');
        var targets = get_all_bioactivities_keys('/bioactivities/all_targets');

        var refresh_all = function () {
            compounds = get_all_bioactivities_keys('/bioactivities/all_compounds');
            bioactivities = get_all_bioactivities_keys('/bioactivities/all_bioactivities');
            targets = get_all_bioactivities_keys('/bioactivities/all_targets');
        };

        function get_all_bioactivities_keys(resource_url) {
            var i;
            var result = [];

            $http(
                {
                    method: 'GET',
                    params: {
                        'target_types': target_types,
                        'organisms': organisms
                    },
                    url: resource_url
                }
            ).success(
                function (data) {
                    var max_length = data.length;
                    for (i = 0; i < max_length; i += 1) {

                        if (data[i][1] >= min_feat_count) {
                            result.push(
                                {name: data[i][0], is_selected: false}
                            );
                        }
                    }
                }
            ).error(
                function () {
                    console.log("get_all_bioactivities_keys request failed.")
                }
            );
            return result;
        }

        return {
            // expose the private `targets` variable
            // as a public variable of the same name
            targets: targets,

            // expose the private `compounds` variable
            // as a public variable of the same name
            compounds: compounds,

            // expose the private `bioactivities` variable
            // as a public variable of the same name
            bioactivities: bioactivities,

            target_types: target_types,

            organisms: organisms,

            min_feat_count: min_feat_count,

            refresh_all: refresh_all
        };

    }
);
