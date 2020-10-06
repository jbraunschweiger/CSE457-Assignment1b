/*globals alert, document, d3, console*/
// These keep JSHint quiet if you're using it (highly recommended!)

changeData();

function staircase() {
    var barGraph = document.getElementById("bar1");
    var bars = barGraph.children;
    var barArray = [];

    for(i=0; i<bars.length; i++) {
        barArray[i] = bars[i];
    }

    console.log(barArray);

    barArray.sort(function(a,b){
        return Number(a.getAttribute("width")) - Number(b.getAttribute("width"));
    });

    console.log(barArray);

    var html = "";

    for(i=0; i<barArray.length; i++) {
        var element = barArray[i];
        element.setAttribute("y",String(i*10));
        html += element.outerHTML;
    }

    barGraph.innerHTML = html;

}

function update(data) {

    // D3 loads all CSV data as strings;
    // while Javascript is pretty smart
    // about interpreting strings as
    // numbers when you do things like
    // multiplication, it will still
    // treat them as strings where it makes
    // sense (e.g. adding strings will
    // concatenate them, not add the values
    // together, or comparing strings
    // will do string comparison, not
    // numeric comparison).

    // We need to explicitly convert values
    // to numbers so that comparisons work
    // when we call d3.max()
    data.forEach(function (d) {
        d.a = parseInt(d.a);
        d.b = parseFloat(d.b);
    });


    // Set up the scales
    var aScale = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) {
            return d.a;
        })])
        .range([0, 140]);
    var bScale = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) {
            return d.b;
        })])
        .range([0, 140]);
    var iScale = d3.scaleLinear()
        .domain([0, data.length])
        .range([0, 110]);
    var aScaleLine = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) {
            return d.a;
        })])
        .range([140, 0]);
    var bScaleLine = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) {
            return d.b;
        })])
        .range([140, 0]);
    
    var bScaleScatter = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) {
            return d.b;
        })])
        .range([180, 30]);

    // ****** TODO: PART III (you will also edit in PART V) ******

    // TODO: Select and update the 'a' bar chart bars
    d3.select("#bar1").selectAll("rect").remove().exit();
    d3.select("#bar1")
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class","bar")
        .attr("y",function(d, index){ return iScale(index); })
        .attr("x",0)
        .attr("width",function(d){ return aScale(d.a); })
        .attr("height", iScale(1))
        .on("mouseover", function() {
            d3.select(this).attr("class","bar-hover");
        })
        .on("mouseout", function() {
            d3.select(this).attr("class","bar");
        });
    

    // TODO: Select and update the 'b' bar chart bars

    d3.select("#bar2").selectAll("rect").remove().exit();
    d3.select("#bar2")
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class","bar")
        .attr("y",function(d, index){ return iScale(index); })
        .attr("x",0)
        .attr("width",function(d){ return bScale(d.b); })
        .attr("height", iScale(1))
        .on("mouseover", function() {
            d3.select(this).attr("class","bar-hover");
        })
        .on("mouseout", function() {
            d3.select(this).attr("class","bar");
        });

    // TODO: Select and update the 'a' line chart path using this line generator

    var aLineGenerator = d3.line()
        .x(function (d, i) {
            return iScale(i);
        })
        .y(function (d) {
            return aScaleLine(d.a);
        });
    
    d3.select("#line1").selectAll("path").remove().exit();
    d3.select("#line1")
        .append("path")
        .attr("d", aLineGenerator(data))
        .attr("class", "line");

    // TODO: Select and update the 'b' line chart path (create your own generator)

    var bLineGenerator = d3.line()
        .x(function (d, i) {
            return iScale(i);
        })
        .y(function (d) {
            return bScaleLine(d.b);
        });
    
    d3.select("#line2").selectAll("path").remove().exit();
    d3.select("#line2")
        .append("path")
        .attr("d", bLineGenerator(data))
        .attr("class", "line");


    // TODO: Select and update the 'a' area chart path using this line generator
    var aAreaGenerator = d3.area()
        .x(function (d, i) {
            return iScale(i);
        })
        .y0(130)
        .y1(function (d) {
            return aScaleLine(d.a);
        });
    
    d3.select("#area1").selectAll("path").remove().exit();
    d3.select("#area1")
        .append("path")
        .attr("d", aAreaGenerator(data))
        .attr("class", "area");

    // TODO: Select and update the 'b' area chart path (create your own generator)

    var bAreaGenerator = d3.area()
        .x(function (d, i) {
            return iScale(i);
        })
        .y0(130)
        .y1(function (d) {
            return bScaleLine(d.b);
        });
    
    d3.select("#area2").selectAll("path").remove().exit();
    d3.select("#area2")
        .append("path")
        .attr("d", bAreaGenerator(data))
        .attr("class", "area");

    // TODO: Select and update the scatterplot points

    d3.select("#scatter").selectAll("circle").remove().exit();
    d3.select("#scatter")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("cx", function(d) {
            return aScale(d.a);
        })
        .attr("cy", function(d) {
            return bScaleScatter(d.b);
        })
        .attr("class", "scatter-dot")
        .on("click", function() {
            console.log("(" + this.getAttribute("cx") + ", " + this.getAttribute("cy")+ ")");
        })
        .on('mouseover', function(d) {
            let pos = d3.select(this).node().getBoundingClientRect();
            let html = "(" + this.getAttribute("cx") + ", " + parseInt(this.getAttribute("cy")) + ")";
            d3.select('#tip')
                .style('left', `${pos['x'] - 20}px`)
                .style('top', `${(window.pageYOffset  + pos['y'] - 25)}px`)
                .html(html)
                .style("opacity", 0.8);
        })
        .on('mouseout', function(d) {
            d3.select('#tip').style("opacity", 0);
        });

    // ****** TODO: PART IV ******
}

function changeData() {
    // // Load the file indicated by the select menu
    var dataFile = document.getElementById('dataset').value;
    if (document.getElementById('random').checked) {
        randomSubset();
    }
    else{
        d3.csv('https://raw.githubusercontent.com/jbraunschweiger/CSE457-Assignment1b/master/data/' + dataFile + '.csv').then(update);
    }
}

function randomSubset() {
    // Load the file indicated by the select menu,
    // and then slice out a random chunk before
    // passing the data to update()
    var dataFile = document.getElementById('dataset').value;
    if (document.getElementById('random').checked) {
        d3.csv('https://raw.githubusercontent.com/jbraunschweiger/CSE457-Assignment1b/master/data/' + dataFile + '.csv').then(function(data) {
            var subset = [];
            data.forEach(function (d) {
                if (Math.random() > 0.5) {
                    subset.push(d);
                }
            });
            update(subset);
        });
    }
    else{
        changeData();
    }
}