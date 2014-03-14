/* This is a driver class. It also contains all the information relateive to the state of the game */

$MINIMUM_HEALTH = 100;
$HEALTH_PENALTY = 5;

function Environment() {

    // get a board with no words on it
    this.initBoard = function() {
        this.board = this.getRandomBoard();
        var wordList = [];
        while ((wordList = this.checkForWords()).length != 0) {
            this.removeAll(wordList);
            this.drop();
            this.fill();
        }
    }

    // fill in blank spots with random letters
    this.fill = function() {
        for (var row=0;row<8;row++) {
            for(var col=0;col<8;col++) {
                if(this.get(row,col) == "-") {
                    this.set(row,col,this.getRandomLetter());
                }
            }
        }
    }

    // make sure all the empty spots are at at the top of the column
    this.drop = function() {
        for (var row=7;row >=0;row--) {
            for (var col=0;col<8;col++) {
                if (this.get(row,col) == "-") {
                    checkSet = [];
                    for (var row2=row;row2>0;row2--) {
                        this.set(row2,col,this.get(row2-1,col));
                        checkSet.add(this.get(row2-1,col));
                    }
                    this.set(0,col,"-");
                    for (var i=0;i<checkSet.length;i++) {
                        if (checkSet[i]!="-") {
                            col--;
                            break;
                        }
                    }
                }
            }
        }
    }

    // remove all of the words in "words"
    this.removeAll = function(words) {
        for(var q=0;q<words.length;q++) {
            var w = words.get(q);
            if (w.startX == w.endX) {
                if (w.startY < w.endY) {
                    for (var i=w.startY;i<=w.endY;i++) {
                        this.set(w.startX, i, "-");
                    }
                } else {
                    for (var i=w.startY;i>=w.endY;i--) {
                        this.set(w.startX, i, "-");
                    }
                }
            } else {
                if (w.startX < w.endX) {
                    for (var i=w.startX;i<=w.endX;i++) {
                        this.set(i, w.startY, "-");
                    }
                } else {
                    for (var i=w.startX;i>=w.endX;i--) {
                        this.set(i, w.startY, "-");
                    }
                }
            }
        }
    }

    // quick access to the state of the board, for early debugging
    this.print = function() {
        alert(this.toString());
    }

    // get the letter at (row,col)
    // if it doesn't exist return false
    this.get = function(row,col) {
        var retVal = this.board[row];
        if (retVal == undefined) {
            return false;
        } else {
            retVal = retVal[col];
        }
        return (retVal == undefined)?false:retVal;
    }

    // set the letter s at (row,col)
    this.set = function(row,col,s) {
        this.board[row][col] = s;
    }

    // set the entire board
    this.setBoard = function(board) {
        this.board = board;
        this.updateBoard();
    }

    // get a random board
    this.getRandomBoard = function() {
        var board = [];
        for(var i=0;i<8;i++) {
            var row = [];
            for (var j=0;j<8;j++) {
                row.add(this.getRandomLetter());
            }
            board.add(row);
        }
        return board;
    }

    // use the letterPicker to get a random letter
    // note: we use this so that we can easily adjust how often letters appear
    this.getRandomLetter = function() {
        return this.letterPicker.getRandomLetter();
    }

    // get a list of all valid words present in the puzzle
    this.checkForWords = function() {
        var returnList = [];
        var wordList = this.getAllPossibleWords();
        for(var i=0;i<wordList.length;i++) {
            var w = wordList.get(i);
            if (this.dictionary.check(w.word)) {
                returnList.add(w);
            }
        }
        return returnList;
    }

    // this is broken up ALOT to avoid some 10-tier for loop (although that's essentially  what it is)
    this.getAllPossibleWords = function() {
        var returnList = this.getAllPossibleWordsInAllRows();
        returnList.addAll(this.getAllPossibleWordsInAllCols());
        return returnList;
    }		

    this.getAllPossibleWordsInAllRows = function() {
        var masterList = [];
        for (var i=0;i<8;i++) {
            masterList.addAll(this.getAllPossibleWordsInRow(i));
        }
        return masterList;
    }

    this.getAllPossibleWordsInAllCols = function() {
        var masterList = []
            for (var i=0;i<8;i++) {
                masterList.addAll(this.getAllPossibleWordsInCol(i));
            }
        return masterList;
    }

    this.getRow = function(row) {
        return this.board[row];
    }

    this.getCol = function(col) {
        var column = [];
        for (var i=0;i<8;i++) {
            column.add(this.get(i,col));
        }
        return column;
    }

    this.getAllPossibleWordsInCol = function(col) {
        var wordList = [];
        var boardCol = this.getCol(col);
        for (var k=0;k<8;k++) {
            for (var i=k;i<8;i++) {
                var masterString = "";
                for (var j=k;j<=i;j++) {
                    masterString += boardCol.get(j);
                }
                wordList.add(new Word(k,col,i,col,masterString));
                wordList.add(new Word(i,col,k,col,this.reverseString(masterString)));
            }
        }
        return wordList;
    }

    this.getAllPossibleWordsInRow = function(row) {
        var wordList = [];
        var boardRow = this.getRow(row);
        for (var k=0;k<8;k++) {
            for (var i=k;i<8;i++) {
                var masterString = "";
                for (var j=k;j<=i;j++) {
                    masterString += boardRow.get(j);
                }
                wordList.add(new Word(row,k,row,i,masterString));
                wordList.add(new Word(row,i,row,k,this.reverseString(masterString)));
            }
        }
        return wordList;
    }

    // reverse a string!
    this.reverseString = function(s) {
        return s.split("").reverse().join("");
    }

    // return an 8x8 block representing the board
    this.toString = function() {
        var masterString = "";
        for (var i=0;i<this.board.length;i++) {
            var row = this.board.get(i);
            for (var j=0;j<row.length;j++) {
                var s = row.get(j);
                masterString += s;
            }
            masterString += "\n";
        }
        return masterString;
    }

    // overriding a method? quick data access, for early debugging
    this.print = function() {
        console.log(this.toString());
    }

    // here the parent element must have property element.style.position = 'relative';
    // we absolutely position all the elements and give it a top/left offset
    // this is to make the animation easier (as opposed to using a table)
    this.printSelfToDiv = function(element) {
        //console.log(this.toString());
        var offset = 40;
        var widthCorrection = 10;
        var masterString = "";
        element.style.position = 'relative';
        var height = this.board.length*offset;
        var width  = this.board.get(0).length*offset;
        for (var i=0;i<this.board.length;i++) {
            for (var j=0;j<this.board.get(i).length;j++) {
                var letter = this.board.get(i).get(j);
                var offsettop = i*offset;
                var offsetleft= j*offset;
                masterString += "<div id=" + i + "" + j + " row=" + i + " col=" + j + " onclick='document.body.handleClick(this);' style='font-family:Arial; font-size:25pt; text-align:center;  cursor:pointer; border-style:solid; border-color:rgba(0,0,0,0); position:absolute; color:rgba(256,256,256,1); top:" + offsettop + "px; left:" + offsetleft + "px;' >" + letter + "</div>";
            }
        }
        element.style.height = height + "px";
        element.style.width  = (width - widthCorrection)  + "px"; 
        element.height = height + "px";
        element.width  = (width - widthCorrection)  + "px";
        element.innerHTML = masterString;
    }

    // print score to this div... will be animated eventually
    this.printDisplayScoreToDiv = function(element) {
        element.innerHTML = this.getScoreWithZeros(this.displayScore);
    }

    this.getScoreWithZeros = function(score) {
        var score = "" + score + "";
        var masterString = "";
        for (var i=0;i<6-score.length;i++) {
            masterString += "0";
        }
        return masterString + score;
    }

    // this way, every two clicks gets processed as a swap
    this.handleClick = function(element) {
        var row = element.attributes.row.value;
        var col = element.attributes.col.value;
        if (this.click) {
            this.unhighlightClick(this.click);
            this.swap(row,col,this.click.row,this.click.col);
            this.click = false;
        } else {
            var click = new Object();
            click.row = row;
            click.col = col;
            this.click = click;
            this.highlightClick(this.click);
        }
    }

    this.highlightClick = function(click) {
        var ele = this.getElement(click.row,click.col);
        ele.style.borderStyle = 'solid';
        ele.style.borderColor = 'white';
    }

    this.unhighlightClick = function(click) {
        var ele = this.getElement(click.row,click.col);
        ele.style.borderColor = 'rgba(0,0,0,0)';
    }

    // make sure the swap is valid, and that it makes new words before actually swapping
    this.swap = function(row1,col1,row2,col2) {
        var distance = Math.abs(row1-row2) + Math.abs(col1-col2);
        if (distance == 1) {
            var ele1 = this.get(row1,col1);
            var ele2 = this.get(row2,col2);
            this.set(row1,col1,ele2);
            this.set(row2,col2,ele1);
            if (this.checkForWords().length != 0) {
                console.log("-----MOVE-----");
                this.animateValidSwap(row1,col1,row2,col2);
                this.resetHighestScoringWord();
            } else {
                console.log("ERROR: NO NEW WORDS");
                this.set(row1,col1,ele2);
                this.set(row2,col2,ele1);
                this.animateValidSwap(row1,col1,row2,col2);
                this.penalizeHealth();
            }
        } else {
            console.log("ERROR: SWAP INVALID");
        }
    }

    this.penalizeHealth = function() {
        this.health -= $HEALTH_PENALTY;
    }

    // callback for the animation function
    this.afterValidSwap = function() {
        this.evalMove();
        this.boardHistory.add(this.board);
        this.updateBoard();
    }

    this.resetHighestScoringWord = function() {
        this.highestScoringWord.word = '';
        this.highestScoringWord.score = 0;
    }

    // slide the two letters over one another
    this.animateValidSwap = function(row1,col1,row2,col2) {
        this.animating = true;
        var ele1 = this.getElement(row1,col1);
        var ele2 = this.getElement(row2,col2);
        var total = 250;
        var steps = 144;
        if (row1 != row2) {
            var css = 'top';
        } else {
            var css = 'left';
        }
        var diff1 = parseFloat(ele2.style[css])-parseFloat(ele1.style[css]);
        var diff2 = parseFloat(ele1.style[css])-parseFloat(ele2.style[css]);
        var anim1 = new h4x_anim(ele1,css,diff1,total,steps);
        var anim2 = new h4x_anim(ele2,css,diff2,total,steps,
                function(self) {
                document.body.environment.animating = false;
                document.body.environment.afterValidSwap();
                });
        h4x_fx.add([anim1,anim2]);
        h4x_fx.run();
    }

    // slide two letters over each other, and back
    this.animateInvalidSwap = function(row1,col1,row2,col2) {
        this.animating = true;
        var ele1 = this.getElement(row1,col1);
        var ele2 = this.getElement(row2,col2);
        var total = 250;
        var steps = 100;
        // if they're on top of one another
        if (row1 != row2) {
            var css = 'top';
        } else {
            var css = 'left';
        }
        var diff1 = parseFloat(ele2.style[css])-parseFloat(ele1.style[css]);
        var diff2 = parseFloat(ele1.style[css])-parseFloat(ele2.style[css]);
        var anim1 = new h4x_anim(ele1,css,diff1,total,steps);
        var anim2 = new h4x_anim(ele2,css,diff2,total,steps);
        var anim3 = new h4x_anim(ele1,css,diff2,total,steps);
        var anim4 = new h4x_anim(ele2,css,diff1,total,steps,function(self) {document.body.environment.animating = false;});
        h4x_fx.add([anim1,anim2]);
        h4x_fx.add([anim3,anim4]);
        h4x_fx.run();
    }

    // get the html element in row,column
    this.getElement = function(r,c) {
        return document.getElementById(r+''+c);
    }

    // keep dropping and filling until no words left
    this.evalMove = function() {
        var wordList = [];
        while ((wordList = this.checkForWords()).length != 0) {
            this.evalScore(wordList);
            this.removeAll(wordList);
            this.drop();
            this.fill();
        }
    }

    // adjust the score based on the wordList
    this.evalScore = function(wordList) {
        for (var i=0;i<wordList.length;i++) {
            var word = wordList.get(i).word;
            // formula for calculating the score of each word
            var wordScore = Math.pow(this.getWordScore(word),word.length-2);

            // setting the new high score word
            if (wordScore > this.highestScoringWord.score) {
                this.highestScoringWord.word = word;
                this.highestScoringWord.score = wordScore;
            }

            // increase score
            this.score += wordScore;

            // increase health
            this.health += wordScore/10;
            console.log(wordList.get(i).word + " - " + wordScore + " - " + this.score);
        }
    }

    // score an individual word
    this.getWordScore = function(w) {
        var word = w.split("");
        var sum = 0;
        for (var i=0;i<word.length;i++) {
            sum += this.letterPicker.getValue(word.get(i));
        }
        return sum;
    }

    // returns an array of all moves that would create a new word
    this.getPossibleMoves = function() {
        var moves = this.getSetOfValidMoves();
        var returnArray = [];
        for (var i=0;i<moves.length;i++) {
            if (this.moveIsValid(moves[i])) {
                returnArray.add(moves[i]);
            }
        }
        return returnArray;
    }

    // here we color the boarder of all the elements that are part of a possible move green
    // then we remove the border between possible swaps
    this.showPossibleMoves = function() {
        var possibleMoves = this.getPossibleMoves();
        if (possibleMoves.length == 0) {
            console.log("ERROR NO POSSIBLE MOVES");
        }
        for(var i=0;i<possibleMoves.length;i++) {
            this.colorElements(possibleMoves[i],'green');
        }
        for(var i=0;i<possibleMoves.length;i++) {
            this.showMove(possibleMoves[i]);
        }
    }

    // color the border of all the elements in the move the designated color
    this.colorElements = function(move,color) {
        var ele1 = document.getElementById(move[0] + "" + move[1]);
        var ele2 = document.getElementById(move[2] + "" + move[3]);
        ele1.style.borderColor = color;
        ele2.style.borderStyle = color;	
    }

    // remove the border in between the move
    this.showMove = function(move) {
        var ele1 = document.getElementById(move[0] + "" + move[1]);
        var ele2 = document.getElementById(move[2] + "" + move[3]);
        if (ele1.attributes.row.value == ele2.attributes.row.value) {
            if (ele1.attributes.col.value > ele2.attributes.col.value) {
                ele1.style.borderLeftColor = 'white';
                ele2.style.borderRightColor = 'white';
            } else {
                ele1.style.borderRightColor = 'white';
                ele2.style.borderLeftColor = 'white';
            }
        } else {
            if (ele1.attributes.row.value > ele2.attributes.row.value) {
                ele1.style.borderTopColor = 'white';
                ele2.style.borderBottomColor = 'white';
            } else {
                ele1.style.borderBottomColor = 'white';
                ele2.style.borderTopColor = 'white';
            }
        }
    }

    // go thru all the elements and try to swap it with it's neighbors
    this.getSetOfValidMoves = function() {
        var returnArray = [];
        for (var i=0;i<8;i++) {
            for (var j=0;j<8;j++) {
                if (this.get(i,j+1)) returnArray.add([i,j,i,j+1]); 
                if (this.get(i,j-1)) returnArray.add([i,j,i,j-1]);
                if (this.get(i+1,j)) returnArray.add([i,j,i+1,j]);
                if (this.get(i-1,j)) returnArray.add([i,j,i-1,j]);
            }
        }
        return returnArray;
    }

    // if there are new words created after the move is made, it's valid
    this.moveIsValid = function(move) {
        var ele1 = this.get(move[0],move[1]);
        var ele2 = this.get(move[2],move[3]);
        this.set(move[0],move[1],ele2);
        this.set(move[2],move[3],ele1);
        var retVal = true;
        if (this.checkForWords().length == 0) {
            retVal = false;
        }
        this.set(move[0],move[1],ele1);
        this.set(move[2],move[3],ele2);
        return retVal;
    }

    // play thru until there are no moves left!
    this.getPlayReport = function() {
        var moves = [];
        while ((moves = this.getPossibleMoves()).length != 0) {
            this.swap(moves[0][0],moves[0][1],moves[0][2],moves[0][3]);
        }
        console.log("No more possible moves");
    }

    // overwrite the innerHTML of the game container
    this.updateBoard = function() {
        this.printSelfToDiv(document.getElementById('game-container'));
        this.printDisplayScoreToDiv(document.getElementById('score'));
    }

    this.styleHealthBar = function() {
        this.healthBar.style.height= '45px';
        this.healthBar.style.background = '-webkit-linear-gradient(right, #fff432 0%,#ff0000 100%)';
        //this.healthBar.style.borderRadius = '10px';
        this.healthBar.style.padding = '10px';
        this.healthBar.style.textAlign = 'center';
        this.healthBar.style.textTransform = 'uppercase';
        this.healthBar.style.color = 'white';
        this.healthBar.style.fontSize = '36px';
        this.healthBar.style.letterSpacing = '2px';
        this.healthBar.innerText = "start!";
    }

    this.updateHealthBar = function() {
        this.healthBar.style.width = this.health + 'px';
        this.healthBar.style.borderRadius = '10px';
        this.healthBar.innerText = this.highestScoringWord.word;
        if (this.health < $MINIMUM_HEALTH) {
            this.gameOver();
        }
    }

    this.gameOver = function() {
        this.scoreThread.stop();
        this.healthThread.stop();

        var overlay = document.createElement("div");
        overlay.setAttribute("id", "overlay");
        document.body.appendChild(overlay);
        
        var gameOverText = document.createElement("div");
        gameOverText.setAttribute("id", "gameOver");
        gameOverText.innerText = "Game Over";
        document.body.appendChild(gameOverText);
    }

    // INITIALIZATION
    this.displayScore = 0;
    this.score = 0;
    this.highestScoringWord = {
        'word' : '',
        'score' : 0,
    }
    this.click = false;
    this.animating = false;
    this.letterPicker = new LetterPicker();
    this.dictionary = new Dictionary();
    this.initBoard();
    this.boardHistory = []; 
    this.boardHistory.add(this.board);
    this.health = 310;
    this.healthLoss = 2;
    this.healthTimer = 500; // milliseconds in between decrementing health
    this.healthBar = document.getElementById('health-bar');
    this.updateHealthBar();
    this.styleHealthBar();

    this.scoreThread = new h4x_Thread(
            this,
            function (self) {
                if (self.displayScore < self.score) {
                    // increment score by a factor of the change in score
                    self.displayScore += Math.ceil((self.score-self.displayScore) / 30);
                    self.printDisplayScoreToDiv(document.getElementById('score'));
                }
            },
            3);
    this.scoreThread.run();

    this.healthThread = new h4x_Thread(
            this,
            function (self) {
            self.health = self.health - self.healthLoss;
            self.updateHealthBar();
            },
            this.healthTimer);
    this.healthThread.run();

    document.body.handleClick = function(element) {
        if (!this.environment.animating) {
            this.environment.handleClick(element);
        }
    }

    document.body.environment = this;
}
