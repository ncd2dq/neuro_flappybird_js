class Pipe{
    constructor(x){
        this.x = x;
        this.width = pipe_width;
        this.gap_size = column_gap_pixels;
        this.gap_center = random(column_gap_min, column_gap_max);
        
        this.x_veloc = pipe_speed;
        
        this.y_min = this.gap_center - this.gap_size / 2;
        this.y_max = this.gap_center + this.gap_size / 2;
        
        this.off_screen = false;
        this.closest = false;
    }
    
    display(){
        if(!this.closest){
            fill(pipe_color);
        } else {
            fill(nearest_pipe_color);
        }
        rect(this.x, this.y_min, this.width, -this.y_min);
        rect(this.x, this.y_max, this.width, Canvas_Height - this.y_max);
    }
    
    update(){
        this.x -= this.x_veloc;
    }
    
    check_position(){
        if(this.x + this.width < 0){
            this.off_screen = true;
        }
    }
    
    run(){
        this.update();
        this.display();
        this.check_position();
    }
    
    
}