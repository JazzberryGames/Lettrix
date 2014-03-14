/* This is a thin wrapper for the $WordList array 
   As its name would suggest, it's used to see if
   words are in the wordlist
*/
function Dictionary() {
	this.wordList = $WordList;
	this.check = function(s) {
    // we only want 3+ letter words
		if (s.length > 2) {
			s = s.toLowerCase()
			return (this.wordList.containsSorted(s));
		} else {
			return false;
		}
	}
}
