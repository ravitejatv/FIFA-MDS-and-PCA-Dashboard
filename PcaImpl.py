import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.manifold import MDS
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans
import numpy as np
class PcaImpl:
    def __init__(self):
        self.dataset = pd.read_csv("./data/fifa_processed_numerical.csv")
        self.dataset_entire = pd.read_csv("./data/fifa_processed_second.csv")
        self.dataset.drop(self.dataset.tail(1).index,inplace=True)
        self.dataset_normal = StandardScaler().fit_transform(self.dataset)
        self.pca_loadings = []
        self.kmeans_vector = self.kmeans_loadings()
         

    def generate_eigen_values(self):
        pca = PCA()
        self.dataset_transformed = pca.fit_transform(self.dataset_normal)
        eigen_values = pca.explained_variance_ratio_
        eigen_values = np.round(eigen_values, decimals=3)*100
        eigen_values_cumsum=np.cumsum(np.round(pca.explained_variance_ratio_, decimals=3)*100)
        returnValue =[]
        returnValue.append(eigen_values)
        returnValue.append(eigen_values_cumsum)
        return returnValue

    def get_pca_loadings(self, components, size):
        squared_loadings = []
        for ind, i in enumerate(components.T):
            squred_value = 0
            for j in i:
                squred_value+= j**2
            pca_load = []
            pca_load.append(squred_value)
            pca_load.append(ind)
            squared_loadings.append(pca_load)
        squared_loadings = np.array(squared_loadings)
        squared_loadings = squared_loadings[np.argsort(squared_loadings[:, 0])].tolist()
        for i in reversed(squared_loadings[len(squared_loadings) - size:]):
            self.pca_loadings.append(components.T[int(i[1])].tolist())
        return squared_loadings[-size:]

    def kmeans_loadings(self):
        kmeans = KMeans(n_clusters=4, random_state=0).fit(self.dataset)
        return kmeans.labels_.tolist()

    def generate_scatter_matrix(self, dimension):
        dimension = int(dimension)
        pca = PCA(n_components=dimension)
        pca.fit_transform(self.dataset)
        columns = self.dataset.columns
        squared_loadings = self.get_pca_loadings(pca.components_, 4)
        returnMatrixData = []
        returnMatrixColumns = []
        returnMatrixColumnNames = []
        for indexi, i in enumerate(squared_loadings):
            for indexj, j in enumerate(columns):
                if indexj == i[1]:
                    returnMatrixColumnNames.append(j)
                    returnMatrixColumns.append(indexj)
                    returnMatrixData.append(np.array(self.dataset[j]).astype('float64').tolist())
        returnMatrix =[]
        returnMatrix.append(returnMatrixData)
        returnMatrix.append(np.vstack((returnMatrixColumns, returnMatrixColumnNames)).tolist())
        returnMatrix.append(self.kmeans_vector)
        returnMatrix.append(self.pca_loadings)
        return returnMatrix


    def generate_biplot(self):
        scale = 100
        pca = PCA(n_components=2)
        pca.fit(self.dataset)


        columns = self.dataset.columns
        data_transformed = np.array(self.dataset).astype('float64')
        components = pca.components_.T
        dataset_transformed = np.dot(np.array(self.dataset).astype('float64'), pca.components_.T)
        print(dataset_transformed.shape)
        data_Arr = []
        for i in dataset_transformed:
            data_Arr.append(i.tolist())
        returnMatrix = []
        data_Arr = np.hsplit(np.array(data_Arr),2)

        X = []
        for i in data_Arr[0]:
            X.append(i[0])
        Y= []
        for i in data_Arr[1]:
            Y.append(i[0])

        components = scale* components
        returnMatrix.append(X)
        returnMatrix.append(Y)
        returnMatrix.append(components.tolist())
        returnMatrix.append(self.dataset.columns.tolist())
        return returnMatrix

    def generate_mdsEuclidianPlot(self):
        mds = MDS(n_components=2, dissimilarity="euclidean")
        data_transformed = np.array(self.dataset).astype('float64')
        dataset_transformed = mds.fit_transform(data_transformed)
        data_Arr = []
        for i in dataset_transformed:
            data_Arr.append(i.tolist())
        returnMatrix = []
        data_Arr = np.hsplit(np.array(data_Arr),2)
        X = []
        for i in data_Arr[0]:
            X.append(i[0])
        Y= []
        for i in data_Arr[1]:
            Y.append(i[0])
        returnMatrix.append(X)
        returnMatrix.append(Y)
        returnMatrix.append(self.kmeans_vector)
        return returnMatrix


    def generate_mdsPrecomputedPlot(self):
        
        mds = MDS(n_components=2, dissimilarity="precomputed")
        data_transformed = self.dataset.astype('float64')
        corrrelation = 1 - abs(data_transformed.corr())
        dataset_transformed = mds.fit_transform(corrrelation)
        data_Arr = []
        for i in dataset_transformed:
            data_Arr.append(i.tolist())
        returnMatrix = []
        data_Arr = np.hsplit(np.array(data_Arr),2)
        X = []
        for i in data_Arr[0]:
            X.append(i[0])
        Y= []
        for i in data_Arr[1]:
            Y.append(i[0])
        returnMatrix.append(X)
        returnMatrix.append(Y)
        returnMatrix.append(self.kmeans_vector)
        returnMatrix.append(self.dataset.columns.tolist())
        return returnMatrix

    def generate_pcpPlot(self):
        categories = self.dataset_entire.tail(1)
        self.dataset_entire.drop(self.dataset_entire.tail(1).index,inplace=True)
        categories = np.array(categories)[0]
        for jind, j in enumerate(self.dataset_entire.columns.tolist()):
            if categories[jind] == 'num':
                self.dataset_entire[j] = self.dataset_entire[j].astype('float64')
        returnMatrix = []
        dataMatrix = []
        for j in self.dataset_entire.columns.tolist():
            dataMatrix.append(self.dataset_entire[j].tolist())
        returnMatrix.append(dataMatrix)
        returnMatrix.append(categories.tolist())
        returnMatrix.append(self.kmeans_vector)
        returnMatrix.append(self.dataset_entire.columns.tolist())
        return returnMatrix
