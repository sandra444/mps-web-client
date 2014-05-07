// Defines a new HTML directive <adjacency-matrix>
// Directive *MUST BE IN CAMEL CASE* for AngularJS to pick it up!

MPS.directive(
    'heatmap',
    function ($parse) {
        'use strict';

        // explicitly creating a directive definition variable
        // this may look verbose but is good for clarification purposes
        // in real life you'd want to simply return the object {...}

        var directive_definition_object = {

            // We restrict its use to an element
            // as usually  <adjacency-matrix> is semantically
            // more understandable

            restrict: 'E',

            // this is important,
            // we don't want to overwrite our directive declaration
            // in the HTML mark-up

            replace: true,

            // our data source would be an array
            // passed thru chart-data attribute

            // !!! must use camelcase in order to translate correctly !!!

            scope: {data: '=heatmapData'},
            link: function (scope, element, attrs) {

                    alert('YO');
                    element[0].heatmap(
                        {
                            data: {
                                values: new jheatmap.readers.TableHeatmapReader(
                                    { url: scope.heatmap_data_url }
                                )
                            }
                        }
                    );

            }
        };

        return directive_definition_object;
    }
);
