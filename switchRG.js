function switchRG(matrix){
	
	for(var i=0;i<matrix.length;i++){
		for (var j=0;j<matrix[0].length;j++){
			var temp = matrix[i][j][0];
			matrix[i][j][0] = matrix[i][j][1];
			matrix[i][j][1] = temp;
		}
	}
	return matrix;
}