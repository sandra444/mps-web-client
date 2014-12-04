window.d3_cluster_render = function (cluster_data_json, bioactivities, compounds) {

    var width = $("#cluster").width(),
        height = 2000;

    var cluster = d3.layout.cluster()
        .size([height, width - 160]);

    var diagonal = d3.svg.diagonal()
        .projection(function (d) {
            return [d.y, d.x];
        });

    var svg = d3.select("#cluster").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(40,0)");

    var root = cluster_data_json;

    var nodes = cluster.nodes(root),
        links = cluster.links(nodes);

    var link = svg.selectAll(".link")
        .data(links)
        .enter().append("path")
        .attr("class", "link")
        .attr("d", diagonal);

    var node = svg.selectAll(".node")
        .data(nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("id", function (d) {
            return d.name.replace(/\s/g, "");
        })
        .attr("transform", function (d) {
            return "translate(" + d.y + "," + d.x + ")";
        });

    node.append("circle")
        .attr("r", 4.5);
        
    node.on("mouseover", function (d) {
        var recurse = function(node) {
            // Change the class to selected node
            $('#'+node.name.replace(/\s/g, "")).attr('class', 'node-s');
            
            // Stop at leaves
            if (!node.children) {
                return;
            }
            // For nodes with children
            else {
                for (var child in node.children) {
                    recurse(node.children[child]);    
                }
            }
        }
        recurse(d);
    });
    
    node.on("mouseout", function (d) {
        node.attr("class", "node");
    });
    
    // Spawn compound info (compounds is prepopulated HTML from the Python Parser!)
    node.on("click", function (d) {
        if (compounds[d.name]){
            $('#compound').html(compounds[d.name]);
        }
    });

    //Titles for hovering
    node.append("title")
        .text(function (d) {
            return d.name.indexOf("\n") > -1 ? "" : d.name;
    });

    node.append("text")
        .attr("dx", function (d) {
            return d.children ? -8 : 8;
        })
        .attr("dy", 3)
        .style("text-anchor", function (d) {
            return d.children ? "end" : "start";
        })
        .text(function (d) {
            return d.name.indexOf("\n") > -1 ? "" : d.name;
        });

    d3.select(self.frameElement).style("height", height + "px");
    
    // Display the original query in terms of what bioactivity-target pairs were used
    var query = "<div style='width: 100%;height: 600px !important;overflow: scroll;'><table class='table table-striped'><thead><tr><td><b>Target</b></td><td><b>Bioactivity</b></td></tr></thead>";
    
    for (var i in bioactivities){
        bioactivity = bioactivities[i].split('_');
        query += "<tr><td>"+bioactivity[0]+"</td><td>"+bioactivity[1]+"</td></tr>";        
    }
    
    query += "</table></div>";
    
    $('#query').html(query);
    
    $('#compound').html('<div id="com" class="thumbnail text-center affix">Click a node or compound name to view additional information</div>');
    
    $(function () {
        $(document).on("click", function (e) {
            if (e.target.id == "X") {
                $("#com").remove();
                e.stopPropagation();
                return false;
            }
        });
    });
}