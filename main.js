

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
    
    var curPixel = 0;
    //populate matrix with pixel data
    for (var i = 0; i < imgWidth; i++){
        matrix[i] = new Array();
        for(var j = 0; j < imgHeight; j++){
            matrix[i][j] = new Array();
            for(var k = 0; k < 4; k++){
                matrix[i][j].push(data[curPixel]);
                curPixel++;
            }
        }
    }
    
    matrix = kmeans(matrix, kVal, T, lambda);
    
    if(debug){console.log("kmeans finished")};
    
    var imgData = context.createImageData(imgWidth, imgHeight);
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
    context.putImageData(imgData, 0, 0);

    var outputArea = document.getElementById("processedImageDisplayArea");
    var imgOut = document.createElement("img");
    //imgOut.src = canvas.toDataURL('image/jpeg', 1.0); // full quality
    imgOut.src = canvas.toDataURL("image/jpeg"); // full quality

    // Placing the child 
    //outputArea.appendChild(imgOut);
    if ( imgWidth > 700){imgOut.setAttribute("class", "imgScale");}
    // prepend child
    outputArea.insertBefore(imgOut, outputArea.firstChild);
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

               // Create a new image, preserve data
               img = new Image();
               // Set the img src property using the data URL.
               img.src = reader.result;
               img.setAttribute("class", "imgInput");
               
               // Create visible image
               var img2 = new Image();
               img2.src = img.src;
               img2.setAttribute("class", "imgScaleMax");
               // Add the image to the page.
               fileDisplayArea.appendChild(img2);
           }
                               
           reader.readAsDataURL(file);
           
       }
       else {
       fileDisplayArea.innerHTML = "File not supported!";
       }
    });
};
