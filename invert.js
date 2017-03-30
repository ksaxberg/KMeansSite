function invert(matrix){
	
	for(var i=0;i<matrix.length;i++){
		for (var j=0;j<matrix[0].length;j++){
			matrix[i][j][0] = 255 - matrix[i][j][0];
			matrix[i][j][1] = 255 - matrix[i][j][1];
			matrix[i][j][2] = 255 - matrix[i][j][2];
		}
	}
	return matrix;
}