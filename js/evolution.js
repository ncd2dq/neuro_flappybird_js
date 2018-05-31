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
        console.log(current_population[i].fitness);
    }
}

function cross_over(current_population){
    let babies = [];
    for(let i = 0; i < current_population.length; i++){ //fill up the list with place holder birdies
        babies.push(new Bird(bird_brain_layers, bird_brain_nodes_per_layer, 1));
    }
    
    //Iterate over every baby
    for(let z = 0; z < babies.length; z++){
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

        //Synapse0 = parent1's, synapse1 = parent2's, synapse2 = parent1's, ect...
        let every_other = false;
        for(let synapse_number = 0; synapse_number < babies[z].brain.network.length; synapse_number ++){
            if(every_other){
                babies[z].brain.network[synapse_number] = parent2.brain.network[synapse_number];
                every_other = false;
            } else {
                babies[z].brain.network[synapse_number] = parent1.brain.network[synapse_number];
                every_other = true;
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