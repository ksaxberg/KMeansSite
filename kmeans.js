
/*
 function [ output_args ] = kmeanTest( input_img )
 %KMEANTEST Summary of this function goes here
 %   Detailed explanation goes here
 % Problem 5
 
 sunsetImg = imread(input_img);
 
 K = 10;
 T = 3;
 lambda = 1;
 
 im1 = applykmeans(sunsetImg, initializeMatK(sunsetImg), T);
 figure();
 title('sunset k=5');
 imshow(im1);
 
 K = 15;
 T = 3;
 
 im1 = applykmeans(sunsetImg, initializeMatK(sunsetImg), T);
 figure();
 title('sunset k=5');
 imshow(im1);
 
 function [matK] = initializeMatK(img)
     rng(7);
     matK = zeros(K,5);
     for l_ = 1:K
        x_ = uint32(rand() * size(img,1) + 1);
        y_ = uint32(rand() * size(img,2) + 1);
        matK(l_,:) = [x_, y_,img(x_,y_,1), img(x_,y_,2), img(x_,y_,3)];
     end
 end
 
 function [collections_ , indices_, errors_] = partitionImage(img, matK)
 
     collections_ = cell(K,1);
     for l_ = 1:K
        collections_{l_} = zeros(size(img,1)*size(img,2), 5);
     end
     indices_ = zeros(K,1);
     errors_ = zeros(K,1);
     for i_ = 1:size(img, 1)
        for ja_ = 1:size(img, 2)
           min_dist = inf;
           min_index = 0;
           imgVec = [double(i_*lambda), double(ja_*lambda), double(img(i_,ja_,1)), double(img(i_,ja_,2)), double(img(i_,ja_,3))];
           for l_ = 1:K
               matKVec = [matK(l_,1)*lambda, matK(l_,2)*lambda, matK(l_,3), matK(l_,4), matK(l_,5)] ;
               d_ = euclidDistance(double(imgVec),double(matKVec));
               if  d_ < min_dist
                   min_index = l_;
                   min_dist = d_;
               end
           end
           errors_(min_index) = errors_(min_index) + min_dist;
           rowToAdd = [uint32(i_), uint32(ja_), uint32(img(i_,ja_,1)), uint32(img(i_,ja_,2)), uint32(img(i_,ja_,3))];
           indices_(min_index) = indices_(min_index) + 1;
           collections_{min_index}(indices_(min_index),:) = rowToAdd;
        end
     end
 end
 
 function [newMatK] = kmeans(img, matK)
     [collections_, indices_, errors_] = partitionImage(img, matK);
     matK
     errors_
     newMatK = zeros(K,5);
     for i_ = 1:K
        if indices_(i_) > 0
            x_avg = sum(collections_{i_}(:,1)) / indices_(i_);
            y_avg = sum(collections_{i_}(:,2)) / indices_(i_);
            red_avg = sum(collections_{i_}(:,3)) / indices_(i_);
            green_avg = sum(collections_{i_}(:,4)) / indices_(i_);
            blue_avg = sum(collections_{i_}(:,5)) / indices_(i_);
            newMatK(i_, 1) = uint32(x_avg);
            newMatK(i_, 2) = uint32(y_avg);
            newMatK(i_, 3) = uint32(red_avg);
            newMatK(i_, 4) = uint32(green_avg);
            newMatK(i_, 5) =  uint32(blue_avg);
        else
            newMatK(i_,:) = matK(i_,:);
        end
     end
 end
 
 function [newImg] = applykmeans(img, matK, T)
 newMatK = matK;
 for runT_ = 1:T
 newMatK = kmeans(img, newMatK);
 end
 
 [collections_, indices_] = partitionImage(img, newMatK);
 
 newImg = zeros(size(img));
 for i_ = 1:K
 for j_ = 1:indices_(i_)
 x_ = collections_{i_}(j_, 1);
 y_ = collections_{i_}(j_, 2);
 newImg(x_, y_, 1) = uint8(newMatK(i_, 3));
 newImg(x_, y_, 2) = uint8(newMatK(i_, 4));
 newImg(x_, y_, 3) = uint8(newMatK(i_, 5));
 end
 end
 newImg = uint8(newImg);
 end
 
 
 end
*/
function initialGuesses(k, lambda, rows, cols, matrix){
    // No-error checking initial guesses for K-Means
    var guesseroo = [];
    var usedRows = [];
    var usedCols = [];
    var randInt = function(upperBound){return Math.floor(Math.random()*upperBound);};
    for( i = 0; i < k; i++){
        var randRow = randInt(rows);
        // Not a row we have used before
        while(usedRows.includes(randRow)){
            randRow = randInt(rows);
        }
        var randCol = randInt(cols)
        // Not a col we have used before
        while(usedCols.includes(randCol)){
            randCol = randInt(rows);
        }
        var color = matrix[randRow][randCol];
        guesseroo.push([randRow*lambda, randCol*lambda].concat(color));
    
    }
    return guesseroo;
}

function distanceMeasure(){
    // Purpose: Provide a distance calculation between two given vectors
    //          Implemented this way to change which distance is being used.
    //
    // Returns:
    //      A specified function that implements distance.
    
    
    return function(vec1, vec2){
        // Euclidean Distance Metric
        // Assuming vectors same size
        var sum = 0;
        for (i=0;i<vec.length;i++){
            sum += (vec1[i]-vec2[i])*(vec1[i]-vec2[i]);
        }
        return Math.sqrt(sum);
    };
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
    var distance = distanceMeasure();
    for(i=0;i<rows;i++){
        for(j=0;j<cols;j++){
            var min_dist = Infinity;
            var min_index = -1;
            var imgVec = [i*lambda, j*lambda].concat(matrix[i][j]);
            for(z=0;z<clusters.length;z++){
                var dist = distance(imgVec, clusters[i]);
                if(dist < min_dist) {
                    min_dist = dist;
                    min_index = i;
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
    for (i=0;i<collections.length;i++){
        var vectorSize = collections[i].length;
        var x_sum = 0;
        var y_sum = 0;
        var red_sum = 0;
        var green_sum = 0;
        var blue_sum = 0;
        for (j=0;j<vectorSize;j++){
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

function colorWithCluster(matrix, cluster, collections){
    // Editing the given matrix
    for (i=0;i<collections.length;i++){
        for(j=0;j<collections[i].length;i++){
            var vec = collections[i][j];
            matrix[vec[0]][vec[1]]=[cluster[i][3],cluster[i][4],cluster[i][5]];
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

    var clusters = initialGuesses(k, lambda, rows, cols, matrix);
    var collections;
    for(i=0;i<T;i++){
        collections = partitionImage(k, lambda, rows, cols, matrix, clusters);
        clusters = dealWithCollections(clusters, collections);
    }

    // Use matrix or newImg to create image output
    colorWithCluster(matrix, clusters, collections);
}

function imageAnalysis(){
    var k = parseInt(document.getElementById("kForKMeans").value);
    var T = parseInt(document.getElementById("iterForKMeans").value);
    var lambda = parseInt(document.getElementById("lambdaForKMeans").value);

    var imageMatrix;
    //TODO: Somehow put the image into that matrix
    kmeans(imageMatrix, k, T, lambda);
    //TODO: Hey hit that matrix into an image

}


window.onload = function(){
    var fileInput = document.getElementById('imageInput');
    var fileDisplayArea = document.getElementById('uploadImageDisplayArea');
    
    fileInput.addEventListener('change', function(e) {
       var file = fileInput.files[0];
       var imageType = /image.*/;
       
       if (file.type.match(imageType)) {
           var reader = new FileReader();
       
           reader.onload = function(e) {
               fileDisplayArea.innerHTML = "";

               // Create a new image.
               var img = new Image();
               // Set the img src property using the data URL.
               img.src = reader.result;
               
               // Add the image to the page.
               fileDisplayArea.appendChild(img);
           }
                               
           reader.readAsDataURL(file);
       }
       else {
       fileDisplayArea.innerHTML = "File not supported!";
       }
    });
};
