

function runKMeans(){
    
    var kVal = parseInt(document.getElementById("kForKMeans").value);
    var T = parseInt(document.getElementById("iterForKMeans").value);
    var lambda = parseInt(document.getElementById("lambdaForKMeans").value);
    if(debug){
        console.log("kVal: " + kVal);
        console.log('running kmeans');
    }
    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');
    var matrix = new Array();
    var imgWidth = img.width;
    var imgHeight = img.height;
    context.canvas.width = imgWidth;
    context.canvas.height = imgHeight;
    
    context.drawImage(img, 0, 0);
    
    var imageData = context.getImageData(0, 0, imgWidth, imgHeight);
    var data = imageData.data;
    
    //fill matrix with nothing
    for (var i = 0; i < imgWidth; i++){
        matrix[i] = new Array();
        for(var j = 0; j < imgHeight; j++){
            matrix[i][j] = new Array();
        }
    }
    
    var curPixel = 0;
    
    //populate matrix with pixel data
    for(var i = 0; i < imgWidth; i++){
        for(var j = 0; j < imgHeight; j++){
            for(var k = 0; k < 4; k++){
                matrix[i][j].push(data[curPixel]);
                curPixel++;
            }
        }
    }
    if(debug){    
        console.log('first pixel: red: ' + matrix[0][0][0]);
        console.log(imgWidth);
        console.log(imgHeight);
        console.log(matrix.length);
        console.log(matrix[0].length);
        console.log(matrix[0][0].length);
        console.log((imgWidth/2)-1);
        console.log((imgHeight/2)-1);
        //console.log('last pixel: red: ' + matrix[260][260][0]);
        //console.log('last pixel: green: ' + matrix[260][260][1]);
        //console.log('last pixel: blue: ' + matrix[260][260][2]);
    }
    
    matrix = kmeans(matrix, kVal, T, lambda);
    
    if(debug){console.log("kmeans finished")};
    
    var imgData = new ImageData(imgWidth, imgHeight);
    curPixel = 0;
    
    //write matrix into 1D array
    for(var i = 0; i < imgWidth; i++){
        for(var j = 0; j < imgHeight; j++){
            for(var k = 0; k < 4; k++){
                imgData.data[curPixel] = matrix[i][j][k];
                curPixel++;
            }
        }
    }
    
    var outputArea = document.getElementById("processedImageDisplayArea");
    var imgOut = document.createElement("img");
    //imgOut.src = canvas.toDataURL('image/jpeg', 1.0); // full quality
    //TODO: Need to take the output matrix to the image
    context.putImageData(imgData, 0, 0);
    imgOut.src = canvas.toDataURL(); // full quality
    outputArea.appendChild(imgOut);
    imgOut.setAttribute("class", "imgScale");

}


var img;

var debug = false;

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
               img = new Image();
               // Set the img src property using the data URL.
               img.src = reader.result;
               img.setAttribute("class", "imgScale");
               
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
