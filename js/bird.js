class Bird{
    constructor(layers, neurons_per_layer, learning_rate, outputs=1, inputs=5){
        this.brain = new NN(layers, neurons_per_layer, learning_rate, outputs, inputs)
        
        this.data = new Matrix(1, 5);
        
        this.crashed = false;
        
        this.distance = 0;
        this.fitness = 0;
        
        this.radius = 10;
        this.x = 25;
        this.y = Canvas_Height / 2;
        this.y_veloc = 0;
        this.gravity = 0.1;
        this.jump_height = 5;
        this.jump_momentum = 3;
        this.best_child = false;
    }
    
    display(){
        if(this.best_child){
            fill(best_child_color);
        } else if(!this.crashed) {
            fill(alive_bird);
        } else {
            fill(dead_bird);
        }
        ellipse(this.x, this.y, this.radius, this.radius);
    }
    
    update(){
        this.y += this.y_veloc;
        this.y_veloc += this.gravity;
    }
    
    calculate_features(inputs){
        //Feature 2 = y_position of bird
        //Feature 3 = y_veolcity of bird
        inputs.matrix[0][2] = this.y / Canvas_Height;
        inputs.matrix[0][3] = this.y_veloc;
        
        this.data = inputs;
    }
    
    jump(inputs){
        this.distance++;
        //Use neural network to determine if it should jump or not
        let result = this.brain.predict(inputs);
        
        if(result == 1){
            this.y -= this.jump_height;
            this.y_veloc -= this.jump_momentum;
        } 
    }
    
    loop_position(){
        if(this.y <= 0){
            this.y = 1;
            this.y_veloc = 0;
        } else if (this.y >= Canvas_Height){
            this.y = Canvas_Height - 1;
            this.y_veloc = 0;
        }
    }
    
    hit_pipe(nearest_pipe){
        nearest_pipe.x 
        nearest_pipe.width 
        nearest_pipe.gap_size 
        nearest_pipe.gap_center
        
        if(this.x >= nearest_pipe.x && this.x <= nearest_pipe.x + nearest_pipe.width){
            if(this.y <= nearest_pipe.gap_center - nearest_pipe.gap_size / 2 ||
               this.y >= nearest_pipe.gap_center + nearest_pipe.gap_size / 2){
                this.crashed = true;
            }
        }
    }
    
    run(inputs, nearest_pipe){
        this.display();
        this.update();
        if(!this.crashed){
            this.calculate_features(inputs);
            this.jump(this.data);
            this.hit_pipe(nearest_pipe);
        }
        this.loop_position();
    }
    
}