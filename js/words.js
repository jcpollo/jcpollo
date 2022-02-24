

function WordleHelper(){
	
	this.wordList = [];
	this.allWords =[];
	//this.wordList = wordList;
	//this.currentFilteredList = wordList.map((x) => x);

	this.RandomWord = function(){
		if(this.wordList.length>0){
			const idx = Math.floor(Math.random()*this.wordList.length);
			return this.wordList[idx];
		}else{
			return "None available";
		}
	};

	this.LoadWordList = function(wordList){
		this.wordList = wordList;
		this.allWords = wordList.slice();
	};

	this.Filter = function(wordState){
		const greenIdx = 
			wordState.data.map((e,i) => e.status == 'green' ? i : null ).filter((e) => e != null);
		const yellowIdx = 
			wordState.data.map((e,i) => e.status == 'yellow' ? i : null ).filter((e) => e != null);
		const grayIdx = 
			wordState.data.map((e,i) => e.status == 'gray' ? i : null ).filter((e) => e != null);

		for(let idx of greenIdx){
			// KEEP ALL WORDS THAT SHARE LETTERS IN GREEN POSITIONS
			this.wordList = this.wordList.filter((e) => e.charAt(idx) == wordState.data[idx].letter);
		}

		for(let idx of yellowIdx){
			// KEEP WORDS THAT DO NOT HAVE A YELLOW LETTER ON A YELLOW POSITION
			this.wordList = this.wordList.filter((e) => e.charAt(idx) != wordState.data[idx].letter);
			// BUT THEY MUST HAVE THE LETTER ON SOME OTHER POSITION BUT NOT THE GREEN POSITION
			this.wordList = this.wordList.filter((e) => this.WordWithout(e, greenIdx).indexOf(wordState.data[idx].letter) > -1);
		}

		for(let idx of grayIdx){
			const thisLetter = wordState.data[idx].letter;
			const numGreen = greenIdx.filter(x => wordState.data[x].letter == thisLetter).length;
			const numYellow = yellowIdx.filter(x => wordState.data[x].letter == thisLetter).length;
			if(numGreen+numYellow == 0){
				this.wordList = 
					this.wordList.filter( 
						(e) => e.indexOf(thisLetter) == -1 
						);
			}else{
				this.wordList = 
					this.wordList.filter( 
						(e) => e.split(thisLetter).length-1 <= numGreen + numYellow );
			}
		}
	};

	this.wordCount = function(){
		return this.wordList.length;
	};

	this.reset = function(){
		this.wordList = this.allWords.slice();
	};

	this.WordWithout = function(word, colorIdx){
		out ='';
		let idx = Array.from(Array(word.length).keys());
		let idxNoColor = idx.filter((e) => colorIdx.indexOf(e)==-1);
		
		idxNoColor.sort(function(a, b) {return a - b;});
		for(let i of idxNoColor){
			out += word.charAt(i);
		}
		return out;
	};
}