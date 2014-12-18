window.d3_cluster_render = function (cluster_data_json, bioactivities, compounds) {

    var height = null;
    var find = Object.keys(compounds).length;
    
    if (find < 11) {
        height = 600;   
    }
    else if (find < 20) {
        height = 800;   
    }
    else if (find < 50) {
        height = 1000;   
    }
    else if (find < 80) {
        height = 1600;   
    }
    else {
        height = 2000; 
    }
    
    var width = $("#cluster").width();

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
    
    node.on("click", function (d) {
        $('#compound').html("");
        var names = d.name.split('\n');
        var box = "";
        for (var i  in names){
            if (compounds[names[i]]){
                var com = compounds[names[i]];
                var box = box = "<div id='com" + i + "' class='thumbnail text-center'>"
                box += '<button id="X' + i + '" type="button" class="btn-xs btn-danger">X</button>'
                box += "<img src='https://www.ebi.ac.uk/chembldb/compound/displayimage/"+ com.CHEMBL + "' class='img-polaroid'>"
                box += "<strong>" + com.name + "</strong><br>"
                box += "Known Drug: "
                box += com.knownDrug ? "<span class='glyphicon glyphicon-ok'></span><br>" : "<span class='glyphicon glyphicon-remove'></span><br>"
                box += "Passes Rule of 3: "
                box += com.ro3 ? "<span class='glyphicon glyphicon-ok'></span><br>" : "<span class='glyphicon glyphicon-remove'></span><br>"
                box += "Rule of 5 Violations: " + com.ro5 + "<br>"
                box += "Species: " + com.species
                box += "</div>" 
                $('#compound').prepend(box);
            }
            // Break at 10
            if (i >= 9){
                break;    
            }
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
    
    $('#compound').html('<div id="com" class="thumbnail text-center">Click a node or compound name to view additional information</div>');
    
    $(function () {
        $(document).on("click", function (e) {
            if (e.target.id.indexOf("X") > -1) {
                var num = e.target.id.replace( /^\D+/g, '');
                $("#com" + num).remove();
                e.stopPropagation();
                return false;
            }
        });
    });
}