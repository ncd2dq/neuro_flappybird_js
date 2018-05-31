class Matrix{
    constructor(rows, cols, type='neuron'){
        this.rows = rows;
        this.cols = cols;
        
        if(type == 'neuron'){
            this.matrix = this.create_neuron_array(rows, cols);
        } else if(type == 'zero'){
            this.matrix = this.create_zero_array(rows, cols);
        } 
    }
    
    create_neuron_array(rows, cols){
        let final_matrix = [];
        
        for(let i = 0; i < rows; i++){
            let row_temp = [];
            for(let j = 0; j < cols; j++){
                let random_number = randomGaussian(0, 0.5);
                row_temp.push(random_number);
            }
            final_matrix.push(row_temp);
        }
        return final_matrix;
    }
    
    create_zero_array(rows, cols, fill=0){
        let final_matrix = [];
        
        for(let i = 0; i < rows; i++){
            let row_temp = [];
            for(let j = 0; j < cols; j++){
                row_temp.push(fill);
            }
            final_matrix.push(row_temp);
        }
        return final_matrix;
    }
    
    dot(other_matrix){
        if(dot_product_eligible(this, other_matrix)){
            let shell = create_matrix_shell(this, other_matrix);
            
            //Iterate through the rows of the first matrix
            for(let i = 0; i < this.rows; i++){
                let row1 = this.matrix[i]; //first row vector from first matrix
                
                for(let j = 0; j < other_matrix.cols; j++){
                    let row2 = col_to_row(other_matrix, j); //second row vector from second matrix
                    let product = list_summation(row1, row2);
                    
                    //fill shell matrix
                    shell.matrix[i][j] = product;
                }
            }
            return shell;
        } else {
            return dot_product_eligible(this, other_matrix);
        }
    }
    
    mutate(rate){
        for(let i = 0; i < this.rows; i++){
            for(let j = 0; j < this.cols; j++){
                if(random() <= rate){
                    let offset = randomGaussian(0, 0.5);
                    this.matrix[i][j] += offset;
                }
            }
        }
    }
}


//HELPER FUNCTION
function col_to_row(data_matrix, index){
    //Takes a matrix and a column index and returns a flat list of that entire column
    let temp = [];
    for(let i = 0; i < data_matrix.rows; i++){
        for(let j = 0; j < data_matrix.cols; j++){
            if(j == index){
                temp.push(data_matrix.matrix[i][j]);
            }
        }
    }
    return temp;
}

function list_summation(row1, row2){
    //Takes to lists and multiplies each respective element together, adding them all up
    let sum = 0;
    for(let i = 0; i < row1.length; i++){
        sum += row1[i] * row2[i];
    }
    return sum;   
}

function create_matrix_shell(matrix1, matrix2){
    //Prepares a shell matrix for the dot product to fill
    let rows = matrix1.rows;
    let cols = matrix2.cols;
    
    let matrix_shell = new Matrix(rows, cols, type='zero');
    
    return matrix_shell;
}

function dot_product_eligible(matrix1, matrix2){
    //Checks that 2 matrices are eligible for the dot product
    if(matrix1.cols == matrix2.rows){
        return true;
    } else {
        return matrix1.cols + " columns of Matrix1 did not match " + matrix2.rows + " rows of Matrix2.";
    }
}