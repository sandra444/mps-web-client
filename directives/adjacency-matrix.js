// Defines a new HTML directive <adjacency-matrix>
// Directive *MUST BE IN CAMEL CASE* for AngularJS to pick it up!

MPS.directive(
    'adjacencyMatrix',
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

            replace: false,

            // our data source would be an array
            // passed thru chart-data attribute

            // !!! must use camelcase in order to translate correctly !!!

            scope: {data: '=matrixData'},
            link: function (scope, element, attrs) {

                // in D3, any selection[0] contains the group

                // selection[0][0] is the DOM node
                // but we won't need that this time

                // var chart = d3.select(element[0]);

                // to our original directive markup bars-chart
                // we add a div with out chart stling and bind each
                // data entry to the chart

                /*
                 chart.append("div").attr("class", "chart")
                 .selectAll('div')
                 .data(scope.data).enter().append("div")
                 .transition().ease("elastic")
                 .style("width", function(d) { return d + "%"; })
                 .text(function(d) { return d + "%"; });

                 */

                // a little of magic: setting it's width based
                // on the data value (d)
                // and text all with a smooth transition

                var margin =
                    {
                        top: 200, right: 0, bottom: 10, left: 200
                    },
                    width = 500,
                    height = 500;

                var x = d3.scale.ordinal().rangeBands([0, width]),
                    z = d3.scale.linear().domain([0, 4]).clamp(true),
                    c = d3.scale.category10().domain(d3.range(10));

                // element[0] was "body"
                var svg = d3.select(element[0]).append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .style("margin-left", -margin.left + "px")
                    .append("g")
                    .attr(
                    "transform",
                    "translate(" + margin.left + "," + margin.top + ")"
                );

                d3.json(
                    scope.data, function () {

                        var matrix_data = scope.data;

                        var matrix = [],
                            nodes = matrix_data.nodes,
                            n = nodes.length;

                        // Compute index per node.
                        nodes.forEach(
                            function (node, i) {
                                node.index = i;
                                node.count = 0;
                                matrix[i] = d3.range(n).map(
                                    function (j) {
                                        return {x: j, y: i, z: 0};
                                    }
                                );
                            }
                        );

                        // Convert links to matrix; count character occurrences.
                        matrix_data.links.forEach(
                            function (link) {
                                try {
                                    matrix[link.source][link.target].z +=
                                    link.value;
                                    matrix[link.target][link.source].z +=
                                    link.value;
                                    matrix[link.source][link.source].z +=
                                    link.value;
                                    matrix[link.target][link.target].z +=
                                    link.value;
                                    nodes[link.source].count += link.value;
                                    nodes[link.target].count += link.value;
                                } catch (TypeError) {
                                    console.log('failure')
                                }
                            }
                        );

                        // Precompute the orders.
                        var orders = {
                            name: d3.range(n).sort(
                                function (a, b) {
                                    return d3.ascending(
                                        nodes[a].name, nodes[b].name
                                    );
                                }
                            ),
                            count: d3.range(n).sort(
                                function (a, b) {
                                    return nodes[b].count - nodes[a].count;
                                }
                            ),
                            group: d3.range(n).sort(
                                function (a, b) {
                                    return nodes[b].group - nodes[a].group;
                                }
                            )
                        };

                        // The default sort order.
                        x.domain(orders.name);

                        svg.append("rect")
                            .attr("class", "background")
                            .attr("width", width)
                            .attr("height", height);

                        var row = svg.selectAll(".row")
                            .data(matrix)
                            .enter().append("g")
                            .attr("class", "row")
                            .attr(
                            "transform", function (d, i) {
                                return "translate(0," + x(i) + ")";
                            }
                        )
                            .each(row);

                        row.append("line")
                            .attr("x2", width);

                        row.append("text")
                            .attr("x", -6)
                            .attr("y", x.rangeBand() / 2)
                            .attr("dy", ".32em")
                            .attr("text-anchor", "end")
                            .text(
                            function (d, i) {
                                return nodes[i].name;
                            }
                        );

                        var column = svg.selectAll(".column")
                            .data(matrix)
                            .enter().append("g")
                            .attr("class", "column")
                            .attr(
                            "transform", function (d, i) {
                                return "translate(" + x(i) + ")rotate(-90)";
                            }
                        );

                        column.append("line")
                            .attr("x1", -width);

                        column.append("text")
                            .attr("x", 6)
                            .attr("y", x.rangeBand() / 2)
                            .attr("dy", ".32em")
                            .attr("text-anchor", "start")
                            .text(
                            function (d, i) {
                                return nodes[i].name;
                            }
                        );

                        function row(row) {
                            var cell = d3.select(this).selectAll(".cell")
                                .data(
                                row.filter(
                                    function (d) {
                                        return d.z;
                                    }
                                )
                            )
                                .enter().append("rect")
                                .attr("class", "cell")
                                .attr(
                                "x", function (d) {
                                    return x(d.x);
                                }
                            )
                                .attr("width", x.rangeBand())
                                .attr("height", x.rangeBand())
                                .style(
                                "fill-opacity", function (d) {
                                    return z(d.z);
                                }
                            )
                                .style(
                                "fill", function (d) {
                                    return nodes[d.x].group
                                               == nodes[d.y].group ?
                                           c(nodes[d.x].group) : null;
                                }
                            )
                                .on("mouseover", mouseover)
                                .on("mouseout", mouseout);
                        }

                        function mouseover(p) {
                            d3.selectAll(".row text").classed(
                                "active", function (d, i) {
                                    return i == p.y;
                                }
                            );
                            d3.selectAll(".column text").classed(
                                "active", function (d, i) {
                                    return i == p.x;
                                }
                            );
                        }

                        function mouseout() {
                            d3.selectAll("text").classed("active", false);
                        }

                        d3.select("#order").on(
                            "change", function () {
                                clearTimeout(timeout);
                                order(this.value);
                            }
                        );

                        function order(value) {
                            x.domain(orders[value]);

                            var t = svg.transition().duration(5000);

                            t.selectAll(".row")
                                .delay(
                                function (d, i) {
                                    return x(i) * 4;
                                }
                            )
                                .attr(
                                "transform", function (d, i) {
                                    return "translate(0," + x(i) + ")";
                                }
                            )
                                .selectAll(".cell")
                                .delay(
                                function (d) {
                                    return x(d.x) * 4;
                                }
                            )
                                .attr(
                                "x", function (d) {
                                    return x(d.x);
                                }
                            );

                            t.selectAll(".column")
                                .delay(
                                function (d, i) {
                                    return x(i) * 4;
                                }
                            )
                                .attr(
                                "transform", function (d, i) {
                                    return "translate(" + x(i) + ")rotate(-90)";
                                }
                            );
                        }

                        var timeout = setTimeout(
                            function () {
                                order("group");
                                d3.select("#order").property(
                                    "selectedIndex", 2
                                ).node().focus();
                            }, 5000
                        );
                    }
                );


            }
        };

        return directive_definition_object;
    }
);
