var isFirstTime = true;
var background = new Image();
var time = 0;
var isLoose = false;
var looseTime = 0;
var myAudio;
var looseSound;
var completeSound;
var target;
var level = 1;
var baseTarget= 20;
var isComplete = false;
var completeTime;
var period = 90;
var score;
var baseScore = 100;
$(document).ready(function(){
	//Canvas stuff
	$("#trailerContainer").hide();
	$("#btnPlay").hide();
	$("#btnPause").hide();
	$("#btnStop").hide();
	$("#targetGroup").hide();
	$("#scoreGroup").hide();
	$("#msgId").keyup(function(event){
		if (event.which == 13) {
			$("#btnSend").click();
		}		
	});
// Make sure the image is loaded first otherwise nothing will draw.

	//background.onload = function(){
	//	ctx.drawImage(background,0,0);   
	//}
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();
	var maxWaitTime = 10;
	
	//Lets save the cell width in a variable for easy control
	var cw = 10;
	var d;
	var food;
	
	var game_loop;
	
	var bgSound = getBgSoundUrl();
	//Lets create the snake now
	$(".gamePanel").hide();
	$("#btnPause").hide();
	
	init();
	var snake_array; //an array of cells to make up the snake
	$("#btnStart").click(function(){
		$("#btnStart").animate({'margin-top':'190px'},500,function(){
			$("#btnStart").hide();
			$(".button .glare").css("width","122px");
			$("#trailerContainer").fadeIn('slow', function(){
				$("#trailer").get(0).play();
				bgSound = getBgSoundUrl();
				level = 1;
			});	
		})
		
		
	});
	$("#btnSkip").click(function(){
		$("#trailer").get(0).load();
		$("#trailer").get(0).pause();
		$(".welcomePanel").fadeOut(500, function (){
			$(".welcomePanel").hide();
			$(".gamePanel").fadeIn(100, function(){
				$("#btnPlay").show();
				$("#btnStop").show()
				$("#btnStop .glare").css("width","92px");
				$("#btnPlay .glare").css("width","92px");
				init();
				paint();
				$("#targetGroup").fadeIn(500, function(){
					//do nothing
				});
				$("#scoreGroup").fadeIn(500, function(){
					//do nothing
				});
			});
			
		});
		
	});
	$("#btnPlay").click(function(){
		/*if(isFirstTime) {
			$(".welcomePanel").hide();
			$(".gamePanel").show();
			isFirstTime = false;
		}*/
		$("#btnPause").show();
		$("#btnPlay").hide();
		$("#btnPause .glare").css("width","92px");
		//$("#bgSound").attr("src", bgSound);
		//$("#bgSound").get(0).load();
		//$("#bgSound").get(0).play();
		myAudio.play();
		ws.send("@sall: join in game");
		paint();
		start();
	});
	$("#btnPause").click(function(){
		clearInterval(game_loop);
		$("#btnPause").hide();
		//$("#labelBtn1").text("RESUME");
		ws.send("@sall: pause game");
		$("#btnPlay").show();
		$(".button .glare").css("width","92px");
	});
	$("#btnStop").click(function(){
		stop();
		$(".gamePanel").fadeOut(500, function(){
			
			$("#trailerContainer").hide();
			$(".welcomePanel").fadeIn(500, function(){
				$("#btnStart").fadeIn(500, function(){});
			});
		});
		$("#btnPlay").fadeOut(500, function(){});
		$("#btnPause").fadeOut(500, function(){});
		$("#btnStop").fadeOut(500, function(){});
		$("#targetGroup").fadeOut(500, function(){
					//do nothing
				});
		$("#scoreGroup").fadeOut(500, function(){
					//do nothing
				});
		$(".button .glare").css("width","122px");
		$("#bgSound").get(0).pause();
		myAudio.pause();
		looseSound.pause();
		completeSound.pause();
		completeAudio.pause();
		ws.send("@sall: stop game");
	});
	function start(){
		//Lets move the snake now using a timer which will trigger the paint function
		//every 60ms
		if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(function (){gameloop();}, period);
	}
	
	function gameloop(){
		time++;
		if(isLoose){
			$("#targetPlace").html(0);
			//draw text
			ctx.fillStyle = "red";
			var score_text = "YOU LOSE";
			ctx.fillText(score_text, 200, h/2);
			//console.log(time);
			if(time > looseTime + 100){
				//restart game
				restart();
				
				return;
			}
		} else if(isComplete){
			//draw text
			ctx.fillStyle = "blue";
			var score_text = "Level "+ level+ " COMPLETED! ";
		
			ctx.fillText(score_text, 190, h/2);
			//console.log(time);
			if(time > completeTime + 120){
				//next level
				next();
				return;
			}
			
		}else{
			
			if(time > (maxWaitTime*1000)/period){
				time = 0;
				score = score - baseScore/2;
				if(score < 0) score = 0;
				$("#scorePlace").html(score);
				create_food();
			} 
			paint();
		}
	}
	function stop(){
		time = 0;
		clearInterval(game_loop);
		//init();
		//paint();
	}
	function restart(){
		time = 0;
		isLoose = false;
		clearInterval(game_loop);
		looseSound.pause();
		completeSound.pause();
		init();
		paint();
		$("#targetGroup").fadeIn(500, function(){
					//do nothing
		});
		$("#scoreGroup").fadeIn(500, function(){
					//do nothing
		});
		$("#btnPause").hide();
		//$("#labelBtn1").text("RESUME");
		$("#btnPlay").fadeIn(500, function(){
			$(".button .glare").css("width","92px");
		});
		$("#btnStop").fadeIn(500, function(){
			$(".button .glare").css("width","92px");
		});
		
	}
	function next(){
		time = 0;
		isComplete = false;
		score = 0;
		target = getTarget();
		period = getPeriod();
		level++;
		$("#targetPlace").html(target);
		$("#scorePlace").html(score);
		$("#levelPlace").html(level);
		$("#btnPlay").fadeIn(500, function(){
		});
		$("#btnStop").fadeIn(500, function(){
		});
		/*$("#targetGroup").fadeIn(500, function(){
					//do nothing
		});
		$("#scoreGroup").fadeIn(500, function(){
					//do nothing
		});*/
		clearInterval(game_loop);
		looseSound.pause();
		completeSound.pause();
		bgSound = getBgSoundUrl();
		init();
		paint();
		$(".button .glare").css("width","92px");
	}
	function drawSnakeHead(x,y,color, radius){
		  ctx.beginPath();
		  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
		  ctx.fillStyle = color;
		  ctx.fill();
		  //context.lineWidth = 5;
		  //context.strokeStyle = '#003300';
		  //context.stroke();
	}
	function init()
	{
		
		d = "right"; //default direction
		create_snake();
		create_food(); //Now we can see the food particle
		//finally lets display the score
		score = 0;
		time = 0;
		isComplete = false;
		isLoose = false;
		//init target
		target = getTarget();
		$("#targetPlace").html(target);
		$("#scorePlace").html(score);
		$("#levelPlace").html(level);
		//init bg
		myAudio = new Audio(bgSound);
		myAudio.addEventListener('ended', function() {
			this.currentTime = 0;
			this.load();
			this.play();
		}, false);
		completeSound = new Audio("audio/bg-complete.mp3");
		looseSound = new Audio("audio/bg-fail.mp3");
	}
	
	
	function create_snake()
	{
		var length = 5; //Length of the snake
		snake_array = []; //Empty array to start with
		for(var i = length-1; i>=0; i--)
		{
			//This will create a horizontal snake starting from the top left
			snake_array.push({x: i, y:0});
		}
	}
	
	//Lets create the food now
	function create_food()
	{
		food = {
			x: Math.round(Math.random()*(w-cw)/cw), 
			y: Math.round(Math.random()*(h-cw)/cw), 
		};
		//This will create a cell with x/y between 0-44
		//Because there are 45(450/10) positions accross the rows and columns
	}
	function getBgSoundUrl(){
	var audioFolder = "audio/";
		var type=Math.floor((Math.random()*3)+1);
		if(type == 1) {
			//trap like |
			return audioFolder+"bg-music.mp3";
		} else if(type == 2) {
			//trap like L
			return audioFolder+"bg-music-2.mp3";
		} else if(type == 2) {
			return audioFolder+"bg-music-3.mp3";
		}
		//default
		return audioFolder+"bg-music.mp3";
	}
	function getTarget(){
		return Math.floor(baseTarget*level + level*((Math.random()*3)+1));
	}
	function getPeriod(){
		if(period < 25) {
			return 30;
		}
		return Math.floor(period - level - 5);
	}
	function calScore(){
		if(time >= baseScore) {
			score+= 0;
		}else {
			score += Math.floor(baseScore - (baseScore*time)/100);
		}
	}
	function create_trap(){
		var type=Math.floor((Math.random()*3)+1);
		if(type == 1) {
		//trap like |
		
		} else if(type == 2) {
		//trap like L
		
		} else if(type == 3) {
		//trap like square
		
		}
	}
	
	//Lets paint the snake now
	function paint()
	{
		//To avoid the snake trail we need to paint the BG on every frame
		//Lets paint the canvas now
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, w, h);
		ctx.strokeStyle = "black";
		ctx.strokeRect(0, 0, w, h);
		//ctx.drawImage(background,0,0);
		//The movement code for the snake to come here.
		//The logic is simple
		//Pop out the tail cell and place it infront of the head cell
		var nx = snake_array[0].x;
		var ny = snake_array[0].y;
		//These were the position of the head cell.
		//We will increment it to get the new head position
		//Lets add proper direction based movement now
		if(d == "right") nx++;
		else if(d == "left") nx--;
		else if(d == "up") ny--;
		else if(d == "down") ny++;
		
		//Lets add the game over clauses now
		//This will restart the game if the snake hits the wall
		//Lets add the code for body collision
		//Now if the head of the snake bumps into its body, the game will restart
		if(nx == -1 ||nx == w/cw || ny == -1 || ny == h/cw || check_collision(nx, ny, snake_array))
		{
			//if the head of snake reach to the border of canvas
			if(nx == w/cw){
				nx = 0;
			} else if(ny == h/cw){
				ny = 0;
			} else if(nx == -1){
				nx = w/cw;
			}else if(ny == -1){
				ny = h/cw;
			}else {
				ws.send("@sall:loose with " + score + " point. Please try again!");
				isLoose = true;
				looseTime = time;
				$("#btnPause").fadeOut(500, function(){
				});
				$("#targetGroup").fadeOut(500, function(){
					//do nothing
				});
				$("#scoreGroup").fadeOut(500, function(){
					//do nothing
				});
				myAudio.pause();
				looseSound.load();
				looseSound.play();
				
				//Lets organize the code a bit now.
				return;
			}
		}
		
		//Lets write the code to make the snake eat the food
		//The logic is simple
		//If the new head position matches with that of the food,
		//Create a new head instead of moving the tail
		if(nx == food.x && ny == food.y)
		{
			$("#eatSound").get(0).play();
			var tail = {x: nx, y: ny};
			target--;
			//new level
			if(target == 0) {
				isComplete = true;
				completeTime = time;
				$("#btnPause").fadeOut(500, function(){
				});
				/*$("#targetGroup").fadeOut(500, function(){
					//do nothing
				});
				$("#scoreGroup").fadeOut(500, function(){
					//do nothing
				});*/
				ws.send("@sall:level " + level +" Completed! (" +score+" point)");
				myAudio.pause();
				completeSound.load();
				completeSound.play();
			}
			ws.send("@sall:New score is " + score);
			$("#targetPlace").html(target);
			calScore();
			$("#scorePlace").html(score);
			//Create new food
			time = 0;
			create_food();
		}
		else
		{
			var tail = snake_array.pop(); //pops out the last cell
			tail.x = nx; tail.y = ny;
		}
		//The snake can now eat the food.
		
		snake_array.unshift(tail); //puts back the tail as the first cell
		//console.log("("+snake_array[0].x +"," + snake_array[0].y +"),("+snake_array[1].x +"," + snake_array[1].y+"),("+snake_array[2].x +"," + snake_array[2].y+")");
		for(var i = 0; i < snake_array.length; i++)
		{
			var c = snake_array[i];
			//Lets paint 10px wide cells
			if(i == 0) {
				//drawSnakeHead(c.x, c.y, "green", 10);
				paint_cell(c.x, c.y, "black");
			} else{
			paint_cell(c.x, c.y, "green");
			}
		}
		
		//Lets paint the food
		if(time > ((maxWaitTime*0.75)*1000 )/period){
		  if(time%3==0){
				paint_cell(food.x, food.y, "white");
			} else{
				paint_cell(food.x, food.y, "red");
			}
		} else{
			paint_cell(food.x, food.y, "red");
		}
		//drawSnakeHead(food.x, food.y, "green", 10);
		//Lets paint the score
		//ctx.fillStyle = "blue";
		//var score_text = "Score: " + score;
		//ctx.fillText(score_text, 5, h-5);
		
	}
	
	//Lets first create a generic function to paint cells
	function paint_cell(x, y, color)
	{
		ctx.fillStyle = color;
		ctx.fillRect(x*cw, y*cw, cw, cw);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x*cw, y*cw, cw, cw);
	}
	
	function check_collision(x, y, array)
	{
		//This function will check if the provided x/y coordinates exist
		//in an array of cells or not
		for(var i = 0; i < array.length; i++)
		{
			if(array[i].x == x && array[i].y == y)
			 return true;
		}
		return false;
	}
	
	//Lets add the keyboard controls now
	$(document).keydown(function(e){
		var key = e.which;
		//We will add another clause to prevent reverse gear
		if(key == "37" && d != "right") d = "left";
		else if(key == "38" && d != "down") d = "up";
		else if(key == "39" && d != "left") d = "right";
		else if(key == "40" && d != "up") d = "down";
		//The snake is now keyboard controllable
	})
});

