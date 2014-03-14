$h4x_letterList = "abcdefghijklmnopqrstuvwxyz";

Array.prototype.sortAscending = function() {
	return this.sort(h4x_private_sortA);
}
Array.prototype.sortDescending= function() {
	return this.sort(h4x_private_sortD);
}
function h4x_private_sortA(a,b) {
	if (a.compareTo) {
		return a.compareTo(b);
	} else {
		return a-b;
	}
}
function h4x_private_sortD(a,b) {
	if (b.compareTo) {
		return b.compareTo(a);
	} else {
		return b-a;
	}
}
Array.prototype.min = function() {
	var min = this[0];
	if (this[0].compareTo) {
		for (var i=0;i<this.length;i++) {
			if (this[i].compareTo(min) < 0) {
				min = this[i];
			}
		}
		return min;
	} else {
		for (var i in this) {
			if (this[i] < min) {
				min = this[i];
			}
		}
		return min;
	}
}
Array.prototype.max = function() {
	var max = this[0];
	if (this[0].compareTo) {
		for (var i=0;i<this.length;i++) {
			if (this[i].compareTo(max) > 0) {
				max = this[i];
			}
		}
		return max
	} else {
		for (var i in this) {
			if (this[i] > max) {
				max = this[i];
			}
		}
		return max;
	}
}
Array.prototype.add = function(item) {
	this[this.length] = item;
}
Array.prototype.get = function(index) {
	return this[index];
}
Array.prototype.addAll = function(list) {
	for (var i=0;i<list.length;i++) {
		this[this.length] = list[i];
	}
}
Array.prototype.findSorted = function(item) {
	return this.findSortedSlave(item,0,this.length-1);
}
Array.prototype.findSortedSlave = function(item,low,high) {
	if (high < low) {
		return -1;
	}
	mid = Math.floor(low + (high - low) / 2);
	if (this.get(mid) > item) {
		return this.findSortedSlave(item,low,mid-1);
	} else if (this.get(mid) < item) {
		return this.findSortedSlave(item,mid+1,high);
	} else {
		return mid;
	}
}
Array.prototype.find = function(item) {
	for (var i=0;i<this.length;i++) {
		if (this[i].equals) {
			if (this[i].equals(item)) {
				return i;
			}
		} else if (this[i].compareTo) {
			if (this[i].compareTo(item) == 0) {
				return i;
			}
		} else if (this[i] == item) { 
			return i;
		}
	}
	return -1;
}
Array.prototype.findAll = function(item) {
	var returnArray = [];
	for (var i=0;i<this.length;i++) {
		if ([this[i]].contains(item)) {
			returnArray.add(i);
		}
	}
	return returnArray;
}
Array.prototype.contains = function(item) {
	return (this.find(item) != -1);
}
Array.prototype.containsSorted = function(item) {
	return (this.findSorted(item) != -1);
}
Array.prototype.do = function(thingToBeDone) {
	for (var i=0;i<this.length;i++) {
		this[i] = thingToBeDone(this[i]);
	}
}
Array.prototype.remove = function(item) {
	if (this.contains(item)) {
		var newArray = []
		var index = this.find(item);
		for (var i=0;i<this.length;i++) {
			if (i != index) {
				newArray[newArray.length] = this[i]; 
			}
		}
		return newArray;
	} else {
		return null;
	}
}
Array.prototype.removeByIndex = function(index) {
	var newArray = [];
	for (var i=0;i<this.length;i++) {
		if(i != index) {
			newArray[newArray.length] = this[i];
		}
	}
	return newArray;
}
Array.prototype.removeAll = function(item) {
	var newArray = [];
	newArray = newArray.concat(this);
	while (newArray.contains(item)) {
		newArray = newArray.remove(item);
	}
	return newArray;
}
Array.prototype.removeDuplicates = function() {
	var newArray = [];
	for (var i=0;i<this.length;i++) {
		if (!newArray.contains(this[i])) {
			newArray.add(this[i]);
		}
	}
	return newArray;
}
Array.prototype.sumify = function() {
  var sum = 0;
  var newArray = [];
  for (var i=0;i<this.length;i++) {
    sum += this[i];
    newArray[i] = sum;
  }
  return newArray;
}
Array.prototype.sumifyIgnoreFirst = function() {
  var sumified = this.sumify();
  var newArray = [0];
  for (var i=0;i<sumified.length-1;i++) {
    newArray.push(sumified.get(i));
  }
  return newArray;
}
function h4x_setRefresh(ms) {
	setTimeout("window.location.reload()",ms);
}
function h4x_initCanvas() {
	var byId = document.getElementById('canvas');
	var byId2= document.getElementById('Canvas');
	var byTag= document.getElementsByTagName('canvas')[0];
	if (byId) {
		$canvas = byId;
	} else if(byId2) {
		$canvas = byId2;
	} else if(byTag) {
		$canvas = byTag;
	} else {
		$canvas = null;
	}
	if ($canvas != null) {
		$ctx = $canvas.getContext('2d');
		$ctx.setCenter = function() {
			this.translate(this.canvas.width/2,this.canvas.height/2);
			this.isCentered = true;
		}
		$ctx.clear = function() {
			if (!this.isCentered) {
				this.clearRect(0,0,this.canvas.width,this.canvas.height);
			} else {
				this.clearRect(-(this.canvas.width/2),-(this.canvas.height/2),this.canvas.width,this.canvas.height);
			}
		}
		$ctx.drawLine = function(x1,y1,x2,y2) {
			this.beginPath();
			this.moveTo(x1,y1);
			this.lineTo(x2,y2);
			this.stroke();
		}
		$ctx.polygon = function(points,stroke) {
			this.beginPath();
			this.moveTo(points[0][0],points[0][1]);
			for (var i=0;i<points.length;i++) {
				this.lineTo(points[i][0],points[i][1]);
			}
			this.closePath();
			if (stroke) {
				this.stroke();
			} else {
				this.fill();
			}
		}
		$ctx.drawPolygon = function(points) {
			this.polygon(points,true);
		}
		$ctx.fillPolygon = function(points) {
			this.polygon(points,false);
		}
	} else {
		throw "0h N0e5! N0 C4nv@$ F0UND ";
	}
}
function h4x_createCanvas(border,width,height) {
	var w = (width)?width:600;
	var h = (height)?height:400;
	var b = (border)?"style='border-style:solid;'":"";
	document.body.innerHTML += "<center><canvas width=" + w + " height=" + h + " " + b + "></center>";
	h4x_initCanvas();
}
function h4x_get(id) {
	return document.getElementById(id);
}

function randInt(a,b) {
	return Math.floor(Math.random()*(b-a)+a);
}

function randLet() {
	return $h4x_letterList[randInt(0,$h4x_letterList.length)];
}

function Vector(x,y) {
	// each vector has an x and a y component (default 0,0)
	this.x = (x)?x:0;
	this.y = (y)?y:0;

	// multiply two vectors or a vector and a scalar
	this.multiply = function(factor) {
    if (factor.x) {
		  return new Vector(this.x*factor.x,this.y*factor.y);
    } else {
      return new Vector(this.x*factor,this.y*factor);
    }
	}

	// add two vectors
	this.add = function(that) {
		return new Vector(this.x+that.x,this.y+that.y);
	}

	// subtract two vectors
	this.subtract = function(that) {
		return new Vector(this.x-that.x,this.y-that.y);
	}
	
	// reverse a vector
	this.reverse = function() {
		return new Vector(-this.x,-this.y);
	}

	// more like "setLength"
	// scales a vector to a length of "factor"
	this.scale = function(factor) {
		var unit = this.unit();
		return new Vector(unit.x*factor,unit.y*factor);
	}

	// scales it to a unit vector
	this.unit = function() {
		var len = this.length();
		return new Vector(this.x/len,this.y/len);
	}

	// get angle
	this.getAngle = function() {
		return Math.atan(this.x/this.y);
	}

	this.getAngle2= function() {
		return Math.atan(this.y/this.x);
	}	

	// length of the vector
	this.length = function() {
		return this.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2));
	}

	this.lengthSquared = function() {
		return Math.pow(this.x,2)+Math.pow(this.y,2);
	}

	this.equals = function(that) {
		return (this.x == that.x && this.y == that.y); 
	}

	this.compareTo = function(that) {
		return this.length()-that.length();
	}


	// NEEDS TO BE FASTER
	// a simple square root function
	this.sqrt = function(x) {
		return Math.sqrt(x);
	}

	this.toArray = function() {
		return [this.x,this.y];
	}

	// toString
	this.toString = function() {
		return '(' + this.x + ',' + this.y + ')';
	}

}

// this is a  thin, but incredibly useful wrapper for setInterval / setTimeout
// the problem with setInterval / setTimeout, is that when you pass it a function
// the "this" variable is set to the window objeect...
// this allows you to pass it a variable to be used in the function, usually the current object
function h4x_Thread(self,func,time) {
	this.self = self;
	this.func = func;
	this.time = time;

	this.run = function() {
		var self = this;
		this.interval = setInterval(function() {self.func(self.self);},self.time);
	}

	this.stop = function() {
		clearInterval(this.interval);
	}

	this.stopIn = function(ms) {
		var self = this;
		setTimeout(function() {self.stop()},ms);
	}

	this.runOnce = function() {
    var self = this;
		setTimeout(function() {self.func(self.self);},self.time);
	}

	this.runOnceNoDelay = function() {
		this.func(this.self);
	}
}
// manage animation threads
function h4x_efx() {
  this.buffer = [];
  this.add = function(anims) {
    var threads = [];
    for (var i=0;i<anims.length;i++) {
      threads.push(anims.get(i).toThread());
    }
    this.buffer.push(threads);
  }
  this.run = function() {
    for (var i=0;i<this.buffer.length-1;i++) {
      var thread = this.get_longest_thread(this.buffer.get(i))[0];
      thread.self.nextThreadSet = this.buffer.get(i+1);
      thread.self.runNextThreadSet = function(self) {
        for (var i=0;i<self.nextThreadSet.length;i++) {
          self.nextThreadSet.get(i).run();
        }
      }
    }
    for (var i=0;i<this.buffer.get(0).length;i++) {
      this.buffer.get(0).get(i).run();
    }
    this.buffer = [];
  }
  this.get_longest_thread = function(threadSet) {
    var max = -1;
    var thread = null;
    for (var i=0;i<threadSet.length;i++) {
      if (threadSet[i].self.totalTime > max) {
        max = threadSet[i].self.totalTime;
        thread=threadSet[i];
      }
    }
    return [thread,max];
  }
}
// allows for easy creations of animation threads
function h4x_anim(ele,css_prop,change,totalTime,steps,oncomplete) {
  this.ele = ele;
  this.css_prop = css_prop;
  this.change = change;
  this.totalTime = totalTime;
  this.curStep = 0;
  this.steps = steps;
  this.stepSize = (this.change/this.steps);
  this.stepTime = (this.totalTime/this.steps);
  this.oncomplete = oncomplete;
  this.toThread = function() {
    var thread =  new h4x_Thread(
      this,
      function(self) {
        self.curStep++;
        self.ele.style[self.css_prop] = self.px_to_num(self.ele.style[self.css_prop]) + self.stepSize;
        if (self.curStep == self.steps-1) {
          this.stop();
          if (self.oncomplete) {
            self.oncomplete(self);
          }
          if (self.runNextThreadSet) {
            self.runNextThreadSet(self);
          }
        }
      },
      this.stepTime);
    return thread;
  }
  this.px_to_num = function(css) {
    return parseFloat(css.replace('px',''));
  }
}
// usually only one instance of h4x_efx is needed, so it's good to provide one
// however you can still instanciate multiple onces if needed
h4x_fx = new h4x_efx();
