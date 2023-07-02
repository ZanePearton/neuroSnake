# NeuroSnake: A Snake Game Powered by Machine Learning

NeuroSnake is an implementation of the classic Snake game, powered by a Machine Learning model to control the snake. The snake is trained to find its food while avoiding its own tail and the boundaries of the play area.

## Tech Stack

- JavaScript
- TensorFlow.js
- HTML5 Canvas

## How to Play

Simply open `index.html` in your browser to start the game. The snake will start moving on its own, directed by the machine learning model. You can view the current score, high score, and the current generation number on the webpage.

## Project Structure

- `snake.js` contains the logic for the game.
- `tfmodel.js` contains the TensorFlow.js model and associated machine learning functionality.
- `index.html` is the main page that contains the game canvas and score displays.

## Machine Learning

The snake uses a TensorFlow.js model to decide its direction at every step. The model uses five inputs representing the current state of the snake, and outputs a direction for the snake to move. The model is trained with each generation of the snake's movements.

The model uses Mean Squared Error as its loss function, and is optimized using the Adam optimizer.

## Training

Training data is generated as the snake moves and interacts with the environment. Once a game ends, the collected data from that game is used to further train the model. Over time, the model becomes more proficient at controlling the snake, leading to longer games and higher scores.

## Future Plans

We plan to further optimize the performance of the machine learning model, and implement more sophisticated training strategies.

## Contribution

Feel free to open issues, send pull requests or contact us directly, if you want to contribute to this project. All contributions are welcomed!

---

Please customize this template to better suit your project, especially the `Future Plans` and `Contribution` sections.