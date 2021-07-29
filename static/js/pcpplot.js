var yScales = [];
var data = [];
var pcpDatatotal = [];
var columns = [];
var categories = [];
var kmeans = [];
var initialX = 0;
var padding = 80;
var svg = d3.select(".pcpsvg"),
    margin = 50,
    width = svg.attr("width") - margin,
    height = svg.attr("height") - margin;

function drawPCPLines() {
    for (var i = 0; i < pcpDatatotal.length - 1; i++) {
        for (var j = 0; j < yScales.length - 1; j++) {
            matX = yScales[j][1]
            matDiff = yScales[j + 1][1] - yScales[j][1];
            var g = svg.append("g")
                .attr("transform", "translate(" + matX + "," + 30 + ")");
            g.append('line')
                .style("stroke", function() {
                    return colorRoll(kmeans[i]);
                })
                .attr("class", "x" + j + "y" + (j + 1))
                .style("stroke-width", 1)
                .attr("x1", 0)
                .attr("y1", function() {
                    if (categories[j] === 'cat')
                        return yScales[j][0](pcpDatatotal[i][j]) + yScales[j][0].bandwidth() / 2;
                    else
                        return yScales[j][0](pcpDatatotal[i][j]);
                })
                .attr("x2", matDiff)
                .attr("y2", function() {
                    if (categories[j + 1] === 'cat')
                        return yScales[j + 1][0](pcpDatatotal[i][j + 1]) + yScales[j + 1][0].bandwidth() / 2;
                    else
                        return yScales[j + 1][0](pcpDatatotal[i][j + 1]);
                });
        }
    }
}


function drawPCPSeperateLines(pcpDatatotal, kmeans, categories, before, after) {
    for (var i = 0; i < pcpDatatotal.length - 1; i++) {
        if (before != -1) {
            j = before;
            matX = yScales[j][1]
            matDiff = yScales[j + 1][1] - yScales[j][1];
            var g = svg.append("g")
                .attr("transform", "translate(" + matX + "," + 30 + ")");
            g.append('line')
                .style("stroke", function() {
                    return colorRoll(kmeans[i]);
                })
                .attr("class", "x" + j + "y" + (j + 1))
                .style("stroke-width", 1)
                .attr("x1", 0)
                .attr("y1", function() {
                    if (categories[j] === 'cat')
                        return yScales[j][0](pcpDatatotal[i][j]) + yScales[j][0].bandwidth() / 2;
                    else
                        return yScales[j][0](pcpDatatotal[i][j]);
                })
                .attr("x2", matDiff)
                .attr("y2", function() {
                    if (categories[j + 1] === 'cat')
                        return yScales[j + 1][0](pcpDatatotal[i][j + 1]) + yScales[j + 1][0].bandwidth() / 2;
                    else
                        return yScales[j + 1][0](pcpDatatotal[i][j + 1]);
                });
        }
        if (after != -1) {
            j = after - 1;
            matX = yScales[j][1]
            matDiff = yScales[j + 1][1] - yScales[j][1];
            var g = svg.append("g")
                .attr("transform", "translate(" + matX + "," + 30 + ")");
            g.append('line')
                .style("stroke", function() {
                    return colorRoll(kmeans[i]);
                })
                .attr("class", "x" + j + "y" + (j + 1))
                .style("stroke-width", 1)
                .attr("x1", 0)
                .attr("y1", function() {
                    if (categories[j] === 'cat')
                        return yScales[j][0](pcpDatatotal[i][j]) + yScales[j][0].bandwidth() / 2;
                    else
                        return yScales[j][0](pcpDatatotal[i][j]);
                })
                .attr("x2", matDiff)
                .attr("y2", function() {
                    if (categories[j + 1] === 'cat')
                        return yScales[j + 1][0](pcpDatatotal[i][j + 1]) + yScales[j + 1][0].bandwidth() / 2;
                    else
                        return yScales[j + 1][0](pcpDatatotal[i][j + 1]);
                });
        }
    }
}


function drawPCPLabels() {
    for (var i = 0; i < data.length; i++) {
        //console.log(data)
        var g = svg.append("g")
            .attr("transform", "translate(" + yScales[i][1] + "," + 30 + ")");
        g.append("g")
            .call(d3.axisLeft(yScales[i][0]))
            .call(d3.drag()
                .on("start", dragstart)
                .on("drag", dragged)
                .on("end", dragended)
            )
            .attr("class", i)
            .append("text")
            .attr("y", 6)
            .attr("dy", "-1.5em")
            .attr("text-anchor", "end")
            .attr("stroke", "black")
            .text(columns[i]);
    }
}

function brushended(d) {

}


function showPCPPlotD3(data1, kmeans1, columns1, categories1) {
    svg.selectAll("g > *").remove();
    svg.selectAll("line").remove();
    yScales = [];
    data = [];
    pcpDatatotal = [];
    columns = [];
    categories = [];
    kmeans = [];
    data = data1;
    columns = columns1;
    categories = categories1;
    kmeans = kmeans1;
    for (var i = 0; i < data.length; i++) {
        var category = categories[i]
        matX = 100 + (i * padding)
        if (category === "num")
            yScale = d3.scaleLinear().domain([0, 1.1 * d3.max(data[i])]).range([height, 0]);
        else if (category === "cat") {
            yScale = d3.scaleBand().range([height, 0]);
            yScale.domain(data[i]);
        }
        yScales.push([yScale, matX]);
    }
    drawPCPLabels();
    for (var i = 0; i < data[0].length; i++) {
        pcpDatatotal.push([data[0][i]])
    }
    for (var i = 0; i < pcpDatatotal.length; i++) {
        for (var j = 1; j < data.length; j++) {
            pcpDatatotal[i].push(data[j][i])
        }
    }
    drawPCPLines();
}


function dragstart(d) {
    ind = d3.select(this.parentNode).select("g").attr("class");
    initialX = yScales[parseInt(ind)][1];
    if (parseInt(ind) == 0)
        d3.selectAll(".x" + parseInt(ind) + "y" + (parseInt(ind) + 1)).remove();
    else if (parseInt(ind) == yScales.length - 1)
        d3.selectAll(".x" + (parseInt(ind) - 1) + "y" + parseInt(ind)).remove();
    else {
        d3.selectAll(".x" + (parseInt(ind) - 1) + "y" + parseInt(ind)).remove();
        d3.selectAll(".x" + parseInt(ind) + "y" + (parseInt(ind) + 1)).remove();
    }

}

function dragged(d) {
    ind = d3.select(this.parentNode).select("g").attr("class");

    if (d3.event.x > padding) {
        indi = parseInt(ind)
        temp = yScales[indi];
        yScales[indi] = yScales[indi + 1];
        yScales[indi + 1] = temp;
        yScales[indi][1] = 100 + indi * padding
        yScales[indi + 1][1] = 100 + (indi + 1) * padding
        temp = data[indi];
        data[indi] = data[indi + 1];
        data[indi + 1] = temp;

        for (var i = 0; i < pcpDatatotal.length - 1; i++) {
            temp = pcpDatatotal[i][indi];
            pcpDatatotal[i][indi] = pcpDatatotal[i][indi + 1];
            pcpDatatotal[i][indi + 1] = temp;
        }


        temp = columns[indi];
        columns[indi] = columns[indi + 1];
        columns[indi + 1] = temp;

        temp = categories[indi];
        categories[indi] = categories[indi + 1];
        categories[indi + 1] = temp;

        d3.select(".pcpsvg").selectAll("g").remove();
        for (var i = 0; i < yScales.length - 1; i++)
            d3.selectAll(".x" + (parseInt(i)) + "y" + (parseInt(i) + 1)).remove();
        drawPCPLabels();
        drawPCPLines();
    } else if (d3.event.x < -padding) {
        indi = parseInt(ind)
        temp = yScales[indi];
        yScales[indi] = yScales[indi - 1];
        yScales[indi - 1] = temp;
        yScales[indi][1] = 100 + indi * padding
        yScales[indi - 1][1] = 100 + (indi - 1) * padding
        temp = data[indi];
        data[indi] = data[indi - 1];
        data[indi - 1] = temp;

        for (var i = 0; i < pcpDatatotal.length - 1; i++) {
            temp = pcpDatatotal[i][indi];
            pcpDatatotal[i][indi] = pcpDatatotal[i][indi - 1];
            pcpDatatotal[i][indi - 1] = temp;
        }

        temp = columns[indi];
        columns[indi] = columns[indi - 1];
        columns[indi - 1] = temp;

        temp = categories[indi];
        categories[indi] = categories[indi - 1];
        categories[indi - 1] = temp;

        d3.select(".pcpsvg").selectAll("g").remove();
        for (var i = 0; i < yScales.length - 1; i++)
            d3.selectAll(".x" + (parseInt(i)) + "y" + (parseInt(i) + 1)).remove();
        drawPCPLabels();
        drawPCPLines();
    } else {
        d3.select(this.parentNode).select("g")
            .attr("transform", "translate(" + d3.event.x + ",0)");
        if (parseInt(ind) == 0)
            d3.selectAll(".x" + parseInt(ind) + "y" + (parseInt(ind) + 1)).remove();
        else if (parseInt(ind) == yScales.length - 1)
            d3.selectAll(".x" + (parseInt(ind) - 1) + "y" + parseInt(ind)).remove();
        else {
            d3.selectAll(".x" + (parseInt(ind) - 1) + "y" + parseInt(ind)).remove();
            d3.selectAll(".x" + parseInt(ind) + "y" + (parseInt(ind) + 1)).remove();
        }
        yScales[parseInt(ind)][1] = initialX + d3.event.x;
        before = 0, after = 0;
        if (parseInt(ind) == 0) {
            after = parseInt(ind) + 1;
            before = -1;
        } else if (parseInt(ind) == yScales.length - 1) {
            after = -1;
            before = parseInt(ind) - 1;
        } else {
            after = parseInt(ind) + 1;
            before = parseInt(ind) - 1;
        }

        drawPCPSeperateLines(pcpDatatotal, kmeans, categories, before, after);
    }

}

function dragended(d) {
    initialX = 0;
    ind = d3.select(this.parentNode).select("g").attr("class");
    yScales[parseInt(ind)][1] = 100 + parseInt(ind) * padding
    if (parseInt(ind) == 0)
        d3.selectAll(".x" + parseInt(ind) + "y" + (parseInt(ind) + 1)).remove();
    else if (parseInt(ind) == yScales.length - 1)
        d3.selectAll(".x" + (parseInt(ind) - 1) + "y" + parseInt(ind)).remove();
    else {
        d3.selectAll(".x" + (parseInt(ind) - 1) + "y" + parseInt(ind)).remove();
        d3.selectAll(".x" + parseInt(ind) + "y" + (parseInt(ind) + 1)).remove();
    }
    d3.select(".pcpsvg").selectAll("g").remove();
    drawPCPLabels();
    drawPCPLines();
}