var url = "http://127.0.0.1:5050";

function init() {
    showScreePlot()
}
init();

function showScreePlot() {
    document.querySelector(".screediv").style.display = "block";
    document.querySelector(".pcpdiv").style.display = "none";
    document.querySelector(".mdsprecompdiv").style.display = "none";
    document.querySelector(".mdseculiddiv").style.display = "none";
    document.querySelector(".pcaloadings").style.display = "block";
    document.querySelector(".scatterdiv").style.display = "block";
    document.querySelector(".biplotdiv").style.display = "none";
    $.getJSON(url + '/getScreePlotData', {

    }, function(d) {
        dataTot = d['data'];
        dataCumsum = d['dataCumsum'];
        var dataArr = Object.keys(dataTot).map(function(key) {
            return [dataTot[key]['x'], dataTot[key]['y']];
        });
        var dataCumSumArr = Object.keys(dataCumsum).map(function(key) {
            return [dataCumsum[key]['x'], dataCumsum[key]['y']];
        });
        screeplot(dataArr, dataCumSumArr);
    });
}

function showPCPPlot() {
    $.getJSON(url + '/getPCPPlotData', {

    }, function(d) {
        showPCPPlotD3(JSON.parse(d['data']), JSON.parse(d['kmeans']), JSON.parse(d['columns']), JSON.parse(d['categories']))
    });
}

function showMDSPrecomputedPlot() {
    document.querySelector(".screediv").style.display = "none";
    document.querySelector(".pcpdiv").style.display = "block";
    document.querySelector(".mdsprecompdiv").style.display = "block";
    document.querySelector(".mdseculiddiv").style.display = "none";
    document.querySelector(".pcaloadings").style.display = "none";
    document.querySelector(".scatterdiv").style.display = "none";
    document.querySelector(".biplotdiv").style.display = "none";
    $.getJSON(url + '/getMDSPrecomputedPlotData', {

    }, function(d) {
        mdsPrecomputedplotgeneration(JSON.parse(d['dataX']), JSON.parse(d['dataY']), JSON.parse(d['kmeans']), JSON.parse(d['columns']));
        showPCPPlot();
    });
}

function showMDSPlot() {
    document.querySelector(".screediv").style.display = "none";
    document.querySelector(".pcpdiv").style.display = "none";
    document.querySelector(".mdsprecompdiv").style.display = "none";
    document.querySelector(".mdseculiddiv").style.display = "block";
    document.querySelector(".pcaloadings").style.display = "none";
    document.querySelector(".scatterdiv").style.display = "none";
    document.querySelector(".biplotdiv").style.display = "none";
    $.getJSON(url + '/getMDSEuclidianPlotData', {

    }, function(d) {
        mdsEuclidianplotgeneration(JSON.parse(d['dataX']), JSON.parse(d['dataY']), JSON.parse(d['kmeans']));
    });
}


function showbiPlot() {
    document.querySelector(".screediv").style.display = "none";
    document.querySelector(".pcpdiv").style.display = "none";
    document.querySelector(".mdsprecompdiv").style.display = "none";
    document.querySelector(".mdseculiddiv").style.display = "none";
    document.querySelector(".pcaloadings").style.display = "none";
    document.querySelector(".scatterdiv").style.display = "none";
    document.querySelector(".biplotdiv").style.display = "block";
    $.getJSON(url + '/getBiPlotData', {

    }, function(d) {
        biplotgeneration(JSON.parse(d['eigenVectors']), JSON.parse(d['dataX']), JSON.parse(d['dataY']), JSON.parse(d['columns']));
    });
}

function showScatterMatrix(dimension) {
    $.getJSON(url + '/getScatterMatrixData', {
        dimension: dimension
    }, function(d) {
        pcaloadings(JSON.parse(d['pcaLoadings']), JSON.parse(d['columns']));
        scattermatrix(JSON.parse(d['values']), JSON.parse(d['columns']), JSON.parse(d['kmeans']));
    });
}


function colorRoll(idx) {
    var colorlist = [
        '#FF3633', '#335EFF', '#F933FF', '#48FF23', '#FFFF23',
        '#DA23FF', '#e5cf0d', '#97b552', '#95706d', '#dc69aa',
        '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
        '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
    ]
    return colorlist[idx % colorlist.length];
}