
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
 
 function [distance] = euclidDistance(vector1, vector2)
 distance = sqrt(sum((vector1-vector2).^2));
 end
 
 function [closest_key, closest_distance] = closest(keypoint, collection, distanceMetric)
 closest_key = 1;
 closest_distance = distanceMetric(keypoint(5:end), collection(closest_key,5:end));
 for iter_ = 2:length(collection)
 temp_dist = distanceMetric(keypoint(5:end), collection(iter_, 5:end));
 if temp_dist < closest_distance
 closest_key = iter_;
 closest_distance = temp_dist;
 end
 end
 end
 
 
 
 end
*/
function kmeans(matrix){
  

}


window.onload = function(){
    var fileInput = document.getElementById('fileInput');
    var fileDisplay = document.getElementById('fileDisplayArea');
    
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
}
