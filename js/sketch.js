const FPS = 60;
const Canvas_Width = 600;
const Canvas_Height = 600;

const animation_speed = 5;

const bird_population = 100;
const bird_brain_layers = 1;
const bird_brain_nodes_per_layer = 5;
const learning_rate = 0.05;
const mutation_rate = 1;

let alive_bird; 
let dead_bird; 

let pipe_color;
let nearest_pipe_color;

let background_color;

const column_rate = 100; //how many frames between each column
const column_gap_pixels = 100;
const column_gap_min = Canvas_Height / 4;
const column_gap_max = Canvas_Height * 3 / 4;
const pipe_width = 50;
const pipe_speed = 2;

let population = [];

let pipes = [];
let closest_pipe;
let features;

let frame = 0;

let time_to_evolve = false;

function setup() {
    createCanvas(Canvas_Width, Canvas_Height);
    
    //Initialize colors here for speed in fill() + stroke()
    alive_bird = color(100,25,100);
    dead_bird = color(255, 0, 0);
    pipe_color = color(100, 50, 200);
    nearest_pipe_color = color(0, 255, 0);
    background_color = color(125, 100, 125);
    
    for(let i = 0; i < bird_population; i ++){
        population.push(new Bird(bird_brain_layers, bird_brain_nodes_per_layer))
    }
    
    initial_pipe_creation(pipes);
}

//Inputs:
//x_distance to nearest pipe
//y_position of middle of gap
//y_position of bird
//y_velocity of bird
//bias = 1

//all inputs need to be normalized so they don't overload the neurons

function draw() {
    frame++;
    background(background_color);
    //frameCount 
    pipe_generator(pipes, frame);
    
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
    time_to_evolve = determine_if_evolution_time(population, time_to_evolve);
    //RUN NEW POPULATION HERE
    if(time_to_evolve){
        population = new_population(population, time_to_evolve);
    }
}


//Helper Functions
function create_features(nearest_pipe){
    //Create inputs matrix and fill in values for standard features (same for all birds)
    //this saves computing power
    //need to normalize these
    let feat = new Matrix(1, 5, type='zero');
    feat.matrix[0][0] = ((nearest_pipe.x + nearest_pipe.width / 2) - population[0].x) / 198; //x_distance to nearest pipe
    feat.matrix[0][1] = nearest_pipe.gap_center / (column_gap_max - column_gap_pixels / 2); //y_position of gap center
    feat.matrix[0][4] = 1; //bias
    //features 2,3 (y_position of bird / y_velocity of bird) must be determined inside bird class
    
    return feat;
}

function pipe_generator(pipe_list, frame){
    if(frame % column_rate == 0){
        pipe_list.push(new Pipe(Canvas_Width));
    }
    
}

function initial_pipe_creation(pipe_list){
    //column_rate = frames per pipe
    //pipe_speed = pixels per frame
    //column_rate * pipe_speed = distance between each pipe
    let offset = column_rate * pipe_speed;
    let number_of_pipes = Canvas_Width / (offset) + 1; //sometimes it needs +1 sometimes it doesnt, depending on column spacing
    for(let i = 0; i < number_of_pipes; i++){
        if(i != 0){
            pipe_list.push(new Pipe(i * offset));
        }
    }
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

function determine_if_evolution_time(pop, flag){
    flag = true;
    for(let i = 0; i < pop.length; i++){
        if(!pop[i].crashed){
            flag = false;
        }
    }
    return flag;
}
