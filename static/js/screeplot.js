function screeplot(dataTot, dataCumSum) {
    var svg = d3.select(".screesvg"),
        margin = 200,
        width = svg.attr("width") - margin,
        height = svg.attr("height") - margin;

    var g = svg.append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");
    svg.selectAll("g > *").remove()

    var xVal = dataTot.map((item) => { return item[0] });
    var yVal = dataTot.map((item) => { return item[1] });

    var yValCumSum = dataCumSum.map((item) => { return item[1] });

    var xScale = d3.scaleBand().range([0, width]).padding(0.5),
        yScale = d3.scaleLinear().range([height, 0]);

    xScale.domain(xVal);
    yScale.domain([0, d3.max(yValCumSum)]);

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
        .append("text")
        .attr("y", 30)
        .attr("x", width - 75)
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .text("Dimensions");


    g.append("g")
        .call(d3.axisLeft(yScale).tickFormat(function(d) {
                return d;
            })
            .ticks(10))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "-5.1em")
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .text("Eigen Values");

    var rect = g.selectAll("rect")
        .data(xVal)
        .enter().append("rect")
        .attr("id", function(d) { return "rect" + d })
        .attr("x", function(d) { return xScale(d); })
        .attr("y", function(d) { return yScale(yVal[xVal.indexOf(d)]); })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) { return height - yScale(yVal[xVal.indexOf(d)]) })
        .attr('fill', '#022c7a')
        .on("click", function() {
            g.selectAll("rect")
                .attr("fill", '#022c7a');
            d3.select(this)
                .attr("fill", "green");

            g.selectAll("circle")
                .attr("fill", "red")
                .attr("r", 10);
            d3.select("#circle" + d3.select(this).data()[0])
                .attr("fill", '#022c7a')
                .attr("r", 20);
            showScatterMatrix(d3.select(this).data()[0])
        });



    g.append("path")
        .datum(xVal)
        .attr("fill", "none")
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 4)
        .attr("d", d3.line()
            .x(function(d) { return xScale(d) + xScale.bandwidth() / 2 })
            .y(function(d) { return yScale(yValCumSum[xVal.indexOf(d)]) })
        )

    // Add the line
    g.selectAll("circle")
        .data(xVal)
        .enter()
        .append("circle")
        .attr("fill", "red")
        .attr("id", function(d) { return "circle" + d })
        .attr("stroke", "none")
        .attr("cx", function(d) { return xScale(d) + xScale.bandwidth() / 2 })
        .attr("cy", function(d) { return yScale(yValCumSum[xVal.indexOf(d)]) })
        .attr("r", 10)
        .on("click", function() {
            g.selectAll("rect")
                .attr("fill", '#022c7a');
            g.selectAll("circle")
                .attr("fill", "red")
                .attr("r", 10);
            d3.select(this)
                .attr("fill", '#022c7a')
                .attr("r", 20);
            d3.select("#rect" + d3.select(this).data()[0])
                .attr("fill", "green")
                .attr("r", 20);
            showScatterMatrix(d3.select(this).data()[0])
        })

}