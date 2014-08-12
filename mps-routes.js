MPS.config(['$routeProvider',
    function ($routeProvider) {
        'use strict';

        $routeProvider.
            when('/', {
                templateUrl: '/static/partials/welcome.html',
                controller: ''
            }).
            when('/about', {
                templateUrl: '/static/partials/about.html',
                controller: ''
            }).
            when('/bioactivities/heatmap_selection', {
                templateUrl: '/static/partials/bioactivities-heatmap-selection.html',
                controller: 'bioactivities_heatmap_selection_controller'
            }).
            when('/bioactivities/plot_selection', {
                templateUrl: '/static/partials/bioactivities-plot-selection.html',
                controller: 'bioactivities_heatmap_selection_controller'
            }).
            when('/bioactivities/heatmap', {
                templateUrl: '/static/partials/bioactivities-heatmap.html',
                controller: 'bioactivities_heatmap_controller'
            }).
            when('/bioactivities/plot', {
                templateUrl: '/static/partials/predictive-modeling.html',
                controller: 'predictive_modeling_controller'
            }).
            otherwise({
                redirectTo: '/'
            });
    }]);
