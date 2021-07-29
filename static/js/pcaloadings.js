function pcaloadings(loadings, attributes) {
    var pca = d3.select('.pcaloadings');
    pca.selectAll("table").remove();

    var table = pca.append('table');
    var thead = table.append('thead')
    var tbody = table.append('tbody');
    columnsLoadings = ['Attribute']
    for (i = 1; i <= loadings[0].length; i++) {
        columnsLoadings.push("PC" + i)
    }
    thead.append('tr')
        .selectAll('th')
        .data(columnsLoadings).enter()
        .append('th')
        .text(function(column) { return column; });

    var rows = tbody.selectAll('tr')
        .data(loadings)
        .enter()
        .append('tr');

    for (var i = 0; i < loadings.length; i++) {
        loadings[i].unshift(attributes[1][i]);
    }
    var cells = rows.selectAll('td')
        .data(function(row) {
            return columnsLoadings.map(function(column, i) {
                return { column: column, value: row[i] };
            });
        })
        .enter()
        .append('td')
        .text(function(d) { return d.value; });

}