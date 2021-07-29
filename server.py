from flask import Flask, render_template, jsonify, request
import pandas as pd
import matplotlib.pyplot as plt
from PcaImpl import *
import json

app = Flask(__name__)

# Display your index page
@app.route("/")
def index():
    return render_template('index.html')


@app.route("/getPCPPlotData")
def PCA_GetPCPPlotData():
    returnValue = PcaImpl().generate_pcpPlot()
    columnString = json.dumps(returnValue.pop())
    kmeansString = json.dumps(returnValue.pop())
    categoryString = json.dumps(returnValue.pop())
    dataString = json.dumps(returnValue.pop())
    data = {'data': dataString, 'columns': columnString, 'kmeans': kmeansString, 'categories': categoryString}
    return jsonify(data)

@app.route("/getMDSEuclidianPlotData")
def PCA_GetMDSEuclidianPlotData():
    returnValue = PcaImpl().generate_mdsEuclidianPlot()
    kmeansString = json.dumps(returnValue.pop())
    dataYString = json.dumps(returnValue.pop())
    dataXString = json.dumps(returnValue.pop())
    data = {'dataX': dataXString, 'dataY': dataYString, 'kmeans': kmeansString}
    return jsonify(data)


@app.route("/getMDSPrecomputedPlotData")
def PCA_GetMDSPrecomputedPlotData():
    returnValue = PcaImpl().generate_mdsPrecomputedPlot()
    columnString = json.dumps(returnValue.pop())
    kmeansString = json.dumps(returnValue.pop())
    dataYString = json.dumps(returnValue.pop())
    dataXString = json.dumps(returnValue.pop())
    data = {'dataX': dataXString, 'dataY': dataYString, 'kmeans': kmeansString, 'columns': columnString}
    return jsonify(data)

@app.route("/getScatterMatrixData")
def PCA_ScatterMatrixData():
    dimension = request.args['dimension']
    returnValue = PcaImpl().generate_scatter_matrix(dimension)
    pcaLoadingsString = json.dumps(returnValue.pop())
    kmeansString = json.dumps(returnValue.pop())
    columnString = json.dumps(returnValue.pop())
    dataString = json.dumps(returnValue.pop())
    data = {'values': dataString, 'columns': columnString, 'kmeans': kmeansString, 'pcaLoadings': pcaLoadingsString}
    return data


@app.route("/getBiPlotData")
def PCA_GetBiPlotData():
    returnValue = PcaImpl().generate_biplot()
    columnString = json.dumps(returnValue.pop())
    eigenVectorsString = json.dumps(returnValue.pop())
    dataYString = json.dumps(returnValue.pop())
    dataXString = json.dumps(returnValue.pop())
    data = {'eigenVectors': eigenVectorsString, 'dataX': dataXString, 'dataY': dataYString, 'columns': columnString}
    return data

@app.route('/getScreePlotData')
def PCA_ScreePlotData():
    returnValue = PcaImpl().generate_eigen_values()
    eigen_vales = returnValue[0]
    eigen_vales_cumsum = returnValue[1]

    scree_plt_data = pd.DataFrame(data=eigen_vales, columns=['y'])
    index_data = pd.DataFrame(data=range(1, np.size(eigen_vales)+ 1), columns=['x'])
    scree_plt_data = pd.concat([scree_plt_data, index_data], axis=1)
    scree_plt_data = scree_plt_data.to_dict(orient='records')

    scree_plt_data_cumsum = pd.DataFrame(data=eigen_vales_cumsum, columns=['y'])
    index_data = pd.DataFrame(data=range(1, np.size(eigen_vales)+ 1), columns=['x'])
    scree_plt_data_cumsum = pd.concat([scree_plt_data_cumsum, index_data], axis=1)
    scree_plt_data_cumsum = scree_plt_data_cumsum.to_dict(orient='records')

    data = {'data': scree_plt_data, 'dataCumsum': scree_plt_data_cumsum}
    return jsonify(data)


def preprocessing():
    col_list = ["overall","pace","shooting","passing","dribbling","defending","physic",
        "height_cm","weight_kg","age"]
    col_original_list = ["preferred_foot","team_position","body_type",
    "overall","skill_moves","team_jersey_number","pace","shooting","passing","dribbling","defending","physic",
    "height_cm","weight_kg","age"]
     
    data_entire = pd.read_csv("./data/fifa_processed.csv", delimiter=",", usecols=col_original_list)
    data_entire = data_entire.replace([np.inf, -np.inf], np.nan)
    data_entire = data_entire.dropna()
    data_entire.to_csv('./data/fifa_processed_second.csv', index=False)
    

    data = pd.read_csv("./data/fifa_processed.csv", delimiter=",", usecols=col_list)
    data = data.replace([np.inf, -np.inf], np.nan)
    data = data.dropna()
    data.to_csv('./data/fifa_processed_numerical.csv', index=False)

if __name__ == "__main__":
    print("running...")
    preprocessing()
    app.run(host='127.0.0.1', port=5050, debug=True)
    