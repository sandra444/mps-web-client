window.d3_heatmap_render = function (data_csv_url) {

    d3.tsv(
        data_csv_url, function (error, data) {
            data.forEach(
                function (d) {
                    d.sepalLength = +d.sepalLength;
                    d.sepalWidth = +d.sepalWidth;
                }
            );

            var padding = 20;
            var radius = 5;

            var margin = {top: 100, right: 20, bottom: 100, left: 40},
                width = 960 - margin.left - margin.right,
                height = 700 - margin.top - margin.bottom;

            var x = d3.scale.linear()
                .range([padding, width + padding])
                .domain(
                d3.extent(
                    data, function (d) {
                        return d.sepalWidth;
                    }
                )
            ).nice();

            var y = d3.scale.linear()
                .range([height - padding, padding])
                .domain(
                d3.extent(
                    data, function (d) {
                        return d.sepalLength;
                    }
                )
            ).nice();

            var color = d3.scale.category20();

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .ticks(11);

            var brush = d3.svg.brush()
                .x(x)
                .on("brush", brushmove)
                .on("brushend", brushend);

            var svg = d3.select("body").select("div").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var points, is_brushed, get_button, clear_button;

            var div = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

            svg.append("g")
                .attr("class", "x axis")
                .attr("clip-path", "url(#clip)")
                .attr(
                "transform", "translate(0," + (
                    height + padding
                    ) + ")"
            )
                .call(xAxis);

            svg.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(0," + padding + ")")
                .call(yAxis);

            svg.append("g")
                .attr("class", "brush")
                .call(brush)
                .selectAll('rect')
                .attr('height', height);

            svg.append("text")
                .attr(
                "x", (
                    width / 2
                    )
            )
                .attr(
                "y", 0 - (
                    margin.top / 4
                    )
            )
                .attr("text-anchor", "middle")
                .style("font-size", "18px")
                .style("font-weight", "bold")
                .text("Scatterplot");

            svg.append("text")
                .attr("class", "x label")
                .attr("text-anchor", "middle")
                .attr("x", width / 2)
                .attr("y", height + 55)
                .style("font-weight", "bold")
                .text("Days");

            svg.append("defs").append("clipPath")
                .attr("id", "clip")
                .append("rect")
                .attr("width", width)
                .attr("height", height + 20);

            points = svg.selectAll(".point")
                .data(data)
                .enter().append("circle")
                .attr("class", "point")
                .attr("clip-path", "url(#clip)")
                .attr("r", radius)
                .attr(
                "cx", function (d) {
                    return x(d.sepalWidth);
                }
            )
                .attr(
                "cy", function (d) {
                    return y(d.sepalLength);
                }
            )
                .style(
                "fill", function (d) {
                    return color(d.species);
                }
            )
                .on(
                "mouseover", function (d) {
                    div.transition()
                        .duration(200)
                        .style("opacity", .9);
                    div.html("Sepal Width: " + d.sepalWidth + "<br/>" + "Sepal Length: " + d.sepalLength)
                        .style(
                        "left", (
                                    d3.event.pageX
                                    ) + "px"
                    )
                        .style(
                        "top", (
                                   d3.event.pageY - 28
                                   ) + "px"
                    );
                }
            )
                .on(
                "mouseout", function (d) {
                    div.transition()
                        .duration(500)
                        .style("opacity", 0);
                }
            );

            var legend = svg.selectAll(".legend")
                .data(color.domain())
                .enter().append("g")
                .attr("class", "legend")
                .attr(
                "transform", function (d, i) {
                    return "translate(0," + i * 20 + ")";
                }
            );

            legend.append("rect")
                .attr("x", width - 18)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", color);

            legend.append("text")
                .attr("x", width - 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(
                function (d) {
                    return d;
                }
            );

            function brushmove() {
                var extent = brush.extent();
                points.classed(
                    "selected", function (d) {
                        is_brushed = extent[0] <= d.index && d.index <= extent[1];
                        return is_brushed;
                    }
                );
            }

            function brushend() {
                get_button = d3.select(".clear-button");
                if (get_button.empty() === true) {
                    clear_button = svg.append('text')
                        .attr("y", 460)
                        .attr("x", 825)
                        .attr("class", "clear-button")
                        .text("Clear Brush");
                }

                x.domain(brush.extent());

                transition_data();
                reset_axis();

                points.classed("selected", false);
                d3.select(".brush").call(brush.clear());

                clear_button.on(
                    'click', function () {
                        x.domain(
                            d3.extent(
                                data, function (d) {
                                    return d.sepalWidth;
                                }
                            )
                        ).nice();
                        transition_data();
                        reset_axis();
                        clear_button.remove();
                    }
                );
            }

            function transition_data() {
                svg.selectAll(".point")
                    .data(data)
                    .transition()
                    .duration(500)
                    .attr(
                    "cx", function (d) {
                        return x(d.sepalWidth);
                    }
                );
            }

            function reset_axis() {
                svg.transition().duration(500)
                    .select(".x.axis")
                    .call(xAxis);
            }
        }
    );
}
