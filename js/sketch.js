const FPS = 60;
const Canvas_Width = 800;
const Canvas_Height = 600;

const animation_speed = 5;
const bird_population = 5;
const learning_rate = 0.05;
const mutation_rate = 0.05;
const column_rate = 50; //how many frames between each column
const column_gap_pixels = 100;

let matrices = []

function setup() {
    createCanvas(Canvas_Width, Canvas_Height);
    matrices.push(new Matrix(5,5));
}

//Inputs:
//x_position of nearest pipe
//y_position of middle of gap
//y_position of bird
//y_velocity of bird
//x_position of bird
//bias = 1

//all inputs need to be normalized so they don't overload the neurons

function draw() {
    background(125, 100, 125);
    //frameCount 
    frameRate(FPS);
}


