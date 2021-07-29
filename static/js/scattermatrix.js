function scattermatrix(values, columns, kmeans) {
    for (var i = 0; i < columns[0].length; i++) {
        columns[0][i] = parseInt(columns[0][i])
    }
    var svg = d3.select(".scattersvg"),
        margin = 200,
        padding = 20,
        n = columns[0].length,
        width = svg.attr("width") - margin,
        height = svg.attr("height") - margin;
    svg.selectAll("g > *").remove();
    for (var i = 0; i < values.length; i++) {
        for (var j = 0; j < values.length; j++) {
            scatterDataX = values[i]
            scatterDataY = values[j]
            var xScale, yScale;
            xScale = d3.scaleLinear().domain([0, 1.1 * d3.max(scatterDataX)]).range([0, width / n]);
            yScale = d3.scaleLinear().domain([0, 1.1 * d3.max(scatterDataY)]).range([height / n, 0]);

            matX = 100 + (i * 300)
            matY = 100 + (j * 125)
            var g = svg.append("g")
                .attr("transform", "translate(" + matX + "," + matY + ")");
            if (j == n - 1) {
                g.append("g")
                    .attr("transform", "translate(0," + height / n + ")")
                    .attr("class", "axis axis--x")
                    .call(d3.axisBottom(xScale).tickSize(-height / n).ticks(10))
                    .append("text")
                    .attr("y", height / n - 75)
                    .attr("x", width / n - 100)
                    .attr("text-anchor", "end")
                    .attr("stroke", "black")
                    .text(columns[1][i])
            } else {
                g.append("g")
                    .attr("transform", "translate(0," + height / n + ")")
                    .attr("class", "axis axis--x")
                    .call(d3.axisBottom(xScale).tickSize(-height / n).tickFormat('').ticks(10));
            }

            if (i == 0) {
                g.append("g")
                    .call(d3.axisLeft(yScale).tickSize(-width / n).ticks(10))
                    .attr("class", "axis axis--y")
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", "-4.1em")
                    .attr("text-anchor", "end")
                    .attr("stroke", "black")
                    .text(columns[1][j]);
            } else {
                g.append("g")
                    .attr("class", "axis axis--y")
                    .call(d3.axisLeft(yScale).tickSize(-width / n).tickFormat('').ticks(10));
            }

            var scatterDatatotal = scatterDataX.map((item, index) => { return [item, scatterDataY[index]] });

            g.selectAll(".circle")
                .data(scatterDatatotal)
                .enter().append("circle")
                .attr("r", function(d) { return 1.5; })
                .attr("cx", function(d) {
                    return xScale(d[0]);
                })
                .attr("cy", function(d) {
                    return yScale(d[1]);
                })
                .attr('fill', function(d, i) {
                    return colorRoll(kmeans[i]);
                });
        }
    }
}

function make_x_gridlines() {
    return d3.axisBottom(x)
        .ticks(5)
}

// gridlines in y axis function
function make_y_gridlines() {
    return d3.axisLeft(y)
        .ticks(5)
}