const FPS = 60;
const Canvas_Width = 600;
const Canvas_Height = 400;

const animation_speed = 5;

const bird_population = 150;
const bird_brain_layers = 1;
const bird_brain_nodes_per_layer = 5;
const learning_rate = 0.05;
const mutation_rate = 0.05;

let alive_bird; 
let dead_bird; 
let best_child_color;
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

//Display onscreen variables
let first_pipe = true;
let generation_num = 0;
let best_distance_num = 0;
let current_distance = 0;
let average_distance = 0;

let graph_x_axis = [];
let average_record = []; //graph y axis
let distance_record = [];
let plot_data;

function setup() {
    let canvas = createCanvas(Canvas_Width, Canvas_Height);
    canvas.parent('sketch-holder');
    
    //Initialize colors here for speed in fill() + stroke()
    alive_bird = color(100,25,100);
    dead_bird = color(255, 0, 0);
    pipe_color = color(100, 50, 200);
    nearest_pipe_color = color(0, 255, 0);
    background_color = color(125, 100, 125);
    best_child_color = color(255, 215, 0);
    
    for(let i = 0; i < bird_population; i ++){
        population.push(new Bird(bird_brain_layers, bird_brain_nodes_per_layer))
    }
    
    initial_pipe_creation(pipes);
    plot_data = document.getElementById("plot_avg");
    Plotly.plot(plot_data, [{
        x: 0,
        y: 0
    }], {xaxis: {title: "Generation"},
         yaxis: {title: "Average Distance"},
        title: "Performance"})
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
        generation_num++;
        if(best_distance_num < current_distance){
            best_distance_num = current_distance;
        }
        distance_record.push(current_distance);
        current_distance = 0;
        calculate_average(distance_record);
        average_record.push(average_distance);
        
        graph_x_axis.push(generation_num);
        
        graph_data();
    }
    
    if(frameCount % 6 == 0){
        display_game_data();
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
            if(!pipe_list[i].closest && !first_pipe){ //If this pipe was not previously the closest, then it must be a new pipe and birds have passed it
                current_distance++;
            }
            first_pipe = false;
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

function calculate_average(record){
    let sum = 0;
    if(record.length >= 1){
        for(let i = 0; i < distance_record.length; i++){
            sum += distance_record[i];
        }
    }
    average_distance = sum / record.length;
    
}

//INTERACTION OF HTML AND JAVASCRIPT
function display_game_data(){    
    let generationElement = document.getElementById("generation");
    generationElement.innerHTML = "Generation: " + generation_num;
    
    let bestDistanceElement = document.getElementById("best_distance");
    bestDistanceElement.innerHTML = "Best Distance: " + best_distance_num;
    
    let currentDistanceElement = document.getElementById("current_distance");
    currentDistanceElement.innerHTML = "Current Distance: " + current_distance;
    
    let avgDistanceElement = document.getElementById("avg_distance");
    avgDistanceElement.innerHTML = "Average Distance: " + average_distance;
}

function graph_data(){    //Everytime this function is called it graphs a new line on the already exisiting graph
    if(generation_num >= 1){
        Plotly.deleteTraces(plot_data, 0);
    }
    //plot(divtagID, data, styling)
    Plotly.plot(plot_data, [{
        x: graph_x_axis,
        y: average_record
    }], {xaxis: {title: "Generation"},
         yaxis: {title: "Average Distance"},
        title: "Performance"
        /*,margin: { t: 0}*/})
    
}