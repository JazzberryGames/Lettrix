/* almost like a django model 
   just for data storage really
*/
function Word(startX,startY,endX,endY,s) {
	this.startX = startX;
	this.startY = startY;
	this.endX = endX;
	this.endY = endY;
	this.word = s;

	this.toString = function() {
		return "{ " + this.word + ", (" + this.startX + "," + this.startY + ") , (" + this.endX + "," + this.endY + ") }";
	}

}
