mdscolumnOrder = []
mdsXcords = []
mdsYcords = []
mdscolumns = []
mdscolumnIndex = []
mdsflag = true;
mdsOriginalPCPdata = [];
mdsOriginalPCPcolumns = [];
mdsOriginalPCPcategories = [];
mdsOriginalPCPkmeans = [];

function mdsEuclidianplotgeneration(dataX, dataY, kmeans) {
    var svg = d3.select(".mdseuclidiansvg"),
        margin = 200,
        width = svg.attr("width") - margin,
        height = svg.attr("height") - margin
    svg.selectAll("g > *").remove();
    svg.selectAll("circle").remove();
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
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
        .append("text")
        .attr("y", height - 385)
        .attr("x", width - 100)
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .text("First Dimension");

    g.append("g")
        .call(d3.axisLeft(yScale))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "-5.1em")
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .text("Second Dimension");

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
        })
        .attr('fill', function(d, i) {
            return colorRoll(kmeans[i]);
        });;
}


function mdsPrecomputedplotgeneration(dataX, dataY, kmeans, columns) {
    mdscolumnOrder = []
    mdscolumnIndex = []
    mdsXcords = []
    mdsYcords = []
    mdscolumns = columns
    var svg = d3.select(".mdsprecomputedsvg"),
        margin = 200,
        width = svg.attr("width") - margin,
        height = svg.attr("height") - margin
    svg.selectAll("g > *").remove();

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
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
        .append("text")
        .attr("y", height - 260)
        .attr("x", width - 100)
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .text("First Dimension");

    g.append("g")
        .call(d3.axisLeft(yScale))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "-5.1em")
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .text("Second Dimension");

    var scatterDatatotal = dataX.map((item, index) => { return [item, dataY[index]] });

    g.selectAll(".circle")
        .data(scatterDatatotal)
        .enter().append("circle")
        .attr("r", function(d) { return 5; })
        .attr("fill", "red")
        .attr("cx", function(d) {
            mdsXcords.push(xScale(d[0]));
            return xScale(d[0]);
        })
        .attr("cy", function(d) {
            mdsYcords.push(yScale(d[1]));
            return yScale(d[1]);
        })
        .call(d3.drag()
            .on("start", mdsdragstart)
            .on("drag", mdsdragged)
            .on("end", mdsdragended)
        );

    g.selectAll(".text")
        .data(scatterDatatotal)
        .enter()
        .append("text")
        .style("font-size", "14px")
        .attr("text-anchor", "end")
        .attr("x", function(d, i) {
            return xScale(d[0]) - 5;
        })
        .attr("y", function(d, i) {
            return yScale(d[1]);
        })
        .attr("stroke", "black")
        .text(function(d, i) {
            return columns[i];
        });
}

function mdsdragstart(d) {
    if (mdsflag) {
        mdsOriginalPCPdata = data;
        mdsOriginalPCPcolumns = columns;
        mdsOriginalPCPcategories = categories;
        mdsOriginalPCPkmeans = kmeans;
        mdsflag = false;
    }

    for (var i = 0; i < mdsXcords.length; i++) {
        if (((mdsXcords[i] + 5) > d3.event.x) && ((mdsXcords[i] - 5) < d3.event.x) && ((mdsYcords[i] - 5) < d3.event.y) && ((mdsYcords[i] + 5) > d3.event.y)) {
            if (!mdscolumnIndex.includes(i)) {
                mdscolumnOrder.push(mdscolumns[i]);
                mdscolumnIndex.push(i);
            }
        }
    }
    var corr = d3.select(".mdsprecomputedsvg").append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")")
        .attr("class", "corrLabel");
    d3.selectAll(".corrLabel").selectAll("text").remove();
    for (var i = 0; i < mdscolumnIndex.length; i++) {
        corr.append("text")
            .style("font-size", "14px")
            .attr("text-anchor", "end")
            .attr("x", mdsXcords[mdscolumnIndex[i]] + 15)
            .attr("y", mdsYcords[mdscolumnIndex[i]])
            .attr("stroke", "black")
            .text(i + 1);
    }

    mdsPCPdata = [];
    mdsPCPcolumns = [];
    mdsPCPcategories = [];
    mdsPCPkmeans = [];
    for (var i = 0; i < mdsOriginalPCPcategories.length; i++) {
        if (mdsOriginalPCPcategories[i] == "cat") {
            mdsPCPcategories.push(mdsOriginalPCPcategories[i]);
            mdsPCPdata.push(mdsOriginalPCPdata[i]);
            mdsPCPcolumns.push(mdsOriginalPCPcolumns[i]);
        }
    }
    for (var i = mdscolumnIndex.length - 1; i >= 0; i--) {
        mdsPCPdata.unshift(mdsOriginalPCPdata[mdsOriginalPCPcolumns.indexOf(mdscolumnOrder[i])]);
        mdsPCPcategories.unshift(mdsOriginalPCPcategories[mdsOriginalPCPcolumns.indexOf(mdscolumnOrder[i])]);
        mdsPCPcolumns.unshift(mdscolumnOrder[i]);
    }
    console.log(mdsPCPdata);
    console.log(mdsPCPcategories);
    console.log(mdsPCPcolumns);
    showPCPPlotD3(mdsPCPdata, kmeans, mdsPCPcolumns, mdsPCPcategories)
}

function mdsdragged(d) {

}

function mdsdragended(d) {

}