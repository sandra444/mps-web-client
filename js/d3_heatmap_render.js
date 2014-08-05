
window.d3_heatmap_render = function (heatmap_data_csv) {

    var margin = { top: 650, right: 50, bottom: 50, left: 125 };
    var cell_size = 10;
    var legend_element_width = cell_size * 3;
    var legend_element_height = cell_size;

    var colors = [
        '#008000', '#1A8C00', '#339800', '#4DA400', '#66B000',
        '#80BC00',
        '#99C800', '#B3D400', '#CCE000', '#E6EC00', '#FFFF00',
        '#F3E600',
        '#E7CC00', '#DBB300', '#CF9900', '#C38000', '#B76600',
        '#AB4D00',
        '#9F3300', '#931A00', '#870000'
    ];

    d3.csv(
        heatmap_data_csv,
        function (d) {
            return {
                compound: d.compound,
                bioactivity: d.bioactivity,
                value: +d.value  /* + converts string to number */
            };
        },
        function (error, data) {

            var i;
            var cols_list = [];
            var cols_list_original;
            var rows_list = [];
            var rows_list_original;
            var max_row_name_length = 0;
            var max_col_name_length = 0;
            var min_value = 0;
            var max_value = 0;
            var median;
            var list_of_all_values = [];

            function sort_rows_on_columns(col_name) {
                var i;
                var j;
                var new_row_order = [];

                for(j = 0; j < rows_list.length; j += 1) {
                    for (i = 0; i < data.length; i += 1) {
                        if (data[i]["bioactivity"] === col_name
                            && data[i]["compound"] === rows_list[j]) {
                            new_row_order.push(
                                [
                                    data[i]["value"],
                                    data[i]["compound"]
                                ]
                            );
                        }
                    }
                }

                new_row_order.sort(
                    function(first, next) {

                        // note: sorting direction greatest to smallest this way
                        if (first[0] < next[0]) {
                            return 1;
                        }
                        if (first[0] > next[0]) {
                            return -1;
                        }
                        return 0;
                    }
                );

                // now we begin to build the final array
                var temp_rows_list = [];

                // left to right add columns in order of value from greatest to least

                for (i = 0; i < new_row_order.length; i += 1) {
                    temp_rows_list.push(new_row_order[i][1]);
                }

                // left to right add columns in alphabetical order
                // for elements where there is no data
                rows_list.sort();

                // whatever isn't in the first part goes to the back of the array
                // where we don't care about the order of the undefined elements
                for (i = 0; i <= rows_list.length; i += 1) {
                    if (temp_rows_list.indexOf(rows_list[i]) === -1) {
                        temp_rows_list.push(rows_list[i]);
                    }
                }

                rows_list = temp_rows_list;

            }

            function sort_columns_on_row(row_name) {
                var i;
                var j;
                var new_column_order = [];

                for(j = 0; j < cols_list.length; j += 1) {
                    for (i = 0; i < data.length; i += 1) {
                        if (data[i]["compound"] === row_name
                            && data[i]["bioactivity"] === cols_list[j]) {
                            new_column_order.push(
                                [
                                    data[i]["value"],
                                    data[i]["bioactivity"]
                                ]
                            );
                        }
                    }
                }

                new_column_order.sort(
                    function(first, next) {

                        // note: sorting direction greatest to smallest this way
                        if (first[0] < next[0]) {
                            return 1;
                        }
                        if (first[0] > next[0]) {
                            return -1;
                        }
                        return 0;
                    }
                );

                // now we begin to build the final array
                var temp_cols_list = [];

                // left to right add columns in order of value from greatest to least

                for (i = 0; i < new_column_order.length; i += 1) {
                    temp_cols_list.push(new_column_order[i][1]);
                }

                // left to right add columns in alphabetical order
                // for elements where there is no data
                cols_list.sort();

                // whatever isn't in the first part goes to the back of the array
                // where we don't care about the order of the undefined elements
                for (i = 0; i <= cols_list.length; i += 1) {
                    if (temp_cols_list.indexOf(cols_list[i]) === -1) {
                        temp_cols_list.push(cols_list[i]);
                    }
                }

                cols_list = temp_cols_list;

            }

            function update_all() {
                render_main_svg();
                render_row_labels();
                render_col_labels();
                render_heatmap();
            }

            for (i = 0; i < data.length; i += 1) {
                var current_bioactivity = data[i]["bioactivity"];
                var current_compound = data[i]["compound"];
                if (cols_list.indexOf(current_bioactivity) === -1) {
                    cols_list.push(current_bioactivity);
                    if (current_bioactivity.length >= max_col_name_length) {
                        max_col_name_length = current_bioactivity.length;
                    }
                }
                if (rows_list.indexOf(current_compound) === -1) {
                    rows_list.push(current_compound);
                    if (current_compound.length >= max_row_name_length) {
                        max_row_name_length = current_compound.length;
                    }
                }
                if (min_value > data[i]["value"]) {
                    min_value = data[i]["value"];
                }
                if (max_value < data[i]["value"]) {
                    max_value = data[i]["value"];
                }
                list_of_all_values.push(data[i]["value"]);
            }

            // alphabetically sort row and column labels
            rows_list = rows_list.sort();
            cols_list = cols_list.sort();

            // archive the original arrays in their respective copy of '_original'
            rows_list_original = rows_list.slice(0);
            cols_list_original = cols_list.slice(0);

            min_value -= min_value * 0.1;
            max_value += max_value * 0.1;
            median = d3.median(list_of_all_values);

            var char_pixels_width = 8;
            margin.top = char_pixels_width * max_col_name_length;
            margin.left = char_pixels_width * max_row_name_length;

            var width = cell_size * cols_list.length;
            var height = cell_size * rows_list.length;

            var color_scale = d3.scale.quantile()
                .domain([min_value , median, max_value])
                .range(colors);

            var svg;

            var render_main_svg = function () {

                // remove old svg canvas rendering
                d3.select("svg").remove();

                svg = d3.select("#heatmap").append("svg")
                    .attr(
                    "width", width + margin.left + margin.right
                )
                    .attr(
                    "height", height + margin.top + margin.bottom
                )
                    .append("g")
                    .attr(
                    "transform",
                    "translate(" +
                    margin.left + "," + margin.top
                        + ")"
                );
            };

            render_main_svg();

            var render_row_labels = function () {

                svg.append("g")
                    .selectAll(".row_labelg")
                    .data(rows_list)
                    .enter()
                    .append("text")
                    .text(
                    function (d) {
                        return d;
                    }
                )
                    .attr("x", 0)
                    .attr(
                    "y", function (d, i) {
                        return (rows_list.indexOf(d) + 1) * cell_size;
                    }
                )
                    .style("text-anchor", "end")
                    .attr(
                    "transform",
                    "translate(-6," + cell_size / 1.5 + ")"
                )
                    .attr(
                    "class", function (d, i) {
                        return "row_label mono r" + i;
                    }
                )
                    .on(
                    "mouseover", function (d) {
                        d3.select(this).classed("text-hover", true);
                    }
                )
                    .on(
                    "mouseout", function (d) {
                        d3.select(this).classed(
                            "text-hover", false
                        );
                    }
                )
                    .on(
                    "click", function (d, i) {

                        sort_columns_on_row(d);
                        update_all(d);

                    }
                );
            };

            render_row_labels();

            var render_col_labels = function () {
                svg.append("g")
                    .selectAll(".col_labelg")
                    .data(cols_list)
                    .enter()
                    .append("text")
                    .text(
                    function (d) {
                        return d;
                    }
                )
                    .attr("x", 0)
                    .attr("y", function (d, i) {
                              return (cols_list.indexOf(d) + 1) * cell_size;
                          }
                )
                    .style("text-anchor", "left")
                    .attr(
                    "transform", "translate(" + cell_size / 2 + ",-6) rotate (-90)"
                )
                    .attr(
                    "class", function (d, i) {
                        return "col_label mono c" + i;
                    }
                )
                    .on(
                    "mouseover", function (d) {
                        d3.select(this).classed("text-hover", true);
                    }
                )
                    .on(
                    "mouseout", function (d) {
                        d3.select(this).classed("text-hover", false);
                    }
                )
                    .on(
                    "click", function (d, i) {

                        sort_rows_on_columns(d);
                        update_all(d);

                    }
                );
            };

            render_col_labels();

            var render_heatmap = function () {
                svg.append("g").attr("class", "g3")
                    .selectAll(".cellg")
                    .data(
                    data, function (d) {
                        return d["compound"] + ": " + d["bioactivity"];
                    }
                )
                    .enter()
                    .append("rect")
                    .attr(
                    "x", function (d) {
                        return (cols_list.indexOf(d["bioactivity"]) + 1) * cell_size;
                    }
                )
                    .attr(
                    "y", function (d) {
                        return (rows_list.indexOf(d["compound"]) + 1) * cell_size;
                    }
                )
                    .attr(
                    "class", function (d) {
                        return "cell cell-border cr" + (
                            rows_list.indexOf(d["compound"]) - 1 ) + " cc" + (  cols_list.indexOf(d["bioactivity"]) - 1);
                    }
                )
                    .attr("width", cell_size)
                    .attr("height", cell_size)
                    .style(
                    "fill", function (d) {
                        return color_scale(d.value);
                    }
                )
                    .on(
                    "click", function (d) {

                    }
                )
                    .on(
                    "mouseover", function (d) {
                        //highlight text
                        d3.select(this).classed("cell-hover", true);
                        d3.selectAll(".row_label").classed(
                            "text-highlight", function (r, ri) {
                                return ri == (
                                    rows_list.indexOf(d["compound"])
                                    );
                            }
                        );
                        d3.selectAll(".col_label").classed(
                            "text-highlight", function (c, ci) {
                                return ci == (
                                    cols_list.indexOf(d["bioactivity"])
                                    );
                            }
                        );

                    }
                )
                    .on(
                    "mouseout", function () {
                        d3.select(this).classed(
                            "cell-hover", false
                        );
                        d3.selectAll(".row_label").classed(
                            "text-highlight", false
                        );
                        d3.selectAll(".col_label").classed(
                            "text-highlight", false
                        );
                    }
                );
            };

            render_heatmap();

            var svg_legend = d3.select("#heatmap_legend").append("svg")
                .attr(
                "width", legend_element_width * 21
            )
                .attr(
                "height", cell_size * 4
            )
                .append("g");

            var legend = svg_legend.selectAll(".legend")
                .data(
                [
                    -10, -9, -8, -7, -6, -5, -4, -3, -2,
                    -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
                ]
            )
                .enter().append("g")
                .attr("class", "legend");

            legend.append("rect")
                .attr(
                "x", function (d, i) {
                    return legend_element_width * i;
                }
            )
                .attr(
                "y", 0
            )
                .attr("width", legend_element_width)
                .attr("height", legend_element_height)
                .style(
                "fill", function (d, i) {
                    return colors[i];
                }
            );

            legend.append("text")
                .attr("class", "mono")
                .text(
                function (d) {
                    return d;
                }
            )
                .attr("width", legend_element_width)
                .attr(
                "x", function (d, i) {
                    return legend_element_width * i;
                }
            )
                .attr(
                "y", legend_element_height * 2
            );

        }
    );
}
