function InvalidColorCount(message){
    this.message = message;
    if ("captureStackTrace" in Error){
        Error.captureStackTrace(this, InvalidColorCount);
    } else{
        this.stack = (new Error()).stack();
    }
}
InvalidColorCount.prototype = Object.create(Error.prototype);
InvalidColorCount.prototype.name = "InvalidColorCount";
InvalidColorCount.prototype.constructor = InvalidColorCount;
function initialGuesses(k, rows, cols, matrix){
    // No-error checking initial guesses for K-Means
    var guesses = [];
    var usedRows = [];
    var usedCols = [];
    var usedColors = [];
    var randInt = function(upperBound){return Math.floor(Math.random()*upperBound);};
    var colorPicker = function(colorCollection, rowCollection, colCollection){
        var colors;
        var randRow;
        var randCol;
        var tries = 0;
        do{
            randRow = randInt(rows);
            randCol = randInt(cols)
            // Not a row or col we have used before (this is more restrictive than necessary)
            while(rowCollection.includes(randRow) && colCollection.includes(randCol)){
                randRow = randInt(rows);
                randCol = randInt(cols);
            }
            colors = matrix[randRow][randCol];
            tries++;
        } while(colorCollection.includes(colors)&& tries < 100);
        if(tries >= 100 && colorCollection.includes(colors)){
            // Throw error here
            throw new InvalidColorCount("Unable to select k colors from image");
        }
        colorCollection.push(colors);
        rowCollection.push(randRow);
        colCollection.push(randCol);
        return [randRow, randCol, colors[0], colors[1], colors[2]];
    };
    for(var i = 0; i < k; i++){
        guesses.push(colorPicker(usedColors,usedRows, usedCols));
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
    var min_dist;
    var min_index;
    var imgVec;
    var dist;
    for(var i=0;i<rows;i++){
        for(var j=0;j<cols;j++){
            min_dist = Infinity;
            min_index = 0;
            imgVec = [i, j, matrix[i][j][0], matrix[i][j][1], matrix[i][j][2]];
            for(var z=0;z<clusters.length;z++){
                dist = distanceMeasure(imgVec, clusters[z], lambda);
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
            pixelsSum[i][j] = Math.floor(pixelsSum[i][j]/size);
        }
        // Remove that size , the last element of the array
        pixelsSum[i].pop()
    }
    // TODO: This is not how it should be... any this didn't even fix the image issue!
    if (lambda != 0){
        //Update color not with average, but by polling image pixel
        pixelsSum.forEach(function(x){
		var i = x[0];
		var j = x[1];
		var colors = matrix[i][j];
		x[2] = colors[0];
		x[3] = colors[1];
		x[4] = colors[2];
	});
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
            var whatIsIt;
            if(min_index != 1){
                whatIsIt = 1;
                whatIsIt += 1;
            }if (min_index != 0){
                whatIsIt = 0;
                whatIsIt += 1;
            }if (min_index != 2){
                whatIsIt = 2;
                whatIsIt += 1;
            }if (min_index != 3){
                whatIsIt = 3;
                whatIsIt += 1;
            }if (min_index != 4){
                whatIsIt = 4;
                whatIsIt += 1;
            }
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
    var failed = false;
    try{
        for(var i=0;i<T;i++){
            // While iterating, calculate new clusters
            clusters = partitionImage(k, lambda, rows, cols, matrix, clusters);
        }
    } catch (err){
        if( err instanceof InvalidColorCount){
            alert("Unable to select k colors from image");
            failed = true;
        } else {
            alert(err.name);
        }
    }
    // Use matrix or newImg to create image output
    return failed ? matrix : partitionImageColor(k, lambda, rows, cols, matrix, clusters);
    //return partitionImageColor(k, lambda, rows, cols, matrix, clusters);
}
