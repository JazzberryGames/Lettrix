function LetterPicker() {
	this.letterList = [];
  // wrapps the creation of a LetterValuePair, and appending the letterList
	this.add = function(letter,value,scoreValue) {
		this.letterList.add(new LetterValuePair(letter,this.getSum()+value,scoreValue));
	}

  // get the sum of all the VALUES in the lettervaluepairs stored
	this.getSum = function() {
		if (this.letterList.length == 0) {
			return 0;
		} else {
			return this.letterList[this.letterList.length -1].value;
		}
	}

  // the the Value of the letter
	this.getValue = function(letter) {
		for (var i=0;i<this.letterList.length;i++) {
			if (this.letterList.get(i).letter == letter) {
				return this.letterList.get(i).scoreValue;
			}
		}
	}

  // get a random letter in the list based on their values
	this.getRandomLetter = function() {
		var rand = Math.ceil(Math.random()*this.getSum());	
		var floor = 0;
		for (var i=0;i<this.letterList.length;i++) {
			var ceil = this.letterList.get(i).value;	
			if ((rand <= ceil) && (rand >= floor)) {
				return this.letterList.get(i).letter;
			} else {
				floor = ceil;
			}
		}
	}

  // string rep of the obj
	this.toString = function() {
		var masterString = "";
		for (var i=0;i<this.letterList.length;i++) {
			masterString += " " + this.letterList.get(i) + " ";
		}
		return masterString;
	}

  // we use scrabble values 
	//INITIALIZATION
	this.add('E',24,1);
	this.add('A',18,1);
	this.add('I',18,1);
	this.add('O',16,1);
	this.add('N',9,1);
	this.add('R',9,1);
	this.add('T',9,1);
	this.add('U',8,1);
	this.add('L',6,1);
	this.add('S',6,1);
	this.add('D',6,2);
	this.add('G',5,2);
	this.add('B',3,3);
	this.add('C',3,3);
	this.add('M',3,3);
	this.add('P',3,3);
	this.add('F',3,4);
	this.add('H',3,4);
	this.add('V',2,4);
	this.add('W',2,4);
	this.add('Y',2,4);
	this.add('K',1,6);
	this.add('J',1,9);
	this.add('X',1,9);
	this.add('Q',1,12);
	this.add('Z',1,12);
	
}

// it's like a django model almost, just for data storage
function LetterValuePair(letter,value,scoreValue) {

	this.letter = letter;
	this.value = value;	
	this.scoreValue = scoreValue;

	this.toString = function() {
		return "{ " + letter + " , " + value + " , " + scoreValue + "}";
	}
}
