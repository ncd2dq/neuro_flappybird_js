//Calculate fitness for all birds
//fitness = distance squared

//have all birds mate and do cross-over

//mututae

//return new population

//if all birds are crashed --> create new generation

function new_population(current_population){
    //Animation setup stuff
    pipes = [];
    initial_pipe_creation(pipes);
    
    frame = 0;
    time_to_evolve = false;
    
    
    //calculate fitness
    calculate_fitness(current_population);
    
    //crossover
    let new_pop = cross_over(current_population);
    
    //mutate
    mutation(new_pop, mutation_rate);
    
    //return new bird population
    return new_pop;
}

function calculate_fitness(current_population){
    let max_fitness = 0;
    
    for(let i = 0; i < current_population.length; i++){
        current_population[i].fitness = Math.pow(current_population[i].distance, 2);
        //maybe add something about staying in the middle?
        if(current_population[i].fitness > max_fitness){
            max_fitness = current_population[i].fitness;
        }
    }
    
    //normalize fitness based on max fitness
    for(let i = 0; i < current_population.length; i++){
        current_population[i].fitness /= max_fitness;
    }
}

function cross_over(current_population){
    let babies = [];
    for(let i = 0; i < current_population.length; i++){ //fill up the list with place holder birdies
        babies.push(new Bird(bird_brain_layers, bird_brain_nodes_per_layer, 1));
    }
    
    //Iterate over every baby
    for(let z = 0; z < babies.length; z++){
        if(z == 0){ // let the very first baby be the best of the last generation so that the fittest continues to survive
            let previous_best;
            for(let prev = 0; prev < current_population.length; prev++){
                if(current_population[prev].fitness == 1){
                    previous_best = current_population[prev];
                    break;
                }
            }
            babies[z].brain.network = previous_best.brain.network;
            babies[z].best_child = true;
            
        } else {
            let parent1 = 0;
            let parent2 = 0;

            //choose parent 1 by having its fitness be higher than a random number
            while(parent1 == 0){
                for(let i = 0; i < current_population.length; i++){
                    if(random() < current_population[i].fitness){
                        parent1 = current_population[i];
                    }
                }
            }
            //choose parent 2 by having its fitness be higher than a random number
            while(parent2 == 0){
                for(let i = 0; i < current_population.length; i++){
                    if(random() < current_population[i].fitness){
                        parent2 = current_population[i];
                    }
                }
            }

            //For every weight it has a random chance of being parent1's weight or parent2's weight
            for(let synapse_number = 0; synapse_number < babies[z].brain.network.length; synapse_number ++){
                for(let row = 0; row < babies[z].brain.network[synapse_number].matrix.rows; row++){
                    for(let col = 0; col < babies[z].brain.network[synapse_number].matrix.cols; col++){
                        if(random() >= 0.5){
                            babies[z].brain.network[synapse_number].matrix[row][col] = parent1.brain.network[synapse_number].matrix[row][col];
                        } else {
                            babies[z].brain.network[synapse_number].matrix[row][col] = parent2.brain.network[synapse_number].matrix[row][col];
                        }
                    }
                }
            }
        }
    }
    
    return babies;
    
    //Find max fitness
}

function mutation(pop_list, rate){
    for(let i = 0; i < pop_list.length; i++){
        for(let j = 0; j < pop_list[i].brain.network.length; j++){
            pop_list[i].brain.network[j].mutate(rate);
        }
    }
}