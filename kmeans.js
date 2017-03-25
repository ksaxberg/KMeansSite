
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
    //          and returns the new calculated average of those clusters
    //
    // Parameters:
    //      *  (IN) : Used in the calculation
    //
    // Returns: 
    //      New cluster centers based on average of pixels associated with 
    //      each cluster.
    var pixelsSum = [];
    for (var i=0;i<clusters.length;i++){
        // Extra value here will be for number of pixels
        pixelsSum.push([0,0,0,0,0,0]);
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
            // Add the imgvec to the sum running in pixelsSum
            for( var z=0;z<imgVec.length;z++){
                pixelsSum[min_index][z] += imgVec[z];
            }
            // Add 1 to the count of pixels
            pixelsSum[min_index][5] += 1;
        }
    }
    for (var i =0;i<pixelsSum.length;i++){
        var size = pixelsSum[i][5];
        for (var j=0;j<5;j++){
            pixelsSum[i][j] /= size;
        }
        // Remove that size , the last element of the array
        pixelsSum[i].pop()
    }
    return pixelsSum;
}

function partitionImageColor(k, lambda, rows, cols, matrix, clusters){
    // Purpose: Assigns each pixel to a cluster from the given cluster group
    //
    // Parameters:
    //      *  (IN) : Used in the calculation
    //
    // Returns: 
    //      Replaces contents of matrix with appropriately clustered colors

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
            // Color the pixel, preserve alpha value
            matrix[i][j] = [clusters[min_index][2], clusters[min_index][3], clusters[min_index][4], matrix[i][j][3]];
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
        // While iterating, calculate new clusters
        clusters = partitionImage(k, lambda, rows, cols, matrix, clusters);
    }
    // Use matrix or newImg to create image output
    return partitionImageColor(k, lambda, rows, cols, matrix, clusters);
}