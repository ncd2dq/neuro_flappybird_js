const FPS = 60;
const Canvas_Width = 800;
const Canvas_Height = 600;

const animation_speed = 5;

const bird_population = 5;
const bird_brain_layers = 2;
const bird_brain_nodes_per_layer = 5;
const learning_rate = 0.05;
const mutation_rate = 0.05;

const column_rate = 50; //how many frames between each column
const column_gap_pixels = 100;
const column_gap_min = Canvas_Height / 4;
const column_gap_max = Canvas_Height * 3 / 4;
const pipe_width = 50;
const pipe_speed = 2;

let population = [];

let pipes = [];
let closest_pipe;
let features;

function setup() {
    createCanvas(Canvas_Width, Canvas_Height);
    for(let i = 0; i < bird_population; i ++){
        population.push(new Bird(bird_brain_layers, bird_brain_nodes_per_layer))
    }
    
    for(let i = 0; i < 50; i++){
        pipes.push(new Pipe(i * 150));
    }
}

//Inputs:
//x_distance to nearest pipe
//y_position of middle of gap
//y_position of bird
//y_velocity of bird
//bias = 1

//all inputs need to be normalized so they don't overload the neurons

function draw() {
    background(125, 100, 125);
    //frameCount 
    
    
    //Handle Pipes
    for(let i = 0; i < pipes.length; i++){
        pipes[i].run();
    }
    remove_pipes(pipes);
    closest_pipe = find_closest_pipe(pipes);
    
    features = create_features(closest_pipe);
        
    //Deliver inputs to the birds
    for(let i = 0; i < bird_population; i++){
        population[i].run(features, closest_pipe);
    }
    
    
    frameRate(FPS);
}


//Helper Functions
function create_features(nearest_pipe){
    //Create inputs matrix and fill in values for standard features (same for all birds)
    //this saves computing power
    //need to normalize these
    let feat = new Matrix(1, 5, type='zero');
    feat.matrix[0][0] = ((nearest_pipe.x + nearest_pipe.width / 2) - population[0].x) / 150; //x_distance to nearest pipe
    feat.matrix[0][1] = nearest_pipe.gap_center / (column_gap_max - column_gap_pixels / 2); //y_position of gap center
    feat.matrix[0][4] = 1; //bias
    //features 2,3 (y_position of bird / y_velocity of bird) must be determined inside bird class
    
    return feat;
}


function remove_pipes(pipe_list){
    for(let i = pipe_list.length - 1; i >= 0; i--){
        if(pipe_list[i].off_screen == true){
            pipe_list.splice(i, 1);
        }
    }
    
}

//All birds have the same x, so just sample 1 bird to find the closest pipe
//Since the pipe list is in order, the first pipe to have a positive subtraction of 
//bird.x from pipe.x is the closest pipe
function find_closest_pipe(pipe_list){
    for(let i = 0; i < pipe_list.length; i++){
        if((pipe_list[i].x + pipe_list[i].width / 2) - population[0].x > 0){
            pipe_list[i].closest = true;
            return pipe_list[i];
        } else {
            pipe_list[i].closest = false;
        }
    }
}
