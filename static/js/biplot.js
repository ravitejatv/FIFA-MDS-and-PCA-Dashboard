function biplotgeneration(eigenVectors, dataX, dataY, columns) {

    var svg = d3.select(".biplotsvg"),
        margin = 200,
        width = svg.attr("width") - margin,
        height = svg.attr("height") - margin
    svg.selectAll("g > *").remove();
    svg.selectAll("line").remove();
    var xScale, yScale;
    if (Math.abs(d3.min(dataX)) < Math.abs(d3.max(dataX)))
        xScale = d3.scaleLinear().domain([-1.1 * Math.abs(d3.max(dataX)), 1.1 * Math.abs(d3.max(dataX))]).range([0, width]);
    else
        xScale = d3.scaleLinear().domain([-1.1 * Math.abs(d3.min(dataX)), 1.1 * Math.abs(d3.min(dataX))]).range([0, width]);

    if (Math.abs(d3.min(dataY)) < Math.abs(d3.max(dataY)))
        yScale = d3.scaleLinear().domain([-1.1 * Math.abs(d3.max(dataY)), 1.1 * Math.abs(d3.max(dataY))]).range([height, 0]);
    else
        yScale = d3.scaleLinear().domain([-1.1 * Math.abs(d3.min(dataY)), 1.1 * Math.abs(d3.min(dataY))]).range([height, 0]);

    var g = svg.append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");

    g.append("g")
        .attr("transform", "translate(0," + height / 2 + ")")
        .call(d3.axisBottom(xScale))
        .append("text")
        .attr("y", height - 400)
        .attr("x", width - 50)
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .text("PC1");

    g.append("g")
        .attr("transform", "translate(" + width / 2 + ",0)")
        .call(d3.axisLeft(yScale))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "-5.1em")
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .text("PC2");

    var scatterDatatotal = dataX.map((item, index) => { return [item, dataY[index]] });

    g.selectAll(".circle")
        .data(scatterDatatotal)
        .enter().append("circle")
        .attr("r", function(d) { return 1.5; })
        .attr("cx", function(d) {
            return xScale(d[0]);
        })
        .attr("cy", function(d) {
            return yScale(d[1]);
        });

    var line = g.selectAll(".line")
        .data(eigenVectors)
        .enter()
        .append('line')
        .style("stroke", function(d, i) {
            return colorRoll(i);
        })
        .style("stroke-width", 5)
        .attr("x1", 0 + width / 2)
        .attr("y1", 0 + height / 2)
        .attr("x2", function(d) {
            return xScale(d[0]);
        })
        .attr("y2", function(d) {
            return yScale(d[1]);
        });

    g.selectAll(".text")
        .data(eigenVectors)
        .enter()
        .append("text")
        .attr("text-anchor", "end")
        .attr("x", function(d, i) {
            return xScale(d[0]);
        })
        .attr("y", function(d, i) {
            return yScale(d[1]);
        })
        .attr("stroke", "black")
        .text(function(d, i) {
            return columns[i];
        });;;

}