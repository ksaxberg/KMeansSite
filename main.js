
function showMore(){
  var options = document.getElementById("contentRightSide");
  if (options.style.display == "none"){
    options.style.display = "initial";
  } else{
    options.style.display = "none"
  }
}

function manipulateImg(method){
  var mat = imageToMatrix();
  mat = method(mat);
  matrixToImage(mat);
  //matrixToImage(method(imageToMatrix()));
}

function imageToMatrix(){
  var canvas = document.getElementById('myCanvas');
  var context = canvas.getContext('2d');
  var matrix = new Array();
  context.canvas.width = img.width;
  context.canvas.height = img.height;
    
  context.drawImage(img, 0, 0);
    
  var data = context.getImageData(0, 0, img.width, img.height).data;
    
  var curPixel = 0;
  //populate matrix with pixel data
  for (var i = 0; i < img.width; i++){
      matrix[i] = new Array();
      for(var j = 0; j < img.height; j++){
          matrix[i][j] = new Array();
          for(var k = 0; k < 4; k++){
              matrix[i][j].push(data[curPixel]);
              curPixel++;
          }
      }
  }
  return matrix;
}

function matrixToImage(matrix){
  var canvas = document.getElementById('myCanvas');
  var context = canvas.getContext('2d');
  var imgData = context.createImageData(img.width, img.height);
    curPixel = 0;
    
    //write matrix into 1D array
    for(var i = 0; i < img.width; i++){
        for(var j = 0; j < img.height; j++){
            for(var k = 0; k < 4; k++){
                imgData.data[curPixel] = matrix[i][j][k];
                curPixel++;
            }
        }
    }
    context.putImageData(imgData, 0, 0);
    //var imgOut = document.createElement("img");
    img.src = canvas.toDataURL("image/jpeg", 1.0);
    var img2 = document.getElementById("viewableImage");
    img2.src = img.src;
    //using global var for output
    //img.src = imgOut.src;
}

function runKMeans(){
    // Clear error area of messages
    var errorArea = document.getElementById("errorMessages");
    errorArea.innerHTML = "";

    var kVal = parseInt(document.getElementById("kForKMeans").value);
    var T = parseInt(document.getElementById("iterForKMeans").value);
    // Check if image in memory
    if (!imageLoaded){
      var error = document.createElement("p");
      error.innerHTML = "Please select an image to be manipulated.";
      errorArea.appendChild(error);
      return;
    }
    // Rough value check for T and K
    if(isNaN(kVal) || isNaN(T)){
      var error = document.createElement("p");
      error.innerHTML = "Please enter a number for K and for iteration";
      errorArea.appendChild(error);
      return;
    } 
    // Removed the weighting option on pixel distance, could not reconcile banding
    //var lambda = parseFloat(document.getElementById("lambdaForKMeans").value);
    var lambda = 0;
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
    
    var data = context.getImageData(0, 0, imgWidth, imgHeight).data;
    
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
    //matrix = invert(matrix);
    
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
    imgOut.src = canvas.toDataURL("image/jpeg", 1.0); // full quality

    // Placing the child 
    //outputArea.appendChild(imgOut);
    if ( imgWidth > 700){imgOut.setAttribute("class", "imgScale");}
    // prepend child
    outputArea.insertBefore(imgOut, outputArea.firstChild);
}




var img;
var debug = false;
var imageLoaded = false;

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
               imageLoaded = true;
               
               // Create visible image
               var img2 = new Image();
               img2.src = img.src;
               img2.setAttribute("id", "viewableImage");
               img2.setAttribute("class", "imgScaleMax");
               // Add the image to the page.
               fileDisplayArea.appendChild(img2);
           }
                               
           reader.readAsDataURL(file);
           
       }
       else {
       fileDisplayArea.innerHTML = "File not supported!";
       imageLoaded = false;
       }
    });
};
