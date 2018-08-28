# neuro_flappybird_js

Simple flappy game written in Javascript using the p5.Js environment that uses a
neuro-evolutionary deep learning network to train the birds.

<p>The best bird from every generation will get a second chance at life, appearing as the golden bird in the next generation!</p>
<h3>How it works:</h3>
<h4>Neural networks combined with an evolutionary algorithm: neuro-evolution reinforcement learning</h4>
<p>Every bird is given a neural-network filled with a random set of weights. These weights help the bird decide when to jump<br>
by determining how important each input (a.k.a. feature) is. The birds are given 5 different inputs:<br>
1) The x-distance to the nearest pipe<br>
2) The y-position of the middle of the gap<br>
3) The y-position of the bird<br>
4) The current y-velocity of the bird<br>
5) A static bias<br>
<br>
At the end of every generation, the birds are given a fitness score based on how far the bird traveled and go through a cross-over process.<br>
The cross-over process makes the birds "mate" with each other and share information. The process goes as follows: for each layer in their neural<br>
networks, weights are randomly swapped amongst 2 parents. The parents are chosen randomly, but higher fitness birds have a better chance<br>
of being selected as a parent. Finally, the birds weights undergo a mutation process that can randomize any of their weights.<br>
<br>
Over time, the birds will more or less happen upon a fine-tuned set of weights and converge to an optimal solution!<br>
<br>
Note: Because this process is based heavily on the initial set of weights, try refreshing the browser if it's taking a very long time to get<br>
better. Usually the birds will have found a good solution by generation 100!
</p>
