
function initialGuesses(k, rows, cols, matrix){
    // No-error checking initial guesses for K-Means
    var guesses = [];
    var usedRows = [];
    var usedCols = [];
    var randInt = function(upperBound){return Math.floor(Math.random()*upperBound);};
    for(var i = 0; i < k; i++){
        var randRow = randInt(rows);
        var randCol = randInt(cols)
        // Not a row or col we have used before (this is more restrictive than necessary)
        while(usedRows.includes(randRow) && usedCols.includes(randCol)){
            randRow = randInt(rows);
            randCol = randInt(cols);
        }
        usedRows.push(randRow);
        usedCols.push(randCol);
        var color = matrix[randRow][randCol];
        guesses.push([randRow, randCol, color[0], color[1], color[2]]);
    
    }
    return guesses;
}

function distanceMeasure(vec1, vec2, lambda){
    // Purpose: Provide a distance calculation between two given vectors
    
        // Euclidean Distance Metric
        // Assuming vectors same size
        var sum = 0;
        for (var i=0;i<vec1.length;i++){
            if(i==0 || i == 1){
                sum += lambda*lambda*(vec1[i]-vec2[i])*(vec1[i]-vec2[i]);
            } else {
                sum += (vec1[i]-vec2[i])*(vec1[i]-vec2[i]);
            }
        }
        return Math.sqrt(sum);
}

function partitionImage(k, lambda, rows, cols, matrix, clusters){
    // Purpose: Assigns each pixel to a cluster from the given cluster group
    //
    // Parameters:
    //      *  (IN) : Used in the calculation
    //
    // Returns: 
    //      Collection of vectors from the image, each collection is indexed
    //        as it refers to the cluster all those vectors are "closest" to.
    var collections = [];
    for (var i=0;i<clusters.length;i++){
        collections.push([]);
    }
    for(var i=0;i<rows;i++){
        for(var j=0;j<cols;j++){
            var min_dist = Infinity;
            var min_index = -1;
            var imgVec = [i, j, matrix[i][j][0], matrix[i][j][1], matrix[i][j][2]];
            for(var z=0;z<clusters.length;z++){
                var dist = distanceMeasure(imgVec, clusters[z], lambda);
                if(dist < min_dist) {
                    min_dist = dist;
                    min_index = z;
                }
            }
            collections[min_index].push(imgVec);
        }
    }
    return collections;
}

function dealWithCollections(clusters, collections){
    //Calculate new clusters based on assignments to collections
    // so that clusters represent averages of the collections.
    var newClusters = [];
    for (var i=0;i<collections.length;i++){
        var vectorSize = collections[i].length;
        if (vectorSize == 0){
            // If nothing was allocated to a cluster, maintain the cluster
            // anyway.
            newClusters.push(clusters[i]);
            continue;
        }
        var x_sum = 0;
        var y_sum = 0;
        var red_sum = 0;
        var green_sum = 0;
        var blue_sum = 0;
        for (var j=0;j<vectorSize;j++){
            var imgVec = collections[i][j];
            x_sum += imgVec[0];
            y_sum += imgVec[1];
            red_sum += imgVec[2];
            green_sum += imgVec[3];
            blue_sum += imgVec[4];
        }
        var x_avg = x_sum / vectorSize;
        var y_avg = y_sum / vectorSize;
        var red_avg = red_sum / vectorSize;
        var green_avg = green_sum / vectorSize;
        var blue_avg = blue_sum / vectorSize;

        newClusters.push([x_avg, y_avg, red_avg, green_avg, blue_avg]);
    }
    return newClusters;
}

function colorWithCluster(matrix, cluster, collections, lambda){
    // Editing the given matrix
    for (var i=0;i<collections.length;i++){
        for(var j=0;j<collections[i].length;j++){
            var vec = collections[i][j];
            // Each vec is [x, y, red, green, blue]
            matrix[vec[0]][vec[1]]=[cluster[i][2],cluster[i][3],cluster[i][4], matrix[vec[0]][vec[1]][3]];
        }
    }
    return matrix;
}

function kmeans(matrix, k, T, lambda){
    /* Purpose: apply kmeans to a 3-d matrix rgb image color
     *
     * Parameters:
     *    matrix (IN/OUT): Image matrix which is adjusted after applying
     *      the kmeans analysis with the specified parameters
     *    k (IN):  The number of clusters to use
     *    T (IN):  How many times to run k-means
     *    lambda (IN):  Weight for position vs color
     *
     * Returns:
     *      Nothing, output passed through the matrix parameter
     * */
    var rows = matrix.length;
    var cols = matrix[0].length;

    var clusters = initialGuesses(k, rows, cols, matrix);
    var collections;
    for(var i=0;i<T;i++){
        collections = partitionImage(k, lambda, rows, cols, matrix, clusters);
        clusters = dealWithCollections(clusters, collections);
    }
    collections = partitionImage(k, lambda, rows, cols, matrix, clusters);
    // Use matrix or newImg to create image output
    return colorWithCluster(matrix, clusters, collections, lambda);
}
