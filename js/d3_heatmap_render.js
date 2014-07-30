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
            var rows_list = [];
            var max_row_name_length = 0;
            var max_col_name_length = 0;
            var min_value = 0;
            var max_value = 0;
            var median;
            var list_of_all_values = [];

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

            var svg = d3.select("#heatmap").append("svg")
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

            var row_labels = svg.append("g")
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
                        return (
                                   rows_list.indexOf(d) + 1
                                   ) * cell_size;
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

                    }
                );

            var col_labels = svg.append("g")
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
                    .attr(
                    "y", function (d, i) {
                        return (
                                   cols_list.indexOf(d) + 1
                                   ) * cell_size;
                    }
                )
                    .style("text-anchor", "left")
                    .attr(
                    "transform", "translate(" + cell_size / 2
                        + ",-6) rotate (-90)"
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
                        d3.select(this).classed(
                            "text-hover", false
                        );
                    }
                )
                    .on(
                    "click", function (d, i) {

                    }
                );

            var heat_map = svg.append("g").attr("class", "g3")
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
                        return "cell cell-border cr" + (rows_list.indexOf(d["compound"]) - 1) +
                               " cc" + (cols_list.indexOf(d["bioactivity"]) - 1);
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
