//GLOABAL VARIABLES

//Store starting values for scoring
var wins = 0;
var losses = 0;

var maxErrors = 10;


//Call method to display correctly guessed letters or underscores in HTML
var wordDisplayLettersElement = document.getElementById("word-display-letters");

//Call method to display the letters guessed; includes all guesses in HTML
var guessedLettersElement = document.getElementById("guessed-letters");

//Call method to display the error count in HTML
var errorCountElement = document.getElementById("error-count");

//Call method to display the number of games won in HTML
var winCountElement = document.getElementById("win-count");

//Call method to display the number of games lost in HTML
var lossCountElement = document.getElementById("loss-count");

//Call methods to flash "Press any key to play" --also hides this during play
var blinkElements = document.getElementsByClassName("blinking");
var alertLineElements = document.getElementsByClassName("alert-line");

//Define valid guesses
var validGuesses = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' ];

//Press any key to start alert
var pressAnyKeyToStart = [
	" --P R E S S---A N Y---L E T T E R---K E Y---T O---S T A R T---"
];

//Press any key to reset alert -- does not work
var pressAnyKeyToReset = [
	" --P R E S S---A N Y---L E T T E R---K E Y---T O---R E S E T---"
];

//You win alert -- does not work
var youWin = [
	" --Y O U---W I N---! ! !---"

//You lose alert -- does not work
];
var youLose = [
	" --Y O U---L O S E---! ! !---"
];

//Displays no alert during play
var emptyAlert = [
	"                              ",
];

//New game function used to restart the game after a win or loss
var game = new guessGame();


// BASIC GAME FUNCTION: WHEN TO START AND STOP

// Listener event to record letter key guesses
document.onkeyup = function(event) {
	var userGuess = event.key;

	// If the game isn't over and the user guesses but doesn't win or lose,
	// the game resumes
	if (!game.gameOver) {
		if (validGuesses.includes(userGuess) && !game.guessedLetters.includes(userGuess)) {
			game.checkGuess(userGuess);
		}
	// Otherwise, the game resets for a new play
	} else {
		game = new guessGame();
		game.updatePageData();
	}
}

// Function to determine when to display "Press any key to play"
// setInterval is passed the game function; while in play
window.setInterval(function() {
	// If no guesses have been made or the game is over...
	if (blinkElements.length > 0) {
		if (game.guessedLetters.length === 0 || game.gameOver) {
			// Blink message goes from opaque to transparent and repeats (i++)
			if (blinkElements[0].style.opacity === "1") {
				for (var i = 0; i < blinkElements.length; i++) {
					blinkElements[i].style.opacity = "0";
				}
			// Otherwise, the "play" message displays without blinking--has opacity
			} else {
				for (var i = 0; i < blinkElements.length; i++) {
					blinkElements[i].style.opacity = "1";
				}
			}
		// Otherwise, the "play" message displays without blinking--has no opacity
		} else {
			for (var i = 0; i < blinkElements.length; i++) {
				blinkElements[i].style.opacity = "0";
			}
		}
	}

}, 750);

// GAME OBJECT WITH GAMEWORDS

//Object with nested array of game words

function guessGame() {
	this.wordList = ["stairs", "bears", "sleigh", "leech", "thug", "axe", "tacks", "sea", "ennui", "mire", "fire", "drain", "train", "ice", "mice", "gin", ]

	//Math.random function to randomly select a game word from the array
	this.word = this.wordList[Math.floor(Math.random() * this.wordList.length)];
	//Stores the letters guessed during gameplay in an empty array
	this.guessedLetters = [];
	//Collects the error count for the game during gameplay
	this.errors = 0;
	//Stores the guessed letters to display
	this.visibleLetters = [];
	//Defines the game state during game play as not over
	this.gameOver = false;
	//Displays the empty alert during game play to mask 'press any key'
	this.alertLines = emptyAlert;
	//Continues as long as the length of the word is less than the letter count
	for (var i = 0; i < this.word.length; i++) {
		this.visibleLetters[i] = (false);
	}
}

// FUNCTION TO VALIDATE LETTER GUESSES

// checkGuess inherits properties from guessGame / returns guessed letter
guessGame.prototype.checkGuess = function(char) {
	// Push method adds the guessed letter to the guessedLetters array
	this.guessedLetters.push(char);
    // Declare isInWord to check the guessed letter against game word
	var isInWord = false;
	// Add the guessed letter to visibleLetters
	for (var i = 0; i < this.word.length; i++) {
		// Add the guessed letter to visible letters; visible letters includes all guesses
		if (this.word.charAt(i) === char) {
			isInWord = true;
			this.visibleLetters[i] = true;
		}
	}
	// If the letter guess isn't in the word, increment the error count by one
	if (!isInWord) {
		this.errors++;
	}

	// If error count is equal to or exceeds the maximum errors allowed
	if (this.errors >= maxErrors) {
		losses++;
		// Alert the user that they lose and the game ends--loss notification not working
		this.alertLines = youLose;
		this.gameOver = true;
	}
	// If the number of letters needed for the game word is met, display win
	// notification and end game -- win notification not working
	if (!this.visibleLetters.includes(false)) {
		wins++;
		this.alertLines = youWin;
		this.gameOver = true;
	}
	// Update game stats-- see function that follows
	game.updatePageData();
};

// Function to update page with guessed letters, error counts, wins, losses, and alerts
guessGame.prototype.updatePageData = function() {
	// Temporary string to display underscores or visible letters
	var tempString = "";
	// Increment visible letters with guess in temp string
	for (var i = 0; i < this.visibleLetters.length; i++) {
		// The string created equals the game word length (i);
		// Displays the letter or underscore
		tempString += ((this.visibleLetters[i] || this.gameOver) ? this.word.charAt(i).toUpperCase() : "_");
		// Don't add to the string if the word length is missing one or more letters
		if (i < (this.visibleLetters.length - 1)) tempString += " ";
	}
	// Pass the letters in temp string to word-display-letters (HTML)
	wordDisplayLettersElement.textContent = tempString;
	// Increment temp string with guessed letter until guessedLetters count is met
	tempString = "";
	for (var i = 0; i < this.guessedLetters.length; i++) {
		tempString += (this.guessedLetters[i].toUpperCase());
		if (i < (this.guessedLetters.length - 1)) tempString += " ";
	}
	
	for (var i = tempString.length; i < 51; i++) {
		tempString += " ";
	}
	// Update guessed letters on page
	guessedLettersElement.textContent = tempString;

	tempString = this.errors + " / " + maxErrors;
	for (var i = tempString.length; i < 32; i++) {
		tempString += " ";
	}
	// Update error count on page
	errorCountElement.textContent = tempString;

	tempString = wins + "";
	for (var i = tempString.length; i < 45; i++) {
		tempString += " ";
	}
	// Update win count on page
	winCountElement.textContent = tempString;

	tempString = losses + "";
	for (var i = tempString.length; i < 43; i++) {
		tempString += " ";
	}
	// Update loss count on page
	lossCountElement.textContent = tempString;

	// Reinstate blink alert to press any key if game ends
	for (var i = 0; i < blinkElements.length; i++) {
		blinkElements[i].textContent = (this.gameOver ? pressAnyKeyToReset[i] : pressAnyKeyToStart[i]);
	}

	for (var i = 0; i < alertLineElements.length; i++) {
		alertLineElements[i].textContent = (this.alertLines[i]);
	}
}

game.updatePageData();
