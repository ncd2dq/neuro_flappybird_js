class NN{
    constructor(layers, neurons_per_layer, learning_rate, outputs=1, inputs=5){
        this.layers = layers;
        this.network = this.create_network(layers, neurons_per_layer, outputs, inputs);
    }
    
    create_network(layers, neurons_per_layer, outputs, features){
        let matrix_array = [];
        
        for(let i = 0; i < layers; i ++){
            if(i == 0){
                matrix_array.push(new Matrix(features, neurons_per_layer)); //first neuron turns number of features into number of neurons
            } else if(i == layers - 1){
                matrix_array.push(new Matrix(neurons_per_layer, outputs)); //last neruon turns number of neurons into number of outputs
            } else {
                matrix_array.push(new Matrix(neurons_per_layer, neurons_per_layer)); //any layer in the middle converts number of neurons to number of neurons
            }
        }
        return matrix_array;
    }
    
    sigmoid(x){
        let sig = 1 / (1 + Math.exp(-x));
        return sig;
    }
    
    softmax(x){
        if(x > 0.5){
            return 1;
        } else {
            return 0;
        }
    }
    
    activation(data_array){
        for(let i = 0; i < data_array.rows; i++){
            for(let j = 0; j < data_array.cols; j++){
                data_array.matrix[i][j] = this.sigmoid(data_array.matrix[i][j]);
            }
        }
        
    }
    
    feed_forward(inputs){
        //propogate the input forward through the network
        //inputs MUST be a matrix
        let previous_result = inputs;
        for(let i = 0; i < this.layers; i++){
            previous_result = previous_result.dot(this.network[i]);
            this.activation(previous_result);
        }
        return previous_result;
    }
    
    
    predict(inputs){
        //same thing as feed forward except it applies a soft_max to the feed_forward result
        let guess = this.feed_forward(inputs).matrix[0][0];
        return this.softmax(guess);
    }
    
    mutate(rate){
        //utilizes the matrix mutate function
        
    }
    
    cross_over(other_nn){
        //swaps every other weight between each matrix
        //if the first swap is from this one or that one is random
        
    }
    
    save_weights(){
        //save the weights to a csv file
        
    }
    
    load_weights(csv_file){
        //will load a csv fill filled with weights
        
    }
    
    
}