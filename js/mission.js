// enumeration of character types
var enCharactors = {
	nMarine:0
	,nSpy:1
	,nSniper:2
}

// enumeration of enemy character types
var enEnemies = {
	nSoldier:0
	,nOfficer:1
	,nSniper:2
	,nGunner:3
}


// enumeration of characters' and enemies' action
var enAction = {
	nStay:0			// Only for characters, stay on current position
	,nMove:1		// move 
	,nChase:2		// Only for enemies. when enemy pursuing character
	,nFire:3		// fire primary weapon
	,nSubFire:4 	// Only for characters, fire secondary weapon
	,nAction:5 		// Only for characters, each character's special action
	,nView:6 		// Only for enemies, look around at current position
	,nHold:7 		// keep doing current action
	,nDie:8 		// die
	,nDead:9 		// already dead
	,nBuried:10		// spy buried body
}

// enumeration for game status
var enStatus = {
	nInit : 0 			// game initialization status
	,nReady : 1 		// prompt game start button status
	,nMission : 2 		// introducing mission of next level status
	,nPlay : 3 			// Game playing status
	,nClear : 4 		// level clear status
	,nOver : 5 			// game over status
}

// enumeration for level status
var enPlayStatus = {
	nNormal : 0 		// Normal status
	,nWarning : 1 		// Warning Alarm alerted
	,nInvasion : 2 		// Invasion Alarm alerted
	,nAttack : 3 		// Attack Alarm alerted
}

// Enumeration for mission type
var enMission = {
	nClear : 0 			// Clear all the enemies
	,nSpying : 1 		// Obtain confidential document in the enemy's base and return
	,nBoth : 2			// clear all the enemies and obtain confidential document
	,nBlow : 3 			// blow out target
	,nAssassinate : 4	// assassinate general character
}

// Mission IMpossible canvas
var stages = {
	stageBG : null  			// background map stage
	,stageCharacter : null 		// characters and objects stage
	,stageUI : null 			// stage for UI
}

// variables to store user control status
var controls = {
	downX : 0 				// mouse down X coordinate
	,downY : 0 				// mouse down Y coordinate
	,oldX: 0 				// old x position of mouse (use for dragging)
	,oldY: 0 				// old y position of mouse (use for dragging)
	,bMouseDown: false
	,bFireKey: false
	,bSubKey: false
	,position: {x: 0, y: 0}
	,oTimer: null
}

// game resources and playing data
var mission = {
	imgCharactors : [] 				// character sprite images
	,imgEnemies : [] 				// enemy view range images
	,imgMap : 0 					// map image
	,imgBunker : 0					// bunker image
	,ssBullet : null				// sprites for bullet
	,oBullet : null					// sprite object for bullet animation
	,ssBlow : null					// sprites for grenade
	,oBlow : null					// sprite object for grenade animation
	,oRange : null					// character's shooting range shape object
	,nFrame : 0 					// number of frames
	,nStatus : enStatus.nInit 		// game status 
	,nPlay : enPlayStatus.nNormal 	// game play status
	,nEnemies : 0 					// total number of enemies in this level
	,nType : enMission.nClear 		// Type of mission in this level
	,oEnemies : [] 					// Array of enemy object
	,oCharacters : [] 				// Array of character object
	,oControl : 0 					// character object to control
	,nLevel : -4					// current level
	,nMapWidth : 3000 				// width of map, static value
	,nMapHeight : 1500 				// height of map, static value
	,nMargin : 200 					// margin of object placement, static value
	,nCanWidth : 1200 				// width of canvas(stage), static value
	,nCanHeight : 600 				// height of canvas(stage), static value
	,nAlert : 0						// alert timer. Max 5 seconds
	,oTarget : null					// target object
	,nTotalScore : 0 				// total score
	,nScore : 0 					// score of current level
}


// object to store character and enemy object
var oMan ={
	nType : enCharactors.nSpy  		// character type
	,posX : 0						// current x position (absolute)
	,posY : 0						// current y position (absolute)
	,oldX : 0						// previous x position (absolute)
	,oldY : 0						// previous y position (absolute)
	,bStand : true					// is he stand	 (only for characters)
	,bRight : true					// is he heading to right side
	,nReady : 0						// how many turns left to do next action
	,nextX : 0						// target position of current movement
	,nextY : 0						// target position of current movement
	,startX : 0						// character's moving range x start point (only for enemies)
	,startY : 0						// character's moving range y start point (only for enemies)
	,endX : 0						// character's moving range x end point (only for enemies)
	,endY : 0						// character's moving range y end point (only for enemies)
	,nextAction : enAction.nStay	// next action to do
	,nSpeed : 4 					// character's speed
	,sprite : null					// sprite sheet
	,vision : null					// enemy's vision range (only for enemies)
	,nShot : 300					// shot distance
	,nVision : 300					// vision range distance
	,nAngle : 45					// vision angle
	,nBullet : 90					// number of bullets for primary weapon
	,nGrenade : 6					// number of hand grenade. Only for marine
}


var guiControls = {
	txtEnemies : null,
	txtBullets : null,
	txtGrenades : null,
	txtMission : null,
	txtLevel : null,
	txtGuide : null,
	iconMarine : {
					iNormal : null,
					iSelected : null,
					iDead : null,
				},
	iconSpy : {
					iNormal : null,
					iSelected : null,
					iDead : null,
				},
	iconSniper : {
					iNormal : null,
					iSelected : null,
					iDead : null,
				},
	iconBullet : null,
	iconGrenade : null
}


// init function when the DOM is ready
$(function(){
	//register key down event handler
	window.addEventListener( "keydown", keyPress, false );
	window.addEventListener( "keyup", keyRelease, false )

	$(document).onkeydown = keyPress();
	$(document).onkeyup = keyRelease();

	$('#menu-mission').click(playMission);
	$('#menu-training').click(playTraining);
	
	setCursorByID("game-menu", "pointer");
	
	
	// initialize game data and resources
	initGame();
	
});

// when user click play now button on canvas
// start game from this point
function playNow(){
	if(mission.nStatus == enStatus.nReady)
	{
		$('#game-menu').removeClass('hide');
		$('#game-menu').addClass('show');
		
		$('#menu-scene').addClass('hide');
		setTimeout(function(){
				$('#menu-scene').remove();
			}, 600);
		
		mission.nStatus = enStatus.nPlay;
	}
}

// when user click play mission now button on canvas, start play from level 1
function playMission(){
	mission.nLevel = 0;
		// remove all drawable objects on the stage
	removeDrawables();
	
	// init enemy objects
	initEnemies();

	// init enemy vision range
	initVision();

	// init character objects
	initCharacters(); 
	
	// init mission of this level
	initMission();
		
	// init other objects
	initObject();

	// init GUI control objects
	initGUIs();

	// update and draw character stage
	stages.stageBG.update();
	stages.stageCharacter.update();
	stages.stageUI.update();
	
	if(mission.nStatus == enStatus.nReady)
	{
		//$('#game-menu').removeClass('hide');
		//$('#game-menu').addClass('show');
		
		$('#menu-scene').addClass('hide');
		setTimeout(function(){
				$('#menu-scene').remove();
				playNow();
			}, 600);
		}
}

// when user click Training button on canvas
function playTraining(){
	mission.nLevel = -4;
		// remove all drawable objects on the stage
	removeDrawables();
	
	// init enemy objects
	initEnemies();

	// init enemy vision range
	initVision();

	// init character objects
	initCharacters(); 
	
	// init mission of this level
	initMission();
		
	// init other objects
	initObject();

	// init GUI control objects
	initGUIs();

	// update and draw character stage
	stages.stageBG.update();
	stages.stageCharacter.update();
	stages.stageUI.update();
	
	if(mission.nStatus == enStatus.nReady)
	{		
		$('#menu-scene').addClass('hide');
		setTimeout(function(){
				$('#menu-scene').remove();
				playNow();
			}, 600);
	}
}


// display this screen when user clear a level and goes to next
function nextLevel(){
	var szHTML = '<section id="menu-scene" class="scene"><table><tr><td>';
	if(mission.nLevel < 0)
		szHTML = szHTML + "special force training cleared";
	else{
		szHTML = szHTML + "Level " +(mission.nLevel+1)+" cleared";
	}
	szHTML = szHTML + '</td></tr><tr><td><img id="menu-play" src="./images/mission/nextlevel.png" onclick="playNow();"></td></tr></table></section>';
	$('#game').append(szHTML);
	
	$('#game-menu').addClass('hide');
	$('#game-menu').removeClass('show');
	
	mission.nLevel++;
	
	// remove all drawable objects on the stage
	removeDrawables();
	
	// init enemy objects
	initEnemies();

	// init enemy vision range
	initVision();

	// init character objects
	initCharacters(); 
	
	// init mission of this level
	initMission();
		
	// init other objects
	initObject();

	// init GUI control objects
	initGUIs();

	mission.nStatus = enStatus.nReady;
	
	// update and draw character stage
	stages.stageBG.update();
	stages.stageCharacter.update();
	stages.stageUI.update();
}


// function to show game start button
// this function supposed to be called when game over and user decided to over current play
function restart(){
	var szText = '<section id="menu-scene" class="scene"><table><tr><td>Mission IMpossible</td></tr><tr><td>';
	szText = szText + '<img id="menu-mission" src="./images/mission/mission.png" onclick="playMission();">';
	szText = szText + '&nbsp;&nbsp;&nbsp;&nbsp;<img id="menu-training" src="./images/mission/training.png" onclick="playTraining();">';
	szText = szText + '</td></tr></table></section>';
	$('#game').append(szText);
	mission.nStatus = enStatus.nReady;
	$('#game-menu').addClass('hide');
	$('#game-menu').removeClass('show');
}


// Display this screen when user fail to clear a level
function gameOver(){
	var szOver = '<section id="menu-scene" class="scene"><table><tr><td>';
	if(mission.nLevel < 0)
		szOver = szOver + "Training level failed";
	else{
		szOver = szOver + 'Mission ' + (mission.nLevel+1) + " failed";
	}
	
	szOver = szOver + '</td></tr><tr><td><img id="menu-over" src="./images/mission/gameover.png" onclick="restart();">&nbsp;&nbsp;&nbsp;<img id="menu-replay" src="./images/mission/replay.png" onclick="playNow();"></td></tr></table></section>';
	$('#game').append(szOver);
	
	$('#game-menu').addClass('hide');
	$('#game-menu').removeClass('show');
	
	// remove all drawable objects on the stage
	removeDrawables();
	
	// init enemy objects
	initEnemies();

	// init enemy vision range
	initVision();

	// init character objects
	initCharacters(); 
	
	// init mission of this level
	initMission();
		
	// init other objects
	initObject();

	// init GUI control objects
	initGUIs();

	// update and draw character stage
	stages.stageBG.update();
	stages.stageCharacter.update();
	stages.stageUI.update();
}


// remove all drawable objects to initialize the map
function removeDrawables(){
	if(guiControls.oTimer != null){
		clearTimeout(guiControls.oTimer);
		guiControls.oTimer = null;
	}
	stages.stageBG.removeChild(mission.oTarget.sprite);
	stages.stageBG.removeChild(mission.oTarget.bitmap);
	stages.stageCharacter.removeAllChildren();
	stages.stageUI.removeAllChildren();
	mission.oRange = null;
}

function setCursorByID(id,cursorStyle) {
 var elem;
 if (document.getElementById &&
    (elem=document.getElementById(id)) ) {
  if (elem.style) elem.style.cursor=cursorStyle;
 }
}

// main game loop of this game
function gameloop(event){
	switch(mission.nStatus){
		case enStatus.nInit: // game initialization status
			// manage character's movement and action
			manageCharacters();
			
			// manage enemy objects
			manageEnemies();
			
			// manage visual effects
			manageEffects();
			stages.stageBG.update();
			stages.stageCharacter.update();
			stages.stageUI.update();
			break;
		case enStatus.nReady: // prompt game start button status
			// manage character's movement and action
			manageCharacters();
			// manage enemy objects
			manageEnemies();
			// manage visual effects
			manageEffects();
			stages.stageBG.update();
			stages.stageCharacter.update();
			stages.stageUI.update();
			break;
		case enStatus.nMission: // introducing mission of next level status
			break;
		case enStatus.nPlay: // Game playing status
			// manage character's movement and action
			manageCharacters();
			
			// manage enemy objects
			manageEnemies();
			
			// manage visual effects
			manageEffects();
			
			// manage GUI control information
			manageGUI();
			
			if(checkMissionClear())
				mission.nStatus = enStatus.nClear;
			else if(checkMissionFail())
				mission.nStatus = enStatus.nOver;
				
			// redraw images on the stage(canvas)
			stages.stageBG.update();
			stages.stageCharacter.update();
			stages.stageUI.update();
			break;
		case enStatus.nClear: // level clear status
			mission.nStatus = enStatus.nInit;
			setTimeout(nextLevel, 2000);
			break;
		case enStatus.nOver: // game over status
			mission.nStatus = enStatus.nReady;
			setTimeout(gameOver, 4000);
			break;
	}
	
	// set mouse cursor type
	manageCursor();
}

/********************************************************************
 *
 *		Game and data initialization functions
 *
 *      
 *
 *
 *
 *********************************************************************/
// initialize map and objects
function initGame(){
	// init game stage. create stages and set background image
	initStages();
	

}

function createVision(oEnemy){
	oEnemy.vision = new createjs.Shape();
	switch(oEnemy.nType){
		case enEnemies.nSoldier:
			oEnemy.nVision = 550;
			oEnemy.nAngle = Math.PI * 22.5 / 180;
			oEnemy.nShot = 340;
			oEnemy.vision = drawVision(oEnemy, Math.PI);
			break;
		case enEnemies.nOfficer:
			oEnemy.nVision = 380;
			oEnemy.nAngle = Math.PI * 60 / 180;
			oEnemy.nShot = 150;
			oEnemy.vision = drawVision(oEnemy, Math.PI);
			break;
		case enEnemies.nSniper:
			oEnemy.nVision = 800;
			oEnemy.nShot = 630;
			oEnemy.nAngle = Math.PI * 6 / 180;
			oEnemy.vision = drawVision(oEnemy, Math.PI);
			break;
		case enEnemies.nGunner:
			oEnemy.nVision = 600;
			oEnemy.nShot = 390;
			oEnemy.nAngle = Math.PI * 50 / 180;
			oEnemy.vision = drawVision(oEnemy, Math.PI);
			break;
	}
	stages.stageCharacter.addChild(oEnemy.vision);
}

function initVision(){	
	for(nCnt=0 ; nCnt < mission.nEnemies ; nCnt++){
		var oEnemy = mission.oEnemies[nCnt];
		createVision(oEnemy);
	}
}

// draw shooting range of character
function drawShotRange(posX, posY, nDistance){
	if(mission.oRange == null){
		mission.oRange = new createjs.Shape();
		stages.stageCharacter.addChild(mission.oRange);
	}
	mission.oRange.graphics.clear();
	if(nDistance <0){
		return;
	}
	else{
		mission.oRange.graphics.beginFill("rgba(0,255,0,0.1)").drawCircle(posX, posY, nDistance);
	}
	
}

function drawVision(oEnemy, angle){
	var point = globalToStage(oEnemy.posX, oEnemy.posY - 20);
	
	var view ={
		x : point.x
		,y : point.y
	}
	
	var oShape = oEnemy.vision;
	oShape.graphics.clear();
	// draw vision range
	oShape.graphics.beginFill("rgba(255,0,0,0.1)").arc(view.x, view.y, oEnemy.nVision, -oEnemy.nAngle+angle, oEnemy.nAngle+angle, false).lineTo(view.x, view.y).closePath();
	// draw shooting range
	oShape.graphics.beginFill("rgba(0,0,255,0.1)").arc(view.x, view.y, oEnemy.nShot, -oEnemy.nAngle+angle, oEnemy.nAngle+angle, false).lineTo(view.x, view.y).closePath();
	return oShape;
}

function removeVision(oEnemy){
	var oShape = oEnemy.vision;
	oShape.graphics.clear();
	return oShape;
}

// initialize game stages
function initStages(){

	// load game map image and load it
	mission.imgMap = new Image();
	mission.imgMap.src = "./images/mission/map.jpg";
	
	mission.imgBunker = new Image();
	mission.imgBunker.src ="./images/mission/bunker.png";
	
	// when game image loading is done, draw it on the stage
	$(mission.imgMap).load(function(){
		drawBGmap();
		
		// init enemy objects
		initEnemies();

		// init enemy vision range
		initVision();

		// init character objects
		initCharacters(); 
		
		// init mission of this level
		initMission();
		
		// init other objects
		initObject();

		// init gui control components
		initGUIs();
		
		// init sound objects
		initSounds(); // TEST Y.Ishioka

		// update and draw character stage
		stages.stageCharacter.update();
		// set frame rate and start
		createjs.Ticker.setFPS(10);
		createjs.Ticker.addEventListener("tick", gameloop);
		mission.nStatus = enStatus.nReady;
	});
	
	stages.stageCharacter = new createjs.Stage("game-canvas");
	stages.stageUI = new createjs.Stage("game-menu");
	
	// register mouse event on game UI stage
	stages.stageUI.mouseMoveOutside = false;
	stages.stageUI.on("stagemousedown", mouseDown);
	stages.stageUI.on("stagemousemove", mouseMove);
	stages.stageUI.on("stagemouseup", mouseUp);
}

function initGUIs(){
	initCharacterIcons();
	var szEnemies = "Enemies : " + mission.nEnemies + " / " + mission.nEnemies;
	guiControls.txtEnemies = new createjs.Text(szEnemies, "30px Arial Bold", "rgba(40, 40, 40, 0.8)");
	guiControls.txtEnemies.x = 300;
	guiControls.txtEnemies.y = 70;
	guiControls.txtEnemies.textBaseline = "alphabetic";
	stages.stageUI.addChild(guiControls.txtEnemies);
	
	var szLevel = "Level : ";
	
	if(mission.nLevel < 0 ){
		szLevel = szLevel + "Training session";
	}
	else{
		szLevel = szLevel + (mission.nLevel+1);
	}
	
	guiControls.txtLevel = new createjs.Text(szLevel, "30px Arial Bold", "rgba(40, 40, 40, 0.8)");
	guiControls.txtLevel.x = 300;
	guiControls.txtLevel.y = 40;
	guiControls.txtLevel.textBaseline = "alphabetic";
	stages.stageUI.addChild(guiControls.txtLevel);
	
	
	guiControls.iconBullet = new createjs.Bitmap("./images/mission/icon_bullet.png");
	guiControls.iconBullet.x = 10;
	guiControls.iconBullet.y = 100;
	guiControls.iconBullet.scaleX = guiControls.iconBullet.scaleY =0.5;
	guiControls.iconBullet.alpha = 0.5;
	stages.stageUI.addChild(guiControls.iconBullet);
	
	guiControls.txtBullets = new createjs.Text(mission.oControl.nBullet, "40px Arial Bold", "rgba(40, 40, 40, 0.8)");
	guiControls.txtBullets.x = 70;
	guiControls.txtBullets.y = 100;
	guiControls.txtBullets.textBaseline = "top";
	stages.stageUI.addChild(guiControls.txtBullets);
	
	guiControls.iconGrenade = new createjs.Bitmap("./images/mission/icon_grenade.png");
	guiControls.iconGrenade.x = 10;
	guiControls.iconGrenade.y = 160;
	guiControls.iconGrenade.scaleX = guiControls.iconGrenade.scaleY =0.5;
	guiControls.iconGrenade.alpha = 0.5;
	stages.stageUI.addChild(guiControls.iconGrenade);
	
	guiControls.txtGrenades = new createjs.Text(mission.oControl.nGrenade, "40px Arial Bold", "rgba(40, 40, 40, 0.8)");
	guiControls.txtGrenades.x = 70;
	guiControls.txtGrenades.y = 160;
	guiControls.txtGrenades.textBaseline = "top";
	stages.stageUI.addChild(guiControls.txtGrenades);
	
	var nAchievement = 0;
	
	
	guiControls.txtMission = new createjs.Text(printAchivements(), "25px Arial Bold", "rgba(255, 40, 40, 0.8)");
	guiControls.txtMission.x = 800;
	guiControls.txtMission.y = 10;
	guiControls.txtMission.textBaseline = "top";
	stages.stageUI.addChild(guiControls.txtMission);
	
	if(mission.nLevel < 0){
		printMissionGuide();
	}
	
	// init controlling flag value
	controls.bFireKey = false;
	controls.bSubKey = false;
	controls.bMouseDown = false;
}



function printAchivements(){
	var szGoal;
	switch(mission.nType){
		case enMission.nClear: // simply kill all the enemies
			if(mission.oTarget.bClear)
				szGoal = "Kill all enemies: O";
			else
				szGoal = "Kill all enemies: X";
			break;
		case enMission.nSpying: // get confidential document and return to starting point
			if(mission.oTarget.bObtain){
				szGoal = "Obtain confidential: O";
				szGoal = szGoal + "\nReturn to starting position: ";
				if(mission.oTarget.bReturn)
					szGoal = szGoal + "O";
				else
					szGoal = szGoal + "X";
			}else{
				szGoal = "Obtain confidential: X\nReturn to starting position: X";
			}
			break;
		case enMission.nBoth: // get confidential document, explode target and return to starting position
			if(mission.oTarget.bBlow)
				szGoal = "Explode target: O";
			else
				szGoal = "Explode target: X";
			if(mission.oTarget.bObtain){
				szGoal = szGoal + "\nObtain confidential: O\nReturn to starting position: ";
				if(mission.oTarget.bReturn)
					szGoal = szGoal + "O";
				else
					szGoal = szGoal + "X";
			}else{
				szGoal = szGoal + "\nObtain confidential: X\nReturn to starting position: X";
			}
			break;
		case enMission.nBlow: // explode target 
			if(mission.oTarget.bBlow)
				szGoal = "Explode target: O";
			else
				szGoal = "Explode target: X";
			break;
		case enMission.nAssassinate:
			if(mission.oTarget.bClear){
				szGoal = "Assassinate general: O";
			}else
				szGoal = "Assassinate general: X";
		default:
			break;
	}	
	return szGoal;
}

function initCharacterIcons()
{
	guiControls.iconMarine.iNormal   = new createjs.Bitmap("./images/mission/icon_marine.png");
	guiControls.iconMarine.iSelected = new createjs.Bitmap("./images/mission/icon_marine_selected.png");
	guiControls.iconMarine.iDead     = new createjs.Bitmap("./images/mission/icon_marine_dead.png");
	guiControls.iconMarine.iNormal.x = guiControls.iconMarine.iSelected.x = guiControls.iconMarine.iDead.x = 10;
	guiControls.iconMarine.iNormal.y = guiControls.iconMarine.iSelected.y = guiControls.iconMarine.iDead.y = 10;
	guiControls.iconMarine.iNormal.scaleX = guiControls.iconMarine.iNormal.scaleY =0.7;
	guiControls.iconMarine.iSelected.scaleX = guiControls.iconMarine.iSelected.scaleY =0.7;
	guiControls.iconMarine.iDead.scaleX = guiControls.iconMarine.iDead.scaleY =0.7;
	
	guiControls.iconMarine.iNormal.alpha = guiControls.iconMarine.iNormal.alpha =0.4;
	guiControls.iconMarine.iSelected.alpha = guiControls.iconMarine.iSelected.alpha =0.7;
	guiControls.iconMarine.iDead.alpha = guiControls.iconMarine.iDead.alpha =0.6;
	stages.stageUI.addChild(guiControls.iconMarine.iSelected);

	guiControls.iconSpy.iNormal   = new createjs.Bitmap("./images/mission/icon_spy.png");
	guiControls.iconSpy.iSelected = new createjs.Bitmap("./images/mission/icon_spy_selected.png");
	guiControls.iconSpy.iDead     = new createjs.Bitmap("./images/mission/icon_spy_dead.png");
	guiControls.iconSpy.iNormal.x = guiControls.iconSpy.iSelected.x = guiControls.iconSpy.iDead.x = 100;
	guiControls.iconSpy.iNormal.y = guiControls.iconSpy.iSelected.y = guiControls.iconSpy.iDead.y = 10;
	guiControls.iconSpy.iNormal.scaleX = guiControls.iconSpy.iNormal.scaleY =0.7;
	guiControls.iconSpy.iSelected.scaleX = guiControls.iconSpy.iSelected.scaleY =0.7;
	guiControls.iconSpy.iDead.scaleX = guiControls.iconSpy.iDead.scaleY =0.7;
	
	guiControls.iconSpy.iNormal.alpha = guiControls.iconSpy.iNormal.alpha =0.4;
	guiControls.iconSpy.iSelected.alpha = guiControls.iconSpy.iSelected.alpha =0.7;
	guiControls.iconSpy.iDead.alpha = guiControls.iconSpy.iDead.alpha =0.6;
	stages.stageUI.addChild(guiControls.iconSpy.iNormal);

	guiControls.iconSniper.iNormal   = new createjs.Bitmap("./images/mission/icon_sniper.png");
	guiControls.iconSniper.iSelected = new createjs.Bitmap("./images/mission/icon_sniper_selected.png");
	guiControls.iconSniper.iDead     = new createjs.Bitmap("./images/mission/icon_sniper_dead.png");
	guiControls.iconSniper.iNormal.x = guiControls.iconSniper.iSelected.x = guiControls.iconSniper.iDead.x = 200;
	guiControls.iconSniper.iNormal.y = guiControls.iconSniper.iSelected.y = guiControls.iconSniper.iDead.y = 10;
	guiControls.iconSniper.iNormal.scaleX = guiControls.iconSniper.iNormal.scaleY =0.7;
	guiControls.iconSniper.iSelected.scaleX = guiControls.iconSniper.iSelected.scaleY =0.7;
	guiControls.iconSniper.iDead.scaleX = guiControls.iconSniper.iDead.scaleY =0.7;
	
	guiControls.iconSniper.iNormal.alpha = guiControls.iconSniper.iNormal.alpha =0.4;
	guiControls.iconSniper.iSelected.alpha = guiControls.iconSniper.iSelected.alpha =0.7;
	guiControls.iconSniper.iDead.alpha = guiControls.iconSniper.iDead.alpha =0.6;
	stages.stageUI.addChild(guiControls.iconSniper.iNormal);
}

function initSounds(){ // TEST Y.Ishioka

	if (!createjs.Sound.initializeDefaultPlugins()) {return;}

	var audioPath = "./audio/mission/";
	var manifest = [
					{id:"BGM", src:"mission_ost.mp3"},
					{id:"GunShot", src:"gun-gunshot-01.mp3"},
					{id:"MachineGun", src:"machine-gun-01.mp3"},
					{id:"Silencer", src:"silencer.mp3"},
					{id:"Grenade", src:"grenade2.mp3"},
					{id:"Knife", src:"stab2.mp3"},
					{id:"MisShot", src:"mis_shot.mp3"},
					{id:"Die", src:"dead.mp3"},
					{id:"Alert", src:"alert2.mp3"},
					{id:"Warning", src:"warning.mp3"}
					];
	createjs.Sound.alternateExtensions = ["mp3"];
	createjs.Sound.addEventListener("fileload", handleLoad);
	createjs.Sound.registerManifest(manifest, audioPath);
}

function handleLoad(event){	// TEST Y.Ishioka
	if(event.src == "./audio/mission/mission_ost.mp3")
		createjs.Sound.play("BGM", {loop:-1});
}

// draw game map call back function by loading done event
function drawBGmap(){
	stages.stageBG = new createjs.Stage("game-background-canvas");
	mission.bitMap = new createjs.Bitmap(mission.imgMap);
	stages.stageBG.addChild(mission.bitMap);	 
	stages.stageBG.update();
}

 
// initialize mission of this level
function initMission(){
	switch(mission.nLevel){
		case -4: // just for training sessions
			mission.nType = enMission.nClear;
			break;
		case -3: // just for training sessions
			mission.nType = enMission.nSpying;
			break;
		case -2: // just for training sessions
			mission.nType = enMission.nBlow;
			break;
		case -1: // just for training sessions
			mission.nType = enMission.nAssassinate;
			break;
		default: // Real mission
			mission.nType = Math.floor(Math.random() * enMission.nAssassinate+1);
			break;
	}	
}

// create confidential document object
function createConfidential(){
	var paper = new Image();
	paper.src = "./images/mission/confidential.png";
	mission.oTarget.bitmap = new createjs.Bitmap(paper);
	
	var position = globalToStage(mission.oTarget.x, mission.oTarget.y+60);
	mission.oTarget.bitmap.x = position.x;
	mission.oTarget.bitmap.y = position.y;
}

// create drawable object of target to explode
function createFlag(){
	var ss = new createjs.SpriteSheet({ "animations":{
		"flutter":{
			frames: [0,1,2,3],
			next: "flutter",
			speed: 1
			},
		},
		"images":["./images/mission/flag_sprites.png"],
		"frames":{
			"regX":0,
			"regY":0,
			"height":80,
			"width":80,
			"count":4
		}
	});
	mission.oTarget.sprite = new createjs.Sprite(ss, "flutter");
	mission.oTarget.sprite.gotoAndPlay("flutter");
	
	position = globalToStage(mission.oTarget.x, mission.oTarget.y);
	mission.oTarget.sprite.x = position.x;
	mission.oTarget.sprite.y = position.y;
}

// create general drawable object for assassinate mission
// it supposed only for the assassinate mission
function createGeneral(){
	var ss = new createjs.SpriteSheet({ "animations":{
		"standing":{
			frames: [0,1,2,3,4,5,6,7,8,9,10,11,10,9,8,7,6,5,4,3,2],
			next: "standing",
			speed: 1
			},
		"die":{
			frames: [12,13,14,15,16,17],
			next: "false",
			speed: 1
			},
		},
		"images":["./images/mission/general_sprite.png"],
		"frames":{
			"regX":0,
			"regY":0,
			"height":50,
			"width":50,
			"count":18
		}
	});
	mission.oTarget.sprite = new createjs.Sprite(ss, "standing");
	mission.oTarget.sprite.gotoAndPlay("standing");
	
	mission.oTarget.x = 2900;
	mission.oTarget.y = 370;
	
	position = globalToStage(mission.oTarget.x, mission.oTarget.y);
	mission.oTarget.sprite.x = position.x;
	mission.oTarget.sprite.y = position.y;
	
	// general sprite sheet drawable object use global variable mission.oTarget.sprite for its instance
	// same as flutter flag(target to explode) do for explosion mission
}


// create and draw fence on the map to block other character
// reach to general enemy character
function createFence(){
	var fence = new Image();
	fence.src = "./images/mission/fence.png";
	mission.oTarget.bitmap = new createjs.Bitmap(fence);
	
	var position = globalToStage(mission.oTarget.x- mission.oCharacters[enCharactors.nSniper].nShot + 30, 0);
	mission.oTarget.bitmap.x = position.x;
	mission.oTarget.bitmap.y = position.y;
	
	// Fence drawable object share global variable mission.oTarget.bitmap as its instance
	// with confidential document on spying mission
	
}


// initialize other objects
// flag, rolled paper, general, fence... ect (all other than characters and enemies)
function initObject(){
	mission.oTarget = {
					x : 2600
					,y : 600
					,sprite : null
					,bitmap : null
					,bObtain : false
					,bBlow : false
					,bReturn : false
					,bClear : false
					};
	
	switch(mission.nType){
		case enMission.nClear:
			break;
		case enMission.nSpying:
			createConfidential();
			stages.stageBG.addChild(mission.oTarget.bitmap);
			break;
		case enMission.nBoth:
			createConfidential();
			createFlag();
			stages.stageBG.addChild(mission.oTarget.sprite);
			stages.stageBG.addChild(mission.oTarget.bitmap);
			break;
		case enMission.nBlow:
			createFlag();
			stages.stageBG.addChild(mission.oTarget.sprite);
			break;
		case enMission.nAssassinate:
			createGeneral();
			createFence();
			stages.stageBG.addChild(mission.oTarget.sprite);
			stages.stageBG.addChild(mission.oTarget.bitmap);
			break;
		default:
			alert("Error while making mission");
			break;
	}

	// bullet spot animation for FX
	mission.ssBullet = new createjs.SpriteSheet({ "animations":{
			"pistol":{
                frames: [5,5,5,5, 0, 1, 3, 4, 5],
                next: false,
                speed: 1
				},
			"rifle": {
                frames: [0,1,2,1,2,1,2,3,4,5],
                next: false,
                speed: 1
				},
			"sniper": {
                frames: [5,5,5,5,5,0,3,4,5],
                next: false,
                speed: 1
				},
			},
			"images":["./images/mission/bullet.png"],
			"frames":{
				"regX":0,
				"regY":0,
				"height":30,
				"width":56,
				"count":6
			}
		});
	
	// Grenade explosion animation
	mission.ssBlow = new createjs.SpriteSheet({ "animations":{
			"blow":{
                frames: [15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
                next: false,
                speed: 1
				},
			"explode":{
                frames: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
                next: false,
                speed: 2
				},
			},
			"images":["./images/mission/blow_sprite.png"],
			"frames":{
				"regX":0,
				"regY":0,
				"height":100,
				"width":100,
				"count":16
			}
		});
}

 
// initialize enemy objects
// this function will decide total number of enemies on this level
// and call independent functions to create enemy objects
function initEnemies(){
	// decide total number of enemy and number of enemy by it's type
	var nSniper = 1+Math.round(mission.nLevel*0.35);
	var nGunner = 2+Math.round(mission.nLevel*0.25);
	var nSoldier = 4 + Math.round(mission.nLevel*0.6);
	var nOfficer = 2 + Math.round(mission.nLevel*0.3);
	
	// On training session, one enemy by type
	if(mission.nLevel < 0)
	{
		nSoldier = nSniper = nGunner = nOfficer = 1;
	}
	
	mission.nEnemies = nSniper+nGunner+nSoldier+nOfficer;
	
	
	// create enemy objects according to the number that we decided above.
	for(var nCnt = 0 ; nCnt < mission.nEnemies ; nCnt++)
	{
		var oEnemy;
		if(nCnt < nSniper)
		{
			var x = Math.random() * (mission.nMapWidth-(mission.nMargin*6)) + mission.nMargin*5;
			var y = Math.random() * (mission.nMapHeight-(mission.nMargin*4)) + mission.nMargin*2;
			oEnemy = createEnemySniper(x, y);
		}
		else if (nCnt < nSniper+nGunner){
			var x = Math.random() * (mission.nMapWidth-(mission.nMargin*5)) + mission.nMargin*3;
			var y = Math.random() * (mission.nMapHeight-(mission.nMargin*5)) + mission.nMargin*3;
			oEnemy = createGunner(x,y);
			oEnemy.bitBunker = new createjs.Bitmap(mission.imgBunker);
			stages.stageCharacter.addChild(oEnemy.bitBunker);	 
			oEnemy.bitBunker.x = x-50;
			oEnemy.bitBunker.y = y-75;
		}
		else if (nCnt < nSniper+nGunner+nSoldier){
			var x = Math.random() * (mission.nMapWidth-(mission.nMargin*4)) + mission.nMargin*3.5;
			var y = Math.random() * (mission.nMapHeight-(mission.nMargin*2)) + mission.nMargin/2;
			oEnemy = createSoldier(x, y);
		}else{
			var x = Math.random() * (mission.nMapWidth-(mission.nMargin*4.5)) + mission.nMargin*4;
			var y = Math.random() * (mission.nMapHeight-(mission.nMargin*1)) + mission.nMargin/2;
			oEnemy = createOfficer(x, y);
		}
		
		
		// store enemy object into mission global variable
		mission.oEnemies[nCnt] = oEnemy;
		if(oEnemy.bRight){
			oEnemy.sprite.x = oEnemy.posX-50;
		}
		else{
			oEnemy.sprite.x = oEnemy.posX - 150;
			
		}
		oEnemy.sprite.y = oEnemy.posY-50;
		stages.stageCharacter.addChild(oEnemy.sprite);		
	} // end of for
}


// create sniper enemy object.
// parameter x,y is starting point of character
// return value is sniper object
function createEnemySniper(x, y){
	var oSniper = jQuery.extend(true, {}, oMan);
	oSniper.nType = enEnemies.nSniper;
	oSniper.nSpeed = 2;
	oSniper.nextX = oSniper.oldX = oSniper.startX = oSniper.endX = oSniper.posX = x;
	oSniper.nextY = oSniper.oldY = oSniper.startY = oSniper.endY = oSniper.posY = y;
	oSniper.bRight = false;
	oSniper.nReady = 120;
	oSniper.nextAction = enAction.nView;
	
	// Sprite sniper
	var ssSniper = new createjs.SpriteSheet({ "animations":{
			"stand":{
                frames: [23,24,25,24,25,25,24,23,23,30,30,30,23,23],
                next: "stand",
                speed: 0.5
				},
			"die":{
                frames: [32,2,3,4,5],
                next: false,
                speed: 1
				},
			"shoot1":{
                frames: [24,25,26,27,28,29],
                next: "stand",
                speed: 1
				},
			},
			"images":["./images/mission/Enemy_sniper_sprites.png"],
			"frames":{
				"regX":0,
				"regY":0,
				"height":50,
				"width":100,
				"count":36
			}
		});
	
	oSniper.sprite = new createjs.Sprite(ssSniper, "stand");
	oSniper.sprite.scaleY = 1;
	oSniper.sprite.scaleX = -1;
	oSniper.sprite.gotoAndPlay("stand");
	return oSniper;
}

// create heavy gunner enemy object.
// parameter x,y is starting point of character
// return value is heavy gunner object
function createGunner(x, y){
	var oGunner = jQuery.extend(true, {}, oMan);
	oGunner.nType = enEnemies.nGunner;
	oGunner.nSpeed = 2;
	oGunner.nextX = oGunner.oldX = oGunner.startX = oGunner.endX = oGunner.posX = x;
	oGunner.nextY = oGunner.oldY = oGunner.startY = oGunner.endY = oGunner.posY = y;
	oGunner.bRight = false;
	oGunner.nReady = 200;
	oGunner.nextAction = enAction.nView;
	oGunner.bStand = true; // up to down status
	
	// gunner sniper
	var ssGunner = new createjs.SpriteSheet({ "animations":{
			"stand":[3, 3],
			"watchDown": {
                frames: [0,1,2,3,4],
                next: "watchUp",
                speed: 0.1
				},
			"watchUp": {
                frames: [4,3,2,1,0],
                next: "watchDown",
                speed: 0.1
				},
			"watch":{
				frames: [2,3],
                next: "watch",
                speed: 0.1
				},
			"die":[9, 14],
			"shoot1":{
                frames: [5,6,7,6,7,8,7,6,7],
                next: "watchDown",  //modified Y.Ishioka "watch" -> "watchDown"
                speed: 1
				},
			"dead":[14,14]},
			"images":["./images/mission/gunner_sprites.png"],
			"frames":{
				"regX":0,
				"regY":0,
				"height":50,
				"width":100,
				"count":15
			}
		});
	ssGunner.getAnimation("stand").speed = 1;
	ssGunner.getAnimation("stand").next = false;
	ssGunner.getAnimation("die").speed = 1;
	ssGunner.getAnimation("die").next = false;
	
	oGunner.sprite = new createjs.Sprite(ssGunner, "watchDown");
	oGunner.sprite.scaleY = 1;
	oGunner.sprite.scaleX = -1;
	oGunner.sprite.gotoAndPlay("watchDown");
	
	return oGunner;
}


// create hand grenade explosion animation on given point
function blowAnimation(x, y){
	var spBlow = new createjs.Sprite(mission.ssBlow, "blow");
	spBlow.x = x;
	spBlow.y = y;
	spBlow.gotoAndPlay("blow");
	stages.stageCharacter.addChild(spBlow);
	var point = stageToGlobal(x, y);
	spBlow.point = point;
	spBlow.nCnt = 46;
	spBlow.next = null;
	addBombToTail(spBlow);
}


// add new bomb blow out animation into the tail of linked list
function addBombToTail(spBlow){
	if(mission.oBlow == null){
		mission.oBlow = spBlow;
		return;
	}
	else{
		var oCurPos = mission.oBlow;
		while(oCurPos.next != null){
			oCurPos = oCurPos.next;
		}
		oCurPos.next = spBlow;
		return;
	}
}


// create bullet mark on given point
function bulletMark(x, y, nType){
	var szType = "pistol";
	
	switch(nType){
		case 1:
			break;
		case 2:
			szType = "rifle";
			break;
		case 3:
			szType = "sniper";
			break;
	}
	var spBullet = new createjs.Sprite(mission.ssBullet, szType);
	spBullet.x = x;
	spBullet.y = y;
	spBullet.gotoAndPlay(szType);
	stages.stageCharacter.addChild(spBullet);
	var point = stageToGlobal(x, y);
	spBullet.point = point;
	spBullet.nCnt = 10;
	stages.stageCharacter.removeChild(mission.oBullet);
	mission.oBullet = spBullet;
	//stageToGlobal(x, y);
	//setTimeout(bulletTimer, 100, spBullet);
}


// create soldier enemy object.
// parameter x,y is starting point of character
// return value is soldier object
function createSoldier(x, y){
	var oSoldier = jQuery.extend(true, {}, oMan);
	oSoldier.nType = enEnemies.nSoldier;
	oSoldier.nSpeed = 2;
	oSoldier.nReady = 60;
	oSoldier.nextAction = enAction.nView;
	oSoldier.posX = x;
	oSoldier.posY = y;
	// Sprite soldier
	var ssSoldier = new createjs.SpriteSheet({ "animations":{
			"stand":[0, 0],
			"die":[6, 11],
			"run":[0, 5],
			"walk":[0, 5],
			"shoot1":[12, 17],
			"dead":[11, 11]},
			"images":["./images/mission/soldier_sprites.png"],
			"frames":{
				"regX":0,
				"regY":0,
				"height":50,
				"width":100,
				"count":18
			}
		});
	ssSoldier.getAnimation("stand").speed = 1;
	ssSoldier.getAnimation("stand").next = false;
	ssSoldier.getAnimation("die").speed = 1;
	ssSoldier.getAnimation("die").next = false;
	ssSoldier.getAnimation("walk").speed = 0.5;
	ssSoldier.getAnimation("walk").next = "walk";
	ssSoldier.getAnimation("run").speed = 1;
	ssSoldier.getAnimation("run").next = "run";
	ssSoldier.getAnimation("shoot1").speed = 1;
	ssSoldier.getAnimation("shoot1").next = "stand";
	oSoldier.sprite = new createjs.Sprite(ssSoldier, "stand");
	oSoldier.sprite.scaleY = oSoldier.sprite.scaleX = 1;
	oSoldier.sprite.gotoAndStop("stand");
	setSoldierMovingRange(oSoldier, oSoldier.posX, oSoldier.posY);
	
	return oSoldier;
}


// dispatch enemy(soldier or officer) to the given point
// oEnemy : enemy object
// x, y : point to dispatch
// bRun : false- normal movement, true- chase mode(run, 2 times faster)
function dispatchSoldier(oEnemy, x, y, bRun){

	// set this soldier move around target point
	if(oEnemy.nType == enEnemies.nSoldier)
	{
		setSoldierMovingRange(oEnemy, x, y);
		oEnemy.nextX = Math.random()*(oEnemy.endX-oEnemy.startX) + oEnemy.startX;
		oEnemy.nextY = Math.random()*(oEnemy.endY-oEnemy.startY) + oEnemy.startY;
	}
	else
	{
		oEnemy.nextX = x;
		oEnemy.nextY = y;
	}
	
	
	
	var gapX = oEnemy.nextX - oEnemy.posX;
	var gapY = oEnemy.nextY - oEnemy.posY;
	var nSpeed = oEnemy.nSpeed;
	
	if(bRun)
		nSpeed = oEnemy.nSpeed*2;
	
	// get distance to move
	var length = Math.sqrt( Math.pow(gapX,2) + Math.pow(gapY,2) );
	// calculate total turns to move
	var turns = Math.ceil(length / nSpeed);
	
	// calculate next position to move
	oEnemy.moveX = gapX / turns;
	oEnemy.moveY = gapY / turns;
	oEnemy.oldX = oEnemy.posX;
	oEnemy.oldY = oEnemy.posY;
	
	if(gapX > 0){
		oEnemy.bRight = true;
	}else{
		oEnemy.bRight = false;
	}
	
	//if it is under emergency status, run to the point
	if(bRun)
	{
		oEnemy.nextAction = enAction.nChase;			
		oEnemy.sprite.gotoAndPlay("run");
	}
	else // if not emergency, walk to the point
	{
		oEnemy.nextAction = enAction.nMove;			
		oEnemy.sprite.gotoAndPlay("walk");
	}
	oEnemy.nReady = turns;
}


// dispatch enemy(soldier or officer) to the given point
// oEnemy : enemy object
// x, y : point to dispatch
// bRun : false- normal movement, true- chase mode(run, 2 times faster)
function dispatchSoldier(oEnemy, x, y, bRun){

	// set this soldier move around target point
	if(oEnemy.nType == enEnemies.nSoldier)
	{
		setSoldierMovingRange(oEnemy, x, y);
		oEnemy.nextX = Math.random()*(oEnemy.endX-oEnemy.startX) + oEnemy.startX;
		oEnemy.nextY = Math.random()*(oEnemy.endY-oEnemy.startY) + oEnemy.startY;
	}
	else
	{
		oEnemy.nextX = x;
		oEnemy.nextY = y;
	}
	
	var gapX = oEnemy.nextX - oEnemy.posX;
	var gapY = oEnemy.nextY - oEnemy.posY;
	var nSpeed = oEnemy.nSpeed;
	
	if(bRun)
		nSpeed = oEnemy.nSpeed*2;
	
	// get distance to move
	var length = Math.sqrt( Math.pow(gapX,2) + Math.pow(gapY,2) );
	// calculate total turns to move
	var turns = Math.ceil(length / nSpeed);
	
	// calculate next position to move
	oEnemy.moveX = gapX / turns;
	oEnemy.moveY = gapY / turns;
	oEnemy.oldX = oEnemy.posX;
	oEnemy.oldY = oEnemy.posY;
	
	if(gapX > 0){
		oEnemy.bRight = true;
	}else{
		oEnemy.bRight = false;
	}
	
	//if it is under emergency status, run to the point
	if(bRun)
	{
		oEnemy.nextAction = enAction.nChase;			
		oEnemy.sprite.gotoAndPlay("run");
	}
	else // if not emergency, walk to the point
	{
		oEnemy.nextAction = enAction.nMove;			
		oEnemy.sprite.gotoAndPlay("walk");
	}
	oEnemy.nReady = turns;
}

// send near enemy(soldier or officer) to the given point
// oEnemy : enemy object
// x, y : point to dispatch
// bRun : false- normal movement, true- chase mode(run, 2 times faster)
function sendSoldier(oEnemy, x, y, bRun){

	// set this soldier move around target point
	if(oEnemy.nType == enEnemies.nSoldier)
	{
		setSoldierMovingRange(oEnemy, x, y);
	}
	oEnemy.nextX = x;
	oEnemy.nextY = y;
	
	var gapX = oEnemy.nextX - oEnemy.posX;
	var gapY = oEnemy.nextY - oEnemy.posY;
	var nSpeed = oEnemy.nSpeed;
	
	if(bRun)
		nSpeed = oEnemy.nSpeed*2;
	
	// get distance to move
	var length = Math.sqrt( Math.pow(gapX,2) + Math.pow(gapY,2) );
	// calculate total turns to move
	var turns = Math.ceil(length / nSpeed);
	
	// calculate next position to move
	oEnemy.moveX = gapX / turns;
	oEnemy.moveY = gapY / turns;
	oEnemy.oldX = oEnemy.posX;
	oEnemy.oldY = oEnemy.posY;
	
	if(gapX > 0){
		oEnemy.bRight = true;
	}else{
		oEnemy.bRight = false;
	}
	
	//if it is under emergency status, run to the point
	if(bRun)
	{
		oEnemy.nextAction = enAction.nChase;			
		oEnemy.sprite.gotoAndPlay("run");
	}
	else // if not emergency, walk to the point
	{
		oEnemy.nextAction = enAction.nMove;			
		oEnemy.sprite.gotoAndPlay("walk");
	}
	oEnemy.nReady = turns;
}

// set soldier object's moving range to around x,y coordinate area
function setSoldierMovingRange(oSoldier, x, y){
	oSoldier.startX = x - 200;
	oSoldier.endX = x + 200;
	oSoldier.startY = y - 200;
	oSoldier.endY = y + 200;
	
	// if start and ending point is out of stage range, modify it
	if(oSoldier.startX < mission.nMargin)
		oSoldier.startX = mission.nMargin;
	else if(oSoldier.endX > mission.nMapWidth - mission.nMargin)
		oSoldier.endX = mission.nMapWidth - mission.nMargin;
	if(oSoldier.startY < mission.nMargin)
		oSoldier.startY = mission.nMargin;
	else if(oSoldier.endY > mission.nMapHeight - mission.nMargin)
		oSoldier.endY = mission.nMapHeight - mission.nMargin;
	
}

// create officer enemy object.
// parameter x,y is starting point of character
// return value is officer object
function createOfficer(x, y){
	var oOfficer = jQuery.extend(true, {}, oMan);
	oOfficer.nType = enEnemies.nOfficer;
	oOfficer.nSpeed = 2;
	oOfficer.nReady = 60;
	oOfficer.nextAction = enAction.nView;
	oOfficer.posX = x;
	oOfficer.posY = y;
	
	// Sprite Officer
	var ssOfficer = new createjs.SpriteSheet({ "animations":{
			"stand":[0, 0],
			"die":[6, 11],
			"walk":[0, 5],
			"run":[0, 5],
			"shoot1":[12, 17],
			"dead":[11, 11]},
			"images":["./images/mission/Officer_sprites.png"],
			"frames":{
				"regX":0,
				"regY":0,
				"height":50,
				"width":100,
				"count":18
			}
		});
	ssOfficer.getAnimation("stand").speed = 1;
	ssOfficer.getAnimation("stand").next = false;
	ssOfficer.getAnimation("die").speed = 1;
	ssOfficer.getAnimation("die").next = false;
	ssOfficer.getAnimation("walk").speed = 0.5;
	ssOfficer.getAnimation("walk").next = "walk";
	ssOfficer.getAnimation("run").speed = 1;
	ssOfficer.getAnimation("run").next = "run";
	ssOfficer.getAnimation("shoot1").speed = 1;
	ssOfficer.getAnimation("shoot1").next = "stand";
	oOfficer.sprite = new createjs.Sprite(ssOfficer, "stand");
	oOfficer.sprite.scaleY = oOfficer.sprite.scaleX = 1;
	oOfficer.sprite.gotoAndStop("stand");
	
	oOfficer.startX = mission.nMargin*2;
	oOfficer.endX = mission.nMapWidth - mission.nMargin;
	oOfficer.startY = mission.nMargin;
	oOfficer.endY = mission.nMapHeight - mission.nMargin;
	return oOfficer;
}








// initialize characters
function initCharacters(){
	initMarine(100, mission.nMapHeight - 100);
	initSpy(50, mission.nMapHeight - 50);
	initSniper(50, mission.nMapHeight - 100);
	
	// set marine as initial control character
	mission.oControl = mission.oCharacters[enCharactors.nMarine];
	moveStage(0,mission.nMapHeight);
} 

// initialize spy character
function initSpy(x,y){
	var oSpy = createSpy(x, y);
	oSpy.sprite.x = oSpy.posX-50;
	oSpy.sprite.y = oSpy.posY-50;
	mission.oCharacters[enCharactors.nSpy] = oSpy;
	mission.oCharacters[enCharactors.nSpy].nBullet = 36;
    stages.stageCharacter.addChild(mission.oCharacters[enCharactors.nSpy].sprite);
	stages.stageCharacter.update();
}

// create spy character.
// parameter x,y is starting point of character
// return value is spy object
function createSpy(x, y){
	// spy's own property
	var oSpy = jQuery.extend(true, {}, oMan);
	oSpy.nType = enCharactors.nSpy;
	oSpy.nSpeed = 10;
	oSpy.nextX = oSpy.oldX = oSpy.posX = x;
	oSpy.nextY = oSpy.oldY = oSpy.posY = y;
	oSpy.nShot = 250;
	
	// Sprite spy
	var ssSpy = new createjs.SpriteSheet({ "animations":{
			"stand":[0, 0],
			"die":[0, 5],
			"run":[6, 11],
			"shoot1":[12, 17],
			"stab":[18, 23],
			"trans":{
                frames: [24,25,26,25 ,24,25,26,25 ,24,25,26,25 ,24,25,26,25 ,24,25,26,25 ,24,25,26,25 ,0,30,0,30,0,30,0,30,0,30,0,30,0,30,0,30],
                next: "costume_stand",
                speed: 0.5
				},
			"bury1":{
                frames: [24,25,26,25],
                next: "bury1",
                speed: 0.5
				},
			"bury2":{
                frames: [27,28,29,28],
                next: "bury2",
                speed: 0.5
				},
			"costume_stand":[30,30],
			"costume_run":[30,35],
			"shoot2":[36,41],
			"costume_stab":[42,47],
			"transform":[6,30,6,30,6,30,6,30,6,30]
			},
			"images":["./images/mission/spy_sprites.png"],
			"frames":{
				"regX":0,
				"regY":0,
				"height":50,
				"width":100,
				"count":48
			}
		});
		
	ssSpy.getAnimation("stand").speed = 1;
	ssSpy.getAnimation("stand").next = false;
    ssSpy.getAnimation("die").speed = 1;
	ssSpy.getAnimation("die").next = false;
	ssSpy.getAnimation("run").speed = 1;
	ssSpy.getAnimation("run").next = "run";
    ssSpy.getAnimation("shoot1").speed = 1;
	ssSpy.getAnimation("shoot1").next = "stand";
    ssSpy.getAnimation("stab").speed = 1;
	ssSpy.getAnimation("stab").next = "stand";
	ssSpy.getAnimation("shoot2").speed = 1;
	ssSpy.getAnimation("shoot2").next = "costume_stand";
	ssSpy.getAnimation("costume_stand").next = false;
	ssSpy.getAnimation("costume_stab").speed = 1;
	ssSpy.getAnimation("costume_stab").next = "costume_stand";
	ssSpy.getAnimation("costume_run").speed = 1;
	ssSpy.getAnimation("costume_run").next = "costume_run";

    oSpy.sprite = new createjs.Sprite(ssSpy, "stand");
    oSpy.sprite.scaleY = oSpy.sprite.scaleX = 1;
	oSpy.sprite.gotoAndStop("stand");
	return oSpy;
}

// initialize sniper character
function initSniper(x, y){
	var oSniper = createSniper(x, y);
	oSniper.sprite.x = oSniper.posX-50;
	oSniper.sprite.y = oSniper.posY-50;	
	mission.oCharacters[enCharactors.nSniper] = oSniper;
	mission.oCharacters[enCharactors.nSniper].nBullet = 18 + mission.nLevel*2;
    stages.stageCharacter.addChild(mission.oCharacters[enCharactors.nSniper].sprite);
	stages.stageCharacter.update();
}

// create sniper character.
// parameter x,y is starting point of character
// return value is sniper object
function createSniper(x, y){
	// sniper's own properties
	var oSniper = jQuery.extend(true, {}, oMan);
	oSniper.nType = enCharactors.nSniper;
	oSniper.nSpeed = 7;
	oSniper.nextX = oSniper.oldX = oSniper.posX = x;
	oSniper.nextY = oSniper.oldY = oSniper.posY = y;
	oSniper.nShot = 510;
	
	// Sprite sniper
	var ssSniper = new createjs.SpriteSheet({ "animations":{
			"stand":[0, 0],
			"die":[0, 5],
			"run":[6, 11],
			"shoot1":[12, 17],
			"crawl":{
                frames: [18,19,20,21,22,23,36,37,38,39,40,41],
                next: "crawl2",
                speed: 1
				},
			"crawl2":[41,41],
			"shoot2":[24, 29],
			"standup":[30, 35]},
			"images":["./images/mission/sniper_sprites.png"],
			"frames":{
				"regX":0,
				"regY":0,
				"height":50,
				"width":100,
				"count":42
			}
		});
		
	ssSniper.getAnimation("stand").speed = 1;
	ssSniper.getAnimation("stand").next = false;
    ssSniper.getAnimation("die").speed = 1;
	ssSniper.getAnimation("die").next = false;
	ssSniper.getAnimation("run").speed = 1;
	ssSniper.getAnimation("run").next = "run";
    ssSniper.getAnimation("shoot1").speed = 0.5;
	ssSniper.getAnimation("shoot1").next = "stand";
    ssSniper.getAnimation("shoot2").speed = 0.5;
	ssSniper.getAnimation("shoot2").next = "crawl2";
    ssSniper.getAnimation("standup").speed = 1;
	ssSniper.getAnimation("standup").next = "stand";

    oSniper.sprite = new createjs.Sprite(ssSniper, "stand");
    oSniper.sprite.scaleY = oSniper.sprite.scaleX = 1;
	oSniper.sprite.gotoAndStop("stand");
	return oSniper;
}

function initMarine(x,y){
	var oMarine = createMarine(x, y);
	
	mission.oCharacters[enCharactors.nMarine] = oMarine;
	mission.oCharacters[enCharactors.nMarine].nBullet = 90;
	mission.oCharacters[enCharactors.nMarine].nGrenade = 6;
	mission.oCharacters[enCharactors.nMarine].sprite.x = oMarine.posX-50;
	mission.oCharacters[enCharactors.nMarine].sprite.y = oMarine.posY-50;
    stages.stageCharacter.addChild(mission.oCharacters[enCharactors.nMarine].sprite);
}

// create marine character.
// parameter x,y is starting point of character
// return value is marine object
function createMarine(x, y){
	// marine's own property
	var oMarine = jQuery.extend(true, {}, oMan);
	oMarine.nType = enCharactors.nMarine;
	oMarine.nSpeed = 9;
	oMarine.nextX = oMarine.oldX = oMarine.posX = x;
	oMarine.nextY = oMarine.oldY = oMarine.posY = y;
	oMarine.nShot = 390;
	
	
	var ssMarine = new createjs.SpriteSheet({ "animations":{
			"stand":[0, 0],
			"die":[0, 5],
			"run":[6, 11],
			"shoot1":[12, 17],
			"throw":[18, 23],
			"crawl":[24, 29],
			"crawl2":[24],
			"shoot2":[30, 35]},
			"images":["./images/mission/marine_sprites.png"],
			"frames":{
				"regX":0,
				"regY":0,
				"height":50,
				"width":100,
				"count":36
			}
		});
		
	ssMarine.getAnimation("stand").speed = 1;
	ssMarine.getAnimation("stand").next = false;
    ssMarine.getAnimation("die").speed = 1;
	ssMarine.getAnimation("die").next = false;
	ssMarine.getAnimation("run").speed = 1;
	ssMarine.getAnimation("run").next = "run";
    ssMarine.getAnimation("shoot1").speed = 1;
	ssMarine.getAnimation("shoot1").next = "stand";
    ssMarine.getAnimation("throw").speed = 1;
	ssMarine.getAnimation("throw").next = "stand";
    ssMarine.getAnimation("crawl").speed = 1;
	ssMarine.getAnimation("crawl").next = "crawl";
    ssMarine.getAnimation("shoot2").speed = 1;
	ssMarine.getAnimation("shoot2").next = "crawl2";

    oMarine.sprite = new createjs.Sprite(ssMarine, "stand");
    oMarine.sprite.scaleY = oMarine.sprite.scaleX = 1;
	oMarine.sprite.gotoAndStop("stand");
	
    return oMarine;
}













/********************************************************************
 *
 *		Mouse event handlers
 *
 *      
 *
 *
 *
 *********************************************************************/
// mouse move event handler
function mouseMove(evt){
	if(mission.nStatus == enStatus.nPlay){
		var point = stageToGlobal(evt.stageX, evt.stageY);
		controls.position.x = point.x;
		controls.position.y = point.y;
		// when it is dragging
		if(controls.bMouseDown)
		{
			var gapX = controls.oldX - evt.stageX;
			var gapY = controls.oldY - evt.stageY;
			
			// move map position when it's dragging
			moveMap(gapX, gapY);
			controls.oldX = evt.stageX;
			controls.oldY = evt.stageY;
		}
	}
}

function isInRange(oCharacter, oEnemy){
	var distance =  getDistance(oCharacter.posX, oCharacter.posY, oEnemy.posX, oEnemy.posY);
	
	if(oCharacter.nShot < distance)
		return false;
	else
		return true;
}

function isClickEnemy(x, y){
	var nCnt;
	//console.log("click: x="+x+", y="+y);
	for(nCnt=0 ; nCnt < mission.nEnemies ; nCnt++){
		//var x = mission.oEnemies[nCnt].x;
		var oEnemy = mission.oEnemies[nCnt];
		if(oEnemy.nextAction >= enAction.nDie)
			continue;
		//console.log("enemy: x="+oEnemy.posX+", y="+oEnemy.posY);
		if (x >= oEnemy.posX-30 && x <= oEnemy.posX+30){
			if(y >= oEnemy.posY-50 && y <= oEnemy.posY){
				return nCnt;
			}
		}
	}
	return -1;
}


// check given point is in the shooting range or not
// if it is in the range, return same position with argument
// if it's not, return end of shooting range in same direction
function checkShootRange(oCharacter, posX, posY){
	oCharacter.nShot;
	var gapX = posX-oCharacter.posX;
	var gapY = posY-oCharacter.posY;
	var dist = Math.sqrt( Math.pow(gapX,2) + Math.pow(gapY,2) );
	var point = { x:posX, y:posY};
	if(dist > oCharacter.nShot)
	{
		var ratio = gapY / gapX;
		var angle = Math.atan(ratio);
		if(gapX < 0){
			point.x = oCharacter.posX - oCharacter.nShot * Math.cos(angle);
			point.y = oCharacter.posY - oCharacter.nShot * Math.sin(angle);
		}else{
			point.x = oCharacter.posX + oCharacter.nShot * Math.cos(angle);
			point.y = oCharacter.posY + oCharacter.nShot * Math.sin(angle);
		}
		//if(gapY < 0)
		//	point.y = oCharacter.posY - oCharacter.nShot * Math.sin(angle);
		//else
		//	point.y = oCharacter.posY + oCharacter.nShot * Math.sin(angle);
	}
	return point;
}

// mouse up event handler
function mouseUp(evt){
	if(mission.nStatus == enStatus.nPlay){
		var x = evt.stageX;
		var y = evt.stageY;
		var oCharacter = mission.oControl;
		
		controls.bMouseDown = false;
		
		if( (controls.downX == x) && (controls.downY == y) )
		{
			// to make position as bottom-centre of character object.
			//x -=50;
			//y -= 50;
			
			// if character is dead ignore event
			if(oCharacter.nextAction >= enAction.nDie)
			{
				return;
			}
			
			// if character is not ready to do next action
			if(oCharacter.nReady > 0 )
			{
				return;
			}
			if (oCharacter.posX != x || oCharacter.posY !=y){
				// mouse click with fire key
				if(controls.bFireKey){
					if(oCharacter.nBullet <= 0)
					{
						return;
					}
					oCharacter.nextAction = enAction.nFire;
					oCharacter.nReady = 6 + (oCharacter.nType * 6); // no delay for marine
					var point = stageToGlobal(x, y);
					var hitPoint = checkShootRange(oCharacter, point.x, point.y);
					
					// if it's in the shooting range
					if( hitPoint.x == point.x && hitPoint.y == point.y){
						hitPoint = globalToStage(hitPoint.x, hitPoint.y);
						var nCnt = isClickEnemy(point.x, point.y);
						// hit on the ground
						if(nCnt < 0)
						{
							if(oCharacter.nType == enCharactors.nMarine)
								bulletMark(hitPoint.x-28, hitPoint.y-30, 2);
							else if(oCharacter.nType == enCharactors.nSpy)
								bulletMark(hitPoint.x-28, hitPoint.y-30, 1);
							else 
								bulletMark(hitPoint.x-28, hitPoint.y-30, 3);
						}
						else{ // hit enemy
							var oEnemy = mission.oEnemies[nCnt];
							var point = stageToGlobal(oEnemy.posX, oEnemy.posY);
							if(oEnemy.nType == enEnemies.nGunner && (oCharacter.posY > oEnemy.posY-40) ) {
								if(oCharacter.nType == enCharactors.nMarine)
									bulletMark(hitPoint.x-28, hitPoint.y-30, 2);
								else if(oCharacter.nType == enCharactors.nSpy)
									bulletMark(hitPoint.x-28, hitPoint.y-30, 1);
								else 
									bulletMark(hitPoint.x-28, hitPoint.y-30, 3);
							}
							else{
								oEnemy.nextAction = enAction.nDie;
								removeVision(oEnemy);
								oEnemy.nReady = 6;
								oEnemy.sprite.gotoAndPlay("die");
								//oEnemy.nReady=100;
							}
						}
						if(oCharacter.nType == enCharactors.nSniper && mission.nType == enMission.nAssassinate){
							var target = globalToStage(mission.oTarget.x, mission.oTarget.y);
							if(hitPoint.x > target.x){
								if(hitPoint.x<target.x+50){
									if(hitPoint.y>target.y && hitPoint.y<target.y+50){
										mission.oTarget.sprite.gotoAndPlay("die");
										mission.oTarget.bClear = true;
									}
								}	
							}
						}
					}
					else{ // if point is out of shooting range
						hitPoint = globalToStage(hitPoint.x, hitPoint.y);
						if(oCharacter.nType == enCharactors.nMarine)
							bulletMark(hitPoint.x-28, hitPoint.y-30, 2);
						else if(oCharacter.nType == enCharactors.nSpy)
							bulletMark(hitPoint.x-28, hitPoint.y-30, 1);
						else 
							bulletMark(hitPoint.x-28, hitPoint.y-30, 3);
					}
					
				}
				else if(controls.bSubKey){ // mouse click with secondary weapon fire key
					if(oCharacter.nType == enCharactors.nSniper)
						return;
					else if(oCharacter.nType == enCharactors.nMarine){
						if(mission.oRange.hitTest(x, y) == true){
							oCharacter.nextAction = enAction.nSubFire;
							oCharacter.nReady = 6;
						}
						else
							return;
					}else{
						oCharacter.nextAction = enAction.nSubFire;
						oCharacter.nReady = 6;
					}
				}
				else 
				{
					if(mission.nType == enMission.nAssassinate)
					{
						var point = stageToGlobal(x, y);
						if( point.x > (mission.oTarget.x- mission.oCharacters[enCharactors.nSniper].nShot + 30))
							return;
					}
					// sniper cannot move when he is hiding
					if( (oCharacter.nType == enCharactors.nSniper) && !oCharacter.bStand ){
						return;
					}
					else if ( (oCharacter.nType == enCharactors.nMarine) && !oCharacter.bStand ){
						// set next action and change sprite sheet
						oCharacter.nextAction = enAction.nMove;
						oCharacter.sprite.gotoAndPlay("crawl");
					}
					else if ( (oCharacter.nType == enCharactors.nSpy) && !oCharacter.bStand ){
						oCharacter.nextAction = enAction.nMove;
						oCharacter.sprite.gotoAndPlay("costume_run");
					}
					else
					{
						// set next action and change sprite sheet
						oCharacter.nextAction = enAction.nMove;
						oCharacter.sprite.gotoAndPlay("run");
					}
				}
				// set coordinates to move (or fire)
				var point = stageToGlobal(x, y);
				oCharacter.nextX = point.x;
				oCharacter.nextY = point.y;
				
				if(oCharacter.nextX < 30)
					oCharacter.nextX = 30;
				if(oCharacter.nextY < 10)
					oCharacter.nextY = 10;
				// set start position of this movement
				oCharacter.oldX = oCharacter.posX;
				oCharacter.oldY = oCharacter.posY;
			}
		}
	}
}

// mouse down event handler
function mouseDown(evt){
	if(mission.nStatus == enStatus.nPlay){
		controls.bMouseDown = true;
		
		// store mouse down event coordinate
		controls.downX = evt.stageX;
		controls.oldX = evt.stageX;
		controls.downY = evt.stageY;
		controls.oldY = evt.stageY;
		console.log("down: x="+evt.stageX+", y="+evt.stageY);
	}
}


/********************************************************************
 *
 *		functions to manage movement and action of objects
 *
 *      
 *
 *
 *
 *********************************************************************/
// move vision
// change vision range according to enemy's direction of movement and view
function moveVision(oEnemy, nAngle){
	var angle = 0;
	
	var gapX = oEnemy.nextX - oEnemy.oldX;
	var gapY = oEnemy.nextY - oEnemy.oldY;
	var fTan = 0;
	if(gapX != 0)
	{
		fTan = (gapY/gapX);
		angle = Math.atan(fTan); // * 360 / (Math.PI * 2);
	}
	
	angle = angle + (nAngle*Math.PI/180);
	if(gapX >= 0)
		drawVision(oEnemy, angle);
	else
		drawVision(oEnemy, angle+Math.PI);

}

function walkSoldier(oEnemy, bRun){
	oEnemy.nextAction = enAction.nMove;
	oEnemy.oldX = oEnemy.posX;
	oEnemy.oldY = oEnemy.posY;
	oEnemy.nextX = Math.random() * (oEnemy.endX-oEnemy.startX) + oEnemy.startX;
	oEnemy.nextY = Math.random() * (oEnemy.endY-oEnemy.startY) + oEnemy.startY;
	var gapX = oEnemy.nextX - oEnemy.oldX;
	var gapY = oEnemy.nextY - oEnemy.oldY;
	var length = Math.sqrt( Math.pow(gapX,2) + Math.pow(gapY,2) );
	if(bRun){
		oEnemy.nReady = Math.ceil(length / (oEnemy.nSpeed*2));
		oEnemy.sprite.gotoAndPlay("run");
	}else{
		oEnemy.nReady = Math.ceil(length / oEnemy.nSpeed);
		oEnemy.sprite.gotoAndPlay("walk");
	}
	oEnemy.moveX = gapX / oEnemy.nReady;
	oEnemy.moveY = gapY / oEnemy.nReady;
	if(gapX<0){
		oEnemy.sprite.scaleX = -1;
		oEnemy.bRight = false;
	}
	else{
		oEnemy.sprite.scaleX = 1;
		oEnemy.bRight = true;
	}
}

function manageSoldier(oEnemy){
	var nAngle = 0;
	
	switch(oEnemy.nextAction)
	{
		case enAction.nView:
			oEnemy.nReady--;
			// rotate in 60 frames => +- 30 degree
			nAngle =  30 - oEnemy.nReady;
			
			if(oEnemy.nReady == 0){ // when looking around is done, move to another point
				walkSoldier(oEnemy, false);
			}
			break;
		case enAction.nMove:
			oEnemy.posX += oEnemy.moveX;
			oEnemy.posY += oEnemy.moveY;
			oEnemy.nReady--;
			if(oEnemy.nReady == 0){
				oEnemy.nextAction = enAction.nView;
				oEnemy.sprite.gotoAndPlay("stand");
				oEnemy.nReady = 60;
			}
			break;
		case enAction.nChase:
			oEnemy.posX += oEnemy.moveX;
			oEnemy.posY += oEnemy.moveY;
			oEnemy.nReady--;
			if(oEnemy.nReady == 0){
				walkSoldier(oEnemy, true);
			}
			break;
		
		case enAction.nFire:
			if(oEnemy.nReady == 14){
				oEnemy.sprite.gotoAndPlay("shoot1");
				createjs.Sound.play("GunShot");
			}else if(oEnemy.nReady == 0){
				oEnemy.nextAction = enAction.nView; 
			}
			oEnemy.nReady--;
			break;
		case enAction.nDie:
			if(oEnemy.nReady == 0)
				oEnemy.nextAction = enAction.nDead;
			oEnemy.nReady--;
		case enAction.nDead:
		case enAction.nBuried:
			return;
	}
	moveVision(oEnemy, nAngle);
	detectInvasion(oEnemy);
}


// detect is there any invasion in current enemy (argument)'s vision
function detectInvasion(oEnemy){
	if(oEnemy.nextAction == enAction.nFire && oEnemy.nReady>0)
		return;

	// If it is officer's vision, check with dead body first
	if(oEnemy.nType == enEnemies.nOfficer){
		for(var nCnt=0 ; nCnt < mission.nEnemies ; nCnt++){
			if(mission.oEnemies[nCnt].nextAction == enAction.nDie || mission.oEnemies[nCnt].nextAction == enAction.nDead){
				var point = globalToStage(mission.oEnemies[nCnt].posX, mission.oEnemies[nCnt].posY);
				if (oEnemy.vision.hitTest(point.x, point.y) == true)
				{
					callWarningAlert(mission.oEnemies[nCnt]);
					mission.oEnemies[nCnt].nextAction = enAction.nBuried;
					mission.oEnemies[nCnt].sprite.visible = false;
				}
			}
		}

	}

	var alert = visibleCharacter(oEnemy);
	if(alert){
		// in the shooting range
		if(alert.nDistance < oEnemy.nShot){
			//shoot!!!
			oEnemy.nextAction = enAction.nFire;
			if(oEnemy.nType == enEnemies.nGunner)
				oEnemy.nReady = 7;
			else
				oEnemy.nReady = 14;
			oEnemy.nextX = mission.oCharacters[alert.nCharCount].posX;
			oEnemy.nextY = mission.oCharacters[alert.nCharCount].posY;
			
			mission.oCharacters[alert.nCharCount].nextAction = enAction.nDie;
			if(alert.x > oEnemy.posX){
				mission.oCharacters[alert.nCharCount].bRight = false;
				oEnemy.bRight = true;
			}else{
				mission.oCharacters[alert.nCharCount].bRight = true;
				oEnemy.bRight = false;
			}
		}else{		// in the vision range
			if( mission.oCharacters[alert.nCharCount].nType == enCharactors.nMarine && mission.oCharacters[alert.nCharCount].bStand == false){
				// crawling marine is not observable in vision range. only in shooting range
				return;
			}
			oEnemy.nextX = alert.x;
			oEnemy.nextY = alert.y;
			
			var gapX = oEnemy.nextX - oEnemy.posX;
			var gapY = oEnemy.nextY - oEnemy.posY;
			
			switch(oEnemy.nType){
				case enEnemies.nOfficer: // if it is officer, ring alert immediately
					callInvasionAlert(oEnemy.nextX, oEnemy.nextY, 3 ,1, true);
					break;
				case enEnemies.nGunner:
					oEnemy.sprite.gotoAndStop("watch");
					if (gapX > 0){
						oEnemy.bRight = true;
					}else{
						oEnemy.bRight = false;
					}
				case enEnemies.nSniper:
					if(oEnemy.nextAction != enAction.nChase){
						oEnemy.nextAction = enAction.nChase;
						// set alarm alert timer, 3 second
						oEnemy.nReady = 30;
					}
					return;
			}
			
			
			var nSpeed = oEnemy.nSpeed*2;
			
			// get distance to move
			var length = Math.sqrt( Math.pow(gapX,2) + Math.pow(gapY,2) );
			// calculate total turns to move
			var turns = Math.ceil(length / nSpeed);
			
			// calculate next position to move
			oEnemy.moveX = gapX / turns;
			oEnemy.moveY = gapY / turns;
			oEnemy.oldX = oEnemy.posX;
			oEnemy.oldY = oEnemy.posY;
			
			if(gapX > 0){
				oEnemy.bRight = true;
			}else{
				oEnemy.bRight = false;
			}
			
			// if this enemy is soldier, change moving range
			if(oEnemy.nType == enEnemies.nSoldier)
			{
				setSoldierMovingRange(oEnemy, oEnemy.nextX, oEnemy.nextY);
			}

			if(oEnemy.nextAction != enAction.nChase){
				oEnemy.nextAction = enAction.nChase;			
				oEnemy.sprite.gotoAndPlay("run");
			}
			oEnemy.nReady = turns;
		}
	}
}

function manageOfficer(oEnemy){
	manageSoldier(oEnemy);
}


// get current angle of vision range beam
function viewGunner(oEnemy){
	var nAngle = 0;
	
	if(oEnemy.nReady > 150){
		oEnemy.bRight = false;
		nAngle = (oEnemy.nReady - 150) * 2 + 90;
		if(oEnemy.nReady >= 200)
		{
			oEnemy.sprite.gotoAndPlay("watchDown");
		}
	}else if(oEnemy.nReady > 100){
		nAngle = (oEnemy.nReady - 100) * 2 - 10;
		oEnemy.bRight = true;
		if(oEnemy.nReady == 150){
			oEnemy.sprite.gotoAndPlay("watchUp");
		}
	}else if(oEnemy.nReady > 50){
		nAngle = 90 - ((oEnemy.nReady - 50) * 2 );
		oEnemy.bRight = true;
		if(oEnemy.nReady == 100){
			oEnemy.sprite.gotoAndPlay("watchDown");
		}
	}else{
		nAngle = 190 - (oEnemy.nReady * 2 );
		oEnemy.bRight = false;
		if(oEnemy.nReady == 50){
			oEnemy.sprite.gotoAndPlay("watchUp");
		}
		if(oEnemy.nReady == 0)
		{
			oEnemy.nReady = 201;
		}
	}

	return nAngle;
}


// when gunner or sniper goes back to watch mode, get nReady number based on current m value
function getReadyNum(oEnemy){
	var gapX = oEnemy.nextX - oEnemy.oldX;
	var gapY = oEnemy.nextY - oEnemy.oldY;
	var fTan = (gapY/gapX);
	var piAngle = Math.atan(fTan);
	var nAngle = piAngle * 180 / Math.PI;
	var nReadyNum = 0;
	
	if(gapX < 0)
		nAngle = nAngle + 180;
		
	nAngle = Math.round(nAngle/2);
	nAngle *= 2;

	if(oEnemy.nType == enEnemies.nSniper){
		nReadyNum = nAngle - 90;
	}
	else if (oEnemy.nType == enEnemies.nGunner){
		if(nAngle > 90){
			nReadyNum = 150 + (nAngle - 90) / 2;
		}
		else{
			nReadyNum = 100 + (nAngle + 10) / 2;
		}
	}
	return nReadyNum;
}


function manageGunner(oEnemy){
	var nAngle = 0;
	
	switch(oEnemy.nextAction){
		case enAction.nView:
			nAngle = viewGunner(oEnemy);
			// Check any characters in vision range
			oEnemy.nReady--;
			break;
		case enAction.nFire:
			if(oEnemy.nReady == 7){
				oEnemy.sprite.gotoAndPlay("shoot1");
				createjs.Sound.play("MachineGun");
			}else if(oEnemy.nReady == 0){
				oEnemy.nextAction = enAction.nView;
				oEnemy.nReady = getReadyNum(oEnemy) +1;
				oEnemy.oldX = oEnemy.nextX = oEnemy.posX;
				oEnemy.oldY = oEnemy.nextY = oEnemy.posY;
			}
			oEnemy.nReady--;
			break;
		case enAction.nChase:
			if(oEnemy.nReady == 0){
				callInvasionAlert(oEnemy.nextX, oEnemy.nextY, 1, 0, false);
				oEnemy.nextAction = enAction.nView;
				oEnemy.nReady = getReadyNum(oEnemy) +1;
				oEnemy.oldX = oEnemy.nextX = oEnemy.posX;
				oEnemy.oldY = oEnemy.nextY = oEnemy.posY;
			}
			oEnemy.nReady--;
			break;
		case enAction.nDie:
			if(oEnemy.nReady == 0)
				oEnemy.nextAction = enAction.nDead;
			oEnemy.nReady--;
		case enAction.nDead:
		case enAction.nBuried:
			return;
	}
	moveVision(oEnemy, nAngle);
	detectInvasion(oEnemy);
	
}

function manageSniper(oEnemy){
	var nAngle = 0;
	switch(oEnemy.nextAction){
		case enAction.nView:
			oEnemy.nReady--;
			if(oEnemy.nReady >= 60)
				nAngle = 90 + oEnemy.nReady;
			else
				nAngle = 150 + (60 -oEnemy.nReady);
			if(oEnemy.nReady == 0)
				oEnemy.nReady = 120;
			
			break;
		case enAction.nFire:
			if(oEnemy.nReady == 14){
				oEnemy.sprite.gotoAndPlay("shoot1");
				createjs.Sound.play("GunShot");
			}else if(oEnemy.nReady == 0){
				oEnemy.nextAction = enAction.nView;
				oEnemy.nReady = getReadyNum(oEnemy) +1;
				oEnemy.oldX = oEnemy.nextX = oEnemy.posX;
				oEnemy.oldY = oEnemy.nextY = oEnemy.posY;
			}
			oEnemy.nReady--;
			break;
		case enAction.nChase:
			if(oEnemy.nReady == 0){
				callInvasionAlert(oEnemy.nextX, oEnemy.nextY, 2, 0, false);
				oEnemy.nReady = getReadyNum(oEnemy) +1;
				oEnemy.oldX = oEnemy.nextX = oEnemy.posX;
				oEnemy.oldY = oEnemy.nextY = oEnemy.posY;
				oEnemy.nextAction = enAction.nView; 
			}
			oEnemy.nReady--;
			break;
		case enAction.nDie:
			if(oEnemy.nReady == 0)
				oEnemy.nextAction = enAction.nDead;
			oEnemy.nReady--;
		case enAction.nDead:
		case enAction.nBuried:
			return;
	}
	moveVision(oEnemy, nAngle);
	detectInvasion(oEnemy);
}

// dead body was founded.
// need backup troops to do the task what previous soldier did
function callWarningAlert(oEnemy){
	createjs.Sound.play("Warning");
	var oSoldier = createSoldier(2750, 150);
	dispatchSoldier(oSoldier, oEnemy.posX, oEnemy.posY, false);
	mission.oEnemies[mission.nEnemies++] = oSoldier;
	stages.stageCharacter.addChild(oSoldier.sprite);
	createVision(oSoldier);
}


// invader was detected.
// ring alarm sound and dispatch nNumber soldiers and one officer to x,y position
function callInvasionAlert(x, y, nSoldier, nOfficer, bRun){
	if(mission.nAlert > 0){
		return;
	}
	createjs.Sound.play("Alert");
	// avoid duplicated alert.
	// one alert is available for each 8 seconds
	mission.nAlert = 80;
	for(var nCnt=0 ; nCnt<nSoldier ; nCnt++){
		var startX = Math.random()*100 + 2750;
		var startY = Math.random()*100 + 150;
		var oSoldier = createSoldier(startX, startY);
		if(nCnt >= 3)
			dispatchSoldier(oSoldier, mission.oTarget.x, mission.oTarget.y, false);
		else 
			dispatchSoldier(oSoldier, x, y, bRun);
		mission.oEnemies[mission.nEnemies++] = oSoldier;
		oSoldier.sprite.x = oSoldier.posX-50;
		oSoldier.sprite.y = oSoldier.posY-50;
		stages.stageCharacter.addChild(oSoldier.sprite);
		createVision(oSoldier);
	}
	
	for(var nCnt=0 ; nCnt<nOfficer ; nCnt++){
		var startX = Math.random()*100 + 2750;
		var startY = Math.random()*100 + 150;
		var oOfficer = createOfficer(2800, 200);
		mission.oEnemies[mission.nEnemies++] = oOfficer;
		oOfficer.sprite.x = oOfficer.posX-50;
		oOfficer.sprite.y = oOfficer.posY-50;
		stages.stageCharacter.addChild(oOfficer.sprite);
		dispatchSoldier(oOfficer, x, y, bRun);
		createVision(oOfficer);
	}
	
}


// Check any characters are in the vision range
function visibleCharacter(oEnemy){
	var oVision = {
		x: 0
		,y: 0
		,nCharCount : -1
		,nDistance : 0
	}
	
	// Check any characters in vision range
	for(var nCnt=0 ; nCnt <= enCharactors.nSniper ;nCnt++){
		if(mission.oCharacters[nCnt].nextAction >= enAction.nDie)
			continue;
		else if(mission.oCharacters[nCnt].nType == enCharactors.nSniper && mission.oCharacters[nCnt].bStand == false && mission.oCharacters[nCnt].nReady<= 0 && mission.oCharacters[nCnt].nextAction != enAction.nFire){
			
			var dist = getDistance(mission.oCharacters[nCnt].posX, mission.oCharacters[nCnt].posY, oEnemy.posX, oEnemy.posY);
			// if character is hidden and not close enough to recognize
			if( dist > 40 )
				continue;
		}
		else if(mission.oCharacters[nCnt].nType == enCharactors.nSpy && mission.oCharacters[nCnt].bStand == false ){
			// if spy disguised to enemy character
			
			if(oEnemy.nType == enEnemies.nOfficer){
				// and if current vision owner is officer
				// and distance between officer and spy is not close enough cannot recognize
				var dist = getDistance(mission.oCharacters[nCnt].posX, mission.oCharacters[nCnt].posY, oEnemy.posX, oEnemy.posY);
				if( dist > oEnemy.nShot )
					continue;
			}else{
				// Enemies cannot recognize spy. unless spy shooting, or burying corpse
				if(mission.oCharacters[nCnt].nextAction != enAction.nFire && mission.oCharacters[nCnt].nextAction != enAction.nSubFire && mission.oCharacters[nCnt].nextAction != enAction.nAction){
					continue;
				}
				else{
					;// got it!;
				}
			}
		}
		
		var point = globalToStage(mission.oCharacters[nCnt].posX, mission.oCharacters[nCnt].posY);
		if (oEnemy.vision.hitTest(point.x, point.y) == true)
		{
			// if oVision never initialized, simply put data
			if(oVision.nCharCount <0){
				oVision.x = mission.oCharacters[nCnt].posX;
				oVision.y = mission.oCharacters[nCnt].posY;
				oVision.nCharCount = nCnt;
				oVision.nDistance = getDistance(oVision.x, oVision.y, oEnemy.posX, oEnemy.posY);
			}
			else
			{
				// if already there is any detected character, pick one based on distance
				var dist = getDistance(mission.oCharacters[nCnt].posX, mission.oCharacters[nCnt].posY, oEnemy.posX, oEnemy.posY);
				if(dist < oVision.nDistance)
				{
					oVision.x = mission.oCharacters[nCnt].posX;
					oVision.y = mission.oCharacters[nCnt].posY;
					oVision.nCharCount = nCnt;
					oVision.nDistance = dist;
				}
			}
		}
	}
	if(oVision.nCharCount <0)
		return null;
	else
		return oVision;
}

// Main function to manage enemies' action and movement
// is supposed to be invoked from loop
function manageEnemies(){
	var nCnt;
	mission.nAlert--;
	for(nCnt = 0 ; nCnt < mission.nEnemies ; nCnt++){
		var oEnemy = mission.oEnemies[nCnt];
		// change absolute position of whole map to position on current canvas(stage)
		var point;
		
		switch(oEnemy.nType){
			case enEnemies.nGunner:
				manageGunner(oEnemy);
				point = globalToStage(oEnemy.posX, oEnemy.posY);
				oEnemy.bitBunker.x = point.x-50;
				oEnemy.bitBunker.y = point.y-75;
				break;
			case enEnemies.nSniper:
				manageSniper(oEnemy);
				point = globalToStage(oEnemy.posX, oEnemy.posY);
				break;
			case enEnemies.nSoldier:
				manageSoldier(oEnemy);
				point = globalToStage(oEnemy.posX, oEnemy.posY);
				break;
			case enEnemies.nOfficer:
				manageOfficer(oEnemy);
				point = globalToStage(oEnemy.posX, oEnemy.posY);
				break;
		}
		
			
		// change absolute position of whole map to position on current canvas(stage)
		
		oEnemy.sprite.x = point.x-50;
		oEnemy.sprite.y = point.y-50;
		//oEnemy.vision[1].x = oEnemy.vision[0].x = point.x;
		//oEnemy.vision[1].y = oEnemy.vision[0].y = point.y-30;
		// if current direction of view is left side
		if(!oEnemy.bRight){
			oEnemy.sprite.x += 100;
			oEnemy.sprite.scaleX = -1;
		}else{
			oEnemy.sprite.scaleX = 1;
		}
	} // end of for
}
 
 
// manage special effect such as explosion or bullet spot..
function manageEffects(){
	if( mission.oBullet != null){
		var point = globalToStage(mission.oBullet.point.x, mission.oBullet.point.y);
		mission.oBullet.x = point.x;
		mission.oBullet.y = point.y;
		mission.oBullet.nCnt--;
		if(mission.oBullet.nCnt < 0){
			stages.stageCharacter.removeChild(mission.oBullet);
			mission.oBullet = null;
		}
	}
	var oCurPos = mission.oBlow;
	while(oCurPos != null){
		var point = globalToStage(oCurPos.point.x, oCurPos.point.y);
		oCurPos.x = point.x;
		oCurPos.y = point.y;
		oCurPos.nCnt--;
		if(oCurPos.nCnt == 15){
			// if it's blow mission, check grenade explode target
			if((mission.nType==enMission.nBlow || mission.nType==enMission.nBoth) && !mission.oTarget.bBlow){
				var dist = getDistance(mission.oTarget.x+40, mission.oTarget.y+80, oCurPos.point.x+50, oCurPos.point.y+100);
				if(dist < 120){
					mission.oTarget.bBlow = true;
					stages.stageBG.removeChild(mission.oTarget.sprite);
					mission.oTarget.sprite = null;
					var position = globalToStage(mission.oTarget.x, mission.oTarget.y);
					
					var spBlow1 = new createjs.Sprite(mission.ssBlow, "explode");
					var spBlow2 = new createjs.Sprite(mission.ssBlow, "explode");
					var spBlow3 = new createjs.Sprite(mission.ssBlow, "explode");
					spBlow1.x = position.x;
					spBlow1.y = position.y;
					spBlow2.x = position.x - 60;
					spBlow2.y = position.y - 40;
					spBlow3.x = position.x + 50;
					spBlow3.y = position.y - 35;
					spBlow1.gotoAndPlay("explode");
					spBlow2.gotoAndPlay("explode");
					spBlow3.gotoAndPlay("explode");
					stages.stageCharacter.addChild(spBlow1);
					stages.stageCharacter.addChild(spBlow2);
					stages.stageCharacter.addChild(spBlow3);
				}
			}
			// call backup troop. 3 soldiers and 1 officer
			callInvasionAlert(oCurPos.point.x, oCurPos.point.y, 2, 1, true);
			// gather all soldiers and officer nearby (within 1200 pixel)
			hearBlowNoise(oCurPos.point.x, oCurPos.point.y);
			for(var nCnt = 0 ; nCnt < mission.nEnemies ; nCnt++){
				var oEnemy = mission.oEnemies[nCnt];
				if(oEnemy.nextAction >= enAction.nDie)
					continue;
				var dist = getDistance(oEnemy.posX, oEnemy.posY, oCurPos.point.x+50, oCurPos.point.y+100 );
				if(dist <= 130){
					oEnemy.nextAction = enAction.nDie;
					removeVision(oEnemy);
					oEnemy.sprite.gotoAndPlay("die");
					oEnemy.nReady=6;
				}
			}
		}
		else if(oCurPos.nCnt < 0){
			stages.stageCharacter.removeChild(oCurPos);
			mission.oBlow = oCurPos.next;
			oCurPos = null;
		}
		oCurPos = oCurPos.next;
	}
	
	var position = globalToStage(mission.oTarget.x, mission.oTarget.y);
	if(mission.oTarget.sprite != null){
		mission.oTarget.sprite.x = position.x;
		mission.oTarget.sprite.y = position.y;
	}
	
	if(mission.nType == enMission.nAssassinate){
		position = globalToStage(mission.oTarget.x- mission.oCharacters[enCharactors.nSniper].nShot + 30, 0);
		mission.oTarget.bitmap.x = position.x;
		mission.oTarget.bitmap.y = position.y;
	}else{	
		if(mission.oTarget.bitmap != null){
			mission.oTarget.bitmap.x = position.x;
			mission.oTarget.bitmap.y = position.y+60;
		}
	}
}


// check mission failure condition. if it failed return true
function checkMissionFail(){
	var nSurvivor = 0;
	for(var nCnt=0 ; nCnt <= enCharactors.nSniper ; nCnt++){
		if(mission.oCharacters[nCnt].nextAction < enAction.nDie)
		{
			nSurvivor++;
			break;
		}
	}
	if(nSurvivor <= 0){
		var szEnemies = "Mission Failed:\n     No more special forces!!!";
		var text = new createjs.Text(szEnemies, "50px Arial Bold", "rgba(255, 0, 0, 0.8)");
		text.x = 200;
		text.y = 300;
		text.textBaseline = "alphabetic";
		stages.stageUI.addChild(text);
		return true;
	}
	switch(mission.nType){
		case enMission.nBoth:
			if( (mission.oCharacters[enCharactors.nMarine].nextAction >= enAction.nDie) && !mission.oTarget.bBlow){
				var szEnemies = "Mission Failed:\n   Cannot explode target without marine";
				var text = new createjs.Text(szEnemies, "50px Arial Bold", "rgba(255, 0, 0, 0.8)");
				text.x = 100;
				text.y = 300;
				text.textBaseline = "alphabetic";
				stages.stageUI.addChild(text);
				return true;
			}
			else if ((mission.oCharacters[enCharactors.nMarine].nGrenade <= 0) && !mission.oTarget.bBlow){
				var szEnemies = "Mission Failed:\n   Need grenade to explode the target!";
				var text = new createjs.Text(szEnemies, "50px Arial Bold", "rgba(255, 0, 0, 0.8)");
				text.x = 100;
				text.y = 300;
				text.textBaseline = "alphabetic";
				stages.stageUI.addChild(text);
				return true;
			}
		case enMission.nSpying:
			if(mission.oCharacters[enCharactors.nSpy].nextAction >= enAction.nDie){
				var szEnemies = "Mission Failed:\n     Only spy can obtain confidential!";
				var text = new createjs.Text(szEnemies, "50px Arial Bold", "rgba(255, 0, 0, 0.8)");
				text.x = 100;
				text.y = 300;
				text.textBaseline = "alphabetic";
				stages.stageUI.addChild(text);
				return true;
			}
			break;
		case enMission.nBlow:
			if( (mission.oCharacters[enCharactors.nMarine].nextAction >= enAction.nDie) && !mission.oTarget.bBlow){
				var szEnemies = "Mission Failed:\n     Only marine can explode the target!";
				var text = new createjs.Text(szEnemies, "50px Arial Bold", "rgba(255, 0, 0, 0.8)");
				text.x = 200;
				text.y = 300;
				text.textBaseline = "alphabetic";
				stages.stageUI.addChild(text);
				return true;
			}
			else if ((mission.oCharacters[enCharactors.nMarine].nGrenade <= 0) && !mission.oTarget.bBlow){
				var szEnemies = "Mission Failed:\n     No more grenade to explode the target!";
				var text = new createjs.Text(szEnemies, "50px Arial Bold", "rgba(255, 0, 0, 0.8)");
				text.x = 200;
				text.y = 300;
				text.textBaseline = "alphabetic";
				stages.stageUI.addChild(text);
				return true;
			}
			break;
		case enMission.nAssassinate:
			if( (mission.oCharacters[enCharactors.nSniper].nextAction >= enAction.nDie) && !mission.oTarget.bClear){
				var szEnemies = "Mission Failed:\n     Only sniper can shot the target";
				var text = new createjs.Text(szEnemies, "50px Arial Bold", "rgba(255, 0, 0, 0.8)");
				text.x = 200;
				text.y = 300;
				text.textBaseline = "alphabetic";
				stages.stageUI.addChild(text);
				return true;
			}
			else if ((mission.oCharacters[enCharactors.nSniper].nBullet <= 0) && !mission.oTarget.bClear){
				var szEnemies = "Mission Failed:\n     No more bullet to shot the target!";
				var text = new createjs.Text(szEnemies, "50px Arial Bold", "rgba(255, 0, 0, 0.8)");
				text.x = 200;
				text.y = 300;
				text.textBaseline = "alphabetic";
				stages.stageUI.addChild(text);
				return true;
			}
			break;
		default:
			break;
	}
	return false;
}

// check current game status. if current level was cleared or not
// if user achieved all the conditions, return true
function checkMissionClear(){
	var position;
	switch(mission.nType){
		case enMission.nClear:
			// return false if there are any survivor
			for(var nCnt=0 ; nCnt < mission.nEnemies ; nCnt++){
				if(mission.oEnemies[nCnt].nextAction < enAction.nDie)
					return false;
			}
			mission.oTarget.bClear = true;
			return true;
			break;
		case enMission.nSpying:
			if(mission.oTarget.bObtain == true)
			{
				if(mission.oCharacters[enCharactors.nSpy].posX > 200 ||  mission.oCharacters[enCharactors.nSpy].posY < (mission.nMapHeight-200) )
					return false;
				mission.oTarget.bReturn = true;
				return true;
			}
			break;
		case enMission.nBoth:
			if(mission.oTarget.bObtain == true && mission.oTarget.bBlow == true)
			{
				if(mission.oCharacters[enCharactors.nSpy].posX > 200 ||  mission.oCharacters[enCharactors.nSpy].posY < (mission.nMapHeight-200) )
					return false;
				mission.oTarget.bReturn = true;
				return true;
			}
			break;
		case enMission.nBlow:
			if(mission.oTarget.bBlow == true)
			{
				mission.nStatus = enStatus.nClear;
			}
			break;
		case enMission.nAssassinate:
			if(mission.oTarget.bClear == true)
			{
				mission.nStatus = enStatus.nClear;
			}
		default:
			break;
	}
	return false;
}


// set mouse cursor type according to game playing status.
function manageCursor(){
	switch(mission.nStatus){
		case enStatus.nPlay:
			var nCnt = isClickEnemy(controls.position.x, controls.position.y);
			
			if( mission.oControl.nReady > 0 ){
				setCursorByID("game-menu", "wait");
			}
			else if( nCnt < 0 ){
				setCursorByID("game-menu", "pointer");
			}
			else{
				var oEnemy = mission.oEnemies[nCnt];
				if( isInRange(mission.oControl, oEnemy) )
					setCursorByID("game-menu", "crosshair");
				else
					setCursorByID("game-menu", "not-allowed");
			}
			break;
		default:
			setCursorByID("game-menu", "default");
			break;
	}
}
 
// manage and update GUI components
function manageGUI(){
	var nAlive = 0;
	
	for(var nCnt=0; nCnt < mission.nEnemies ; nCnt++){
		if(mission.oEnemies[nCnt].nextAction < enAction.nDie)
			nAlive++;
	}
	guiControls.txtEnemies.text = "Enemies : " + nAlive + " / " + mission.nEnemies;
	
	guiControls.txtBullets.text = mission.oControl.nBullet;
	if(mission.oControl.nType == enCharactors.nMarine)
	{
		guiControls.txtGrenades.text = mission.oControl.nGrenade;
	}
	else
	{
		guiControls.txtGrenades.text = mission.oControl.nGrenade;
	}
	
	guiControls.txtMission.text = printAchivements();
	/*
	switch(mission.nType){
		case enMission.nClear:
			break;
		case enMission.nSpying:
			break;
		case enMission.nBoth:
			break;
		case enMission.nBlow:
			break;
		default:
			break;
	}
	*/
}
 
// manage character's action and movement
// next action to do is decided by event handler (mouse and/or key event)
// this function called by gameloop.
function manageCharacters(){
	var nCnt = enCharactors.nSniper;
	
	// check each characters.
	for(nCnt = enCharactors.nSniper ; nCnt >= 0 ; nCnt--)
	{
		switch(mission.oCharacters[nCnt].nextAction)
		{
			case enAction.nMove: // if next action to do is move
				moveCharacters(mission.oCharacters[nCnt]);
				break;
			case enAction.nHold: // if next action to do is same with current action
				//keepCharacters(mission.oCharacters[nCnt]);
				break;
			case enAction.nFire: // if next action to do is fire main weapon
				if(mission.oCharacters[nCnt].nReady == ((mission.oCharacters[nCnt].nType * 6)+6))
					fireWeapon(mission.oCharacters[nCnt]);
				else if (mission.oCharacters[nCnt].nReady == 0)
					mission.oCharacters[nCnt].nextAction = enAction.nStay;
				mission.oCharacters[nCnt].nReady--;
				break;
			case enAction.nSubFire: // if next action to do is fire secondary weapon
				if(mission.oCharacters[nCnt].nReady == 6)
					fireSecond(mission.oCharacters[nCnt]);
				else if (mission.oCharacters[nCnt].nReady == 0)
					mission.oCharacters[nCnt].nextAction = enAction.nStay;
				mission.oCharacters[nCnt].nReady--;
				break;
			case enAction.nAction: // if next action to do is character's own special action; creeping, pull corpse, or hide
				if(mission.oCharacters[nCnt].nReady == 0)
				{
					for(var nCount = 0 ; nCount < mission.nEnemies ; nCount++){
						// ignore alive enemies or buried
						if(mission.oEnemies[nCount].nextAction == enAction.nDie || mission.oEnemies[nCount].nextAction == enAction.nDead)
						{
							var distance = getDistance(mission.oCharacters[nCnt].posX, mission.oCharacters[nCnt].posY, mission.oEnemies[nCount].posX, mission.oEnemies[nCount].posY);
							// if not in the range move next
							if( distance <= 50){
								mission.oEnemies[nCount].nextAction = enAction.nBuried;
								mission.oEnemies[nCount].sprite.visible = false;
								break;
							}
						}
					}
					if(mission.oCharacters[nCnt].bStand)
						mission.oCharacters[nCnt].sprite.gotoAndStop("stand");
					else
						mission.oCharacters[nCnt].sprite.gotoAndStop("costume_stand");
					mission.oCharacters[nCnt].nextAction = enAction.nStay;
				}
				mission.oCharacters[nCnt].nReady--;
				break;
			case enAction.nDie: // if character took a bullet
				mission.oCharacters[nCnt].sprite.gotoAndPlay("die");
				createjs.Sound.play("Die");
				mission.oCharacters[nCnt].nextAction = enAction.nDead;
				break;
			case enAction.nStay: // just staying...
				break;
			case enAction.nDead: // already dead man
				switch(mission.oCharacters[nCnt].nType)
				{
					case enCharactors.nMarine :
						stages.stageUI.removeChild(guiControls.iconMarine.iSelected);
						stages.stageUI.removeChild(guiControls.iconMarine.iNormal);
						stages.stageUI.addChild(guiControls.iconMarine.iDead);
						break;
					case enCharactors.nSpy :
						stages.stageUI.removeChild(guiControls.iconSpy.iSelected);
						stages.stageUI.removeChild(guiControls.iconSpy.iNormal);
						stages.stageUI.addChild(guiControls.iconSpy.iDead);
						break;
					case enCharactors.nSniper :
						stages.stageUI.removeChild(guiControls.iconSniper.iSelected);
						stages.stageUI.removeChild(guiControls.iconSniper.iNormal);
						stages.stageUI.addChild(guiControls.iconSniper.iDead);
						break;
					default:
						break;
				}	
				break;
		}
		
		// change absolute position of whole map to position on current canvas(stage)
		var point = globalToStage(mission.oCharacters[nCnt].posX, mission.oCharacters[nCnt].posY);
		mission.oCharacters[nCnt].sprite.x = point.x-50;
		mission.oCharacters[nCnt].sprite.y = point.y-50;
		// if current direction of view is left side
		if(!mission.oCharacters[nCnt].bRight){
			mission.oCharacters[nCnt].sprite.x += 100;
			mission.oCharacters[nCnt].sprite.scaleX = -1;
		}
		else
		{
			mission.oCharacters[nCnt].sprite.scaleX = 1;
		}
		mission.oCharacters[nCnt].nReady = mission.oCharacters[nCnt].nReady > 0 ? mission.oCharacters[nCnt].nReady-1 : 0;
		
	}
	if(controls.bFireKey){
		var point = globalToStage(mission.oControl.posX, mission.oControl.posY);
		drawShotRange(point.x, point.y, mission.oControl.nShot);
	}else if(controls.bSubKey && mission.oControl.nType == enCharactors.nMarine){
		var point = globalToStage(mission.oControl.posX, mission.oControl.posY);
		drawShotRange(point.x, point.y, mission.oControl.nShot*0.9);
	}else
		drawShotRange(0, 0, 0); // when user did not press any weapon key
	
	
}

function stageToGlobal(x, y){
	var point = { x:0, y:0};
	point.x = x - mission.bitMap.x;
	point.y = y - mission.bitMap.y;
	return point;
}

function globalToStage(x, y){
	var point = { x:0, y:0};
	point.x = mission.bitMap.x + x;
	point.y = mission.bitMap.y + y;
	return point;
}

function fireSecond(oCharacter){

	if(oCharacter.nType == enCharactors.nSniper)
	{
		return;
	} // no secondary weapon for sniper

	var sprite = oCharacter.sprite;
	
	var gapX = oCharacter.nextX - oCharacter.oldX;
	var gapY = oCharacter.nextY - oCharacter.oldY;
	// if character goes to left side
	if(gapX<0 && sprite.scaleX > 0)
	{
		sprite.scaleX *= -1;
		oCharacter.bRight = false;
	}
	else if (gapX > 0 && sprite.scaleX < 0) // if character goes to right side
	{
		sprite.scaleX *= -1;
		oCharacter.bRight = true;
	}
	
	
	if(oCharacter.nType == enCharactors.nMarine){
		oCharacter.bStand = true;
		sprite.gotoAndPlay("throw");
		createjs.Sound.play("Grenade");
		var point = globalToStage(oCharacter.nextX, oCharacter.nextY);
		blowAnimation(point.x-50, point.y-100);
		oCharacter.nGrenade--;
	}else{
		if(oCharacter.bStand)
			sprite.gotoAndPlay("stab");
		else
			sprite.gotoAndPlay("costume_stab");
		createjs.Sound.play("Knife");
		var bRight = (oCharacter.nextX > oCharacter.posX) ? true : false;
		// kill all enemies within the range.
		for(var nCnt = 0 ; nCnt < mission.nEnemies ; nCnt++){
			var oEnemy = mission.oEnemies[nCnt];
			if(oEnemy.nextAction >= enAction.nDie)
				continue;
			var gapX = oEnemy.posX - oCharacter.posX;
			var gapY = oEnemy.posY - oCharacter.posY;
			var dist = Math.sqrt( Math.pow(gapX , 2) + Math.pow(gapY , 2) );
			
			var bKill = false;
			// if location of the enemy is different with stabbing shot range is 30
			if( ((bRight && gapX<=0) || (!bRight && gapX > 0)) && (dist <= 30)){
				bKill = true;
			}else if( ((bRight && gapX>0) || (!bRight && gapX <= 0)) && (dist <= 60)){
				bKill = true;
			}
			if( bKill ){
				oEnemy.nextAction = enAction.nDie;
				removeVision(oEnemy);
				oEnemy.sprite.gotoAndPlay("die");
				oEnemy.nReady=6;
			}
		}
	}
	
}

function fireWeapon(oCharacter){
	var sprite = oCharacter.sprite;
	
	var gapX = oCharacter.nextX - oCharacter.oldX;
	var gapY = oCharacter.nextY - oCharacter.oldY;
	// if character goes to left side
	if(gapX<0)
	{
		sprite.scaleX = -1;
		oCharacter.bRight = false;
	}
	else if (gapX > 0) // if character goes to right side
	{
		sprite.scaleX = 1;
		oCharacter.bRight = true;
	}
	
	if(oCharacter.bStand){
		sprite.gotoAndPlay("shoot1");
	}
	else
	{
		sprite.gotoAndPlay("shoot2");
	}
	
	switch(oCharacter.nType) // TEST Y.Ishioka
	{
		case enCharactors.nMarine:
			createjs.Sound.play("MachineGun");
			break;
		case enCharactors.nSpy:
			createjs.Sound.play("Silencer");
			break;
		case enCharactors.nSniper:
			createjs.Sound.play("GunShot");
			break;
		default:
	}
	
	// reduce number of bullet
	oCharacter.nBullet--;
	
	// call enemies near shot sound position
	hearShotNoise(oCharacter);

}

// call enemies near shot sound position
function hearShotNoise(oCharacter){
	for(var nCnt = 0 ; nCnt < mission.nEnemies ; nCnt++){
		var oEnemy = mission.oEnemies[nCnt];
		if(oEnemy.nextAction >= enAction.nDie)
			continue;
		var dist = getDistance(oCharacter.posX, oCharacter.posY, oEnemy.posX, oEnemy.posY);
		
		var compVal;
		switch(oCharacter.nType){
			case enCharactors.nMarine:
				compVal = 900;
				break;
			case enCharactors.nSniper:
				compVal = 400;
				break;
			case enCharactors.nSpy:
				compVal = 100;
				break;
		}
		if(dist > compVal)
			continue;
		switch(oEnemy.nType){
			case enEnemies.nSoldier: // if soldier come to the position
			case enEnemies.nOfficer: // if officer come to the position
				sendSoldier(oEnemy, oCharacter.posX, oCharacter.posY, false);
				break;
		}
	}
}

// call enemies near bomb blow sound position
function hearBlowNoise(x, y){
	for(var nCnt = 0 ; nCnt < mission.nEnemies ; nCnt++){
		var oEnemy = mission.oEnemies[nCnt];
		if(oEnemy.nextAction >= enAction.nDie)
			continue;
		var dist = getDistance(x, y, oEnemy.posX, oEnemy.posY);
		if(dist > 1900)
			continue;
		switch(oEnemy.nType){
			case enEnemies.nSoldier: // if soldier come to the position
			case enEnemies.nOfficer: // if officer come to the position
				sendSoldier(oEnemy, x, y, false);
				break;
		}
	}
}


function fireWeaponE(oEnemy){ // Test Y.Ishioka
 	var sprite = oEnemy.sprite;

	sprite.gotoAndPlay("shoot1");
 }

// function to manage movement of character
function moveCharacters(oCharacter){
	var sprite = oCharacter.sprite;
	
	if(oCharacter.nType == enCharactors.nSniper)
	{
		// sniper cannot move when he is hiding
		if(!oCharacter.bStand){
			oCharacter.nextAction = enAction.nStay;
		}
	}
	sprite.play();
	
	var gapX = oCharacter.nextX - oCharacter.oldX;
	var gapY = oCharacter.nextY - oCharacter.oldY;
	
	var nSpeed = oCharacter.nSpeed;
	
	if(!oCharacter.bStand)
	{
		if(oCharacter.nType == enCharactors.nMarine)
			nSpeed /= 4;
	}
	
	// get distance to move
	var length = Math.sqrt( Math.pow(gapX,2) + Math.pow(gapY,2) );
	// calculate total turns to move
	var turns = Math.ceil(length / nSpeed);
	// calculate next position to move
	var moveX = gapX / turns;
	var moveY = gapY / turns;
	
	if(isNaN(moveX)){
		moveX = 0;
	}
	if(isNaN(moveY)){
		moveY = 0;
	}
	
	// if character goes to left side
	if(gapX<0)
	{
		sprite.scaleX = -1;
		oCharacter.bRight = false;
		//sprite.x += 100;
	}
	else if (gapX > 0) // if character goes to right side
	{
		sprite.scaleX = 1;
		oCharacter.bRight = true;
		//sprite.x -= 100;
	}
	
	// store position to move
	oCharacter.posX += moveX;
	oCharacter.posY += moveY;
	
	// if character arrived almost to target point
	
	var distance = getDistance(oCharacter.nextX, oCharacter.nextY, oCharacter.posX, oCharacter.posY);
	if(distance < (nSpeed/2) )
	{
		oCharacter.posX = oCharacter.nextX;
		oCharacter.posY = oCharacter.nextY;
		oCharacter.nextAction = enAction.nStay;
		if(oCharacter.bStand)
			sprite.gotoAndStop("stand");
		else
			sprite.gotoAndStop("crawl2");
	}
	
	// check if spy is on the position where he can obtain confidential document
	if((mission.nType == enMission.nSpying || mission.nType == enMission.nBoth) && oCharacter.nType == enCharactors.nSpy  ){
		if(!mission.oTarget.bObtain){
			var x = mission.oTarget.x+20;
			var y = mission.oTarget.y+60+12;
			var dist = getDistance(oCharacter.posX, oCharacter.posY, x, y);
			if(dist < 50){
				mission.oTarget.bObtain = true;
				stages.stageBG.removeChild(mission.oTarget.bitmap);
				mission.oTarget.bitmap = null;
			}
		}
	}
}




// when user dragging map
function moveMap(gapX, gapY){

	mission.bitMap.x -= gapX;
	mission.bitMap.y -= gapY;
	
	//console.log("move: x = " + gapX + " ,y = " + gapY);
	//console.log("move: mission.bitMap.x=" + mission.bitMap.x + " ,mission.bitMap.y=" + mission.bitMap.y);
	
	
	if( mission.bitMap.x < -(mission.nMapWidth - mission.nCanWidth) ){
		mission.bitMap.x = -(mission.nMapWidth - mission.nCanWidth);
	}else if ( mission.bitMap.x > 0 ) {
		mission.bitMap.x = 0;
	}
	
	if( mission.bitMap.y < -(mission.nMapHeight - mission.nCanHeight)){
		mission.bitMap.y = -(mission.nMapHeight - mission.nCanHeight);
	}else if ( mission.bitMap.y > 0) {
		mission.bitMap.y = 0;
	}
}

// set coordinate x,y (argument value) as centre of the stage
function moveStage(x, y){
	var point = globalToStage(x, y);
	var gapX = point.x - mission.nCanWidth/2;
	var gapY = point.y - mission.nCanHeight/2;
	moveMap(gapX, gapY);
}

function specialAction(){
	if(mission.oControl.nextAction < enAction.nDie)
	{
		if(mission.oControl.nType == enCharactors.nSpy){
			changeSuit(mission.oControl);
		}
		else if(mission.oControl.nType == enCharactors.nMarine){
			crawling(mission.oControl);
		}
		else{
			hiding(mission.oControl);
		}
	}
	
}

function getDistance(x1, y1, x2, y2){
	var gapX = x1 - x2;
	var gapY = y1 - y2;
	var distance = Math.sqrt( Math.pow(gapX,2) + Math.pow(gapY,2) );
	return distance;
}

// Bury dead body and change suit
function changeSuit(oCharacter){
	for(var nCnt = 0 ; nCnt < mission.nEnemies ; nCnt++){
		// ignore alive enemies or buried
		if(mission.oEnemies[nCnt].nextAction == enAction.nDie || mission.oEnemies[nCnt].nextAction == enAction.nDead)
		{
			var distance = getDistance(oCharacter.posX, oCharacter.posY, mission.oEnemies[nCnt].posX, mission.oEnemies[nCnt].posY);
			// if not in the range move next
			if( distance > 50)
				continue;
			
			// if already transformed, just bury
			if(oCharacter.bStand == false){
				oCharacter.sprite.gotoAndPlay("bury2");
				oCharacter.nReady = 80;
				oCharacter.nextAction = enAction.nAction;
			} // if dead body is not soldier or officer
			else if(mission.oEnemies[nCnt].nType == enEnemies.nSoldier || mission.oEnemies[nCnt].nType == enEnemies.nOfficer){
				oCharacter.sprite.gotoAndPlay("trans");
				oCharacter.nReady = 170;
				oCharacter.nextAction = enAction.nAction;
				oCharacter.bStand = false;
			}else{
				oCharacter.sprite.gotoAndPlay("bury1");
				oCharacter.nReady = 80;
				oCharacter.nextAction = enAction.nAction;
				return;
			}

		}
	}
}

// hide
function hiding(oCharacter){
	if(oCharacter.bStand){ // if character is standing up now
		// change his action to crawling(or hiding)
		oCharacter.bStand = false;
		oCharacter.sprite.gotoAndPlay("crawl");
	}else{ // if character is crawling or hiding now
		oCharacter.bStand = true;
		oCharacter.sprite.gotoAndPlay("standup");
	}
	
	// change character's status as stay
	oCharacter.nextAction = enAction.nStay;
	oCharacter.nReady = 12;
}

// make character crawling (marine)
function crawling(oCharacter){
	if(oCharacter.bStand){ // if character is standing up now
		// change his action to crawling(or hiding)
		oCharacter.bStand = false;
		oCharacter.sprite.gotoAndStop("crawl");
	}else{ // if character is crawling or hiding now
		oCharacter.bStand = true;
		oCharacter.sprite.gotoAndStop("stand");
	}
	
	// change character's status as stay
	oCharacter.nextAction = enAction.nStay;
}

/********************************************************************
 *
 *		Key stroke event handling functions
 *
 *      And recognizing user input status function
 *
 *
 *
 *********************************************************************/

// keyDown event handler
function keyPress(){
	if(mission.nStatus == enStatus.nPlay){
		switch(event.which){
			case 90: // z key
				// set fire key button flag as true
				// mouse click with fire key is fire weapon
				controls.bFireKey = true;
				break;
			case 88: // x key
				// set secondary fire key button flag as true
				// mouse click with fire key is fire weapon
				controls.bSubKey = true;
				break;
			case 87: // w key
				moveUp();
				break;
			case 83: // s key
				moveDown();
				break;
			case 65: // a key
				moveLeft();
				break;
			case 68: // d key
				moveRight();
				break;
			default:
				return;
		}
	}
}




// keyUp event handler
function keyRelease(){
	if(mission.nStatus == enStatus.nPlay){
		switch(event.which){
			case 49: // press 1, select marine
				  
				if(mission.oControl == mission.oCharacters[enCharactors.nMarine])
				{
					moveStage(mission.oControl.posX, mission.oControl.posY);  // focus on Marine's location
				}
				else
				{   // not focus on Marine's location, but icon is selected.
					mission.oControl = mission.oCharacters[enCharactors.nMarine];
					if(mission.oCharacters[enCharactors.nMarine].nextAction < enAction.nDie)
					{
						stages.stageUI.removeChild(guiControls.iconMarine.iNormal);

						stages.stageUI.removeChild(guiControls.iconSpy.iSelected);
						stages.stageUI.removeChild(guiControls.iconSniper.iSelected);
						stages.stageUI.removeChild(guiControls.iconSpy.iNormal);
						stages.stageUI.removeChild(guiControls.iconSniper.iNormal);
						
						stages.stageUI.addChild(guiControls.iconGrenade);
						stages.stageUI.addChild(guiControls.txtGrenades);

						stages.stageUI.addChild(guiControls.iconMarine.iSelected);

						if(mission.oCharacters[enCharactors.nSpy].nextAction < enAction.nDie)
						{
							stages.stageUI.addChild(guiControls.iconSpy.iNormal);
						}
						if(mission.oCharacters[enCharactors.nSniper].nextAction < enAction.nDie)
						{
							stages.stageUI.addChild(guiControls.iconSniper.iNormal);
						}

					}
 				}
				break;
			case 50: // press 2, select spy
				if(mission.oControl == mission.oCharacters[enCharactors.nSpy])
				{
					moveStage(mission.oControl.posX, mission.oControl.posY);
				} else {
					if (mission.oControl == mission.oCharacters[enCharactors.nMarine]){
						stages.stageUI.removeChild(guiControls.iconGrenade);
						stages.stageUI.removeChild(guiControls.txtGrenades);
					}
					mission.oControl = mission.oCharacters[enCharactors.nSpy];

					if(mission.oCharacters[enCharactors.nSpy].nextAction < enAction.nDie)
					{
						stages.stageUI.removeChild(guiControls.iconSpy.iNormal);

						stages.stageUI.removeChild(guiControls.iconMarine.iSelected);
						stages.stageUI.removeChild(guiControls.iconSniper.iSelected);
						stages.stageUI.removeChild(guiControls.iconMarine.iNormal);
						stages.stageUI.removeChild(guiControls.iconSniper.iNormal);
						

						if(mission.oCharacters[enCharactors.nMarine].nextAction < enAction.nDie)
						{
							stages.stageUI.addChild(guiControls.iconMarine.iNormal);
						}

						stages.stageUI.addChild(guiControls.iconSpy.iSelected);
						
						if(mission.oCharacters[enCharactors.nSniper].nextAction < enAction.nDie)
						{
							stages.stageUI.addChild(guiControls.iconSniper.iNormal);
						}

					}
				}
				break;
			case 51: // press 3, select sniper
				if(mission.oControl == mission.oCharacters[enCharactors.nSniper])
				{
					moveStage(mission.oControl.posX, mission.oControl.posY);
				} else {
					if (mission.oControl == mission.oCharacters[enCharactors.nMarine]){
						stages.stageUI.removeChild(guiControls.iconGrenade);
						stages.stageUI.removeChild(guiControls.txtGrenades);
					}
					mission.oControl = mission.oCharacters[enCharactors.nSniper];
					if(mission.oCharacters[enCharactors.nSniper].nextAction < enAction.nDie)
					{
						stages.stageUI.removeChild(guiControls.iconSniper.iNormal);

						stages.stageUI.removeChild(guiControls.iconMarine.iSelected);
						stages.stageUI.removeChild(guiControls.iconSpy.iSelected);
						stages.stageUI.removeChild(guiControls.iconMarine.iNormal);
						stages.stageUI.removeChild(guiControls.iconSpy.iNormal);

						if(mission.oCharacters[enCharactors.nMarine].nextAction < enAction.nDie)
						{
							stages.stageUI.addChild(guiControls.iconMarine.iNormal);
						}
						if(mission.oCharacters[enCharactors.nSpy].nextAction < enAction.nDie)
						{
							stages.stageUI.addChild(guiControls.iconSpy.iNormal);
						}
						
						stages.stageUI.addChild(guiControls.iconSniper.iSelected);
						
					}
				}
				break;
			//case 52: // victor_test
			//	mission.nStatus = enStatus.nOver;
			case 90:
				// set fire key button flag as true
				// mouse click with fire key is fire weapon
				controls.bFireKey = false;
				break;
			case 88:
				// set secondary fire key button flag as true
				// mouse click with fire key is fire weapon
				controls.bSubKey = false;
				break;
			case 16: // shift key
				specialAction();
				break;
			default:
				return;
		}
	}
}


/********************************************************************
 *
 *		Functions to manage training level
 *
 *      
 *
 *
 *
 *********************************************************************/
// Main function to print guide message on ui layer stage
// it supposed to be invoked during level initialization process
function printMissionGuide(){
	var szGuide = "";
	if(guiControls.txtGuide == null)
	{
		guiControls.txtGuide = new createjs.Text(szGuide, "16px Arial Bold", "rgba(0, 0, 0, 0.9)");
		guiControls.txtGuide.x = 800;
		guiControls.txtGuide.y = 60;
		guiControls.txtGuide.textBaseline = "top";
	}
	
	switch(mission.nType){
		case enMission.nClear:
			szGuide = getMissionGuideText();
			break;
		case enMission.nSpying:
			szGuide = getMissionGuideText();
			guiControls.txtGuide.y = 90;
			break;
		case enMission.nBlow:
			szGuide = getMissionGuideText();
			break;
		case enMission.nAssassinate:
			szGuide = getMissionGuideText();
			break;
		
	}
	guiControls.txtGuide.text = szGuide;
	stages.stageUI.removeChild(guiControls.txtGuide);
	stages.stageUI.addChild(guiControls.txtGuide);
	
	guiControls.oTimer = setTimeout(guideChildOne, 10000);
}

// timer callback function to prompt game control guide
function guideChildOne(){
	guiControls.txtGuide.text = getUseGuideText();
	if(mission.nStatus == enStatus.nPlay)
		guiControls.oTimer = setTimeout(guideChildTwo, 10000);
}

// timer callback function to prompt mission guide
function guideChildTwo(){
	guiControls.txtGuide.text = getMissionGuideText();
	if(mission.nStatus == enStatus.nPlay)
		guiControls.oTimer = setTimeout(guideChildOne, 10000);
}

// return random guide text to give a help to user
function getUseGuideText(){
	var nRand = Math.ceil(Math.random() * 12);
	var szText = "";
	
	switch(nRand){
		case 1:
			szText = "Marine can fire weapon almost no delay.\nAnd can throw hand grenade";
			break;
		case 2:
			szText = "Sniper can shoot longer than other characters.\n";
			break;
		case 3:
			szText = "Spy can shoot silencer pistol with a little noise\nAnd can stabbing with dagger without noise.";
			break;
		case 4:
			szText = "Shift key on keyboard is special action key\n";
			szText = szText + "Marine can crawl, Sniper can hide, \nand Spy can change his clothes to enemies' one";
			break;
		case 5:
			szText = "When marine is crawling, he is invisible in vision range \nbut not in shooting range.\n";
			break;
		case 6:
			szText = "Sniper can hide on the ground. \nBut while sniper fire weapon, he became visible\n";
			szText = szText + "And if enemies are very close,\n they might recognize hidden sniper";
			break;
		case 7:
			szText = szText + "Spy can change his clothes to enemies'.\nTry this near enemy soldier or officer's dead body\n";
			szText = szText + "But officer can recognize spy's camouflage \nwithin shooting range.";
			break;
		case 8:
			szText = "Marine and Spy have secondary weapon\n";
			szText = szText + "Secondary weapon is range attack weapon\n";
			szText = szText + "So it will kill all the enemies within the range\n";
			break;
		case 9:
			szText = szText + "Grenade make huge noise. \nSo it will brings many backup troops\nand gather enemy to explosion area";
			break;
		case 10:
			szText = "Enemy's officer, sniper, and heavy gunner \ncan call backup\n";
			szText = szText + "if they find any evidence of invasion.";
			break;
		case 11:
			szText = "If you were revealed by officer, sniper or gunner,\nkill them as soon as possible.\n";
			szText = szText + "Before they ring the alert and request backup.";
			break;
		case 12:
			szText = "Heavy gunners are protected by bunker. \n";
			szText = szText + "To kill him with gun, shoot on higher location";
			break;
		
	}
	return szText;
}


// return guide message to solve the mission
function getMissionGuideText(){
	var szGuide;
	switch(mission.nType){
		case enMission.nClear:
			szGuide = "Simply kill all the enemies in this map";
			break;
		case enMission.nSpying:
			if(mission.oTarget.bObtain){
				szGuide = "Okay, you've got confidential now.\n";
				szGuide = szGuide + "Just goes back to the starting point.";
			}
			else
			{
				szGuide = "Get enemy's confidential document.\nLooks like rolled paper\nIt is on the east side of the map.\n";
				szGuide = szGuide + "Remember, only spy can obtain it and bring it to us.";

			}
			break;
		case enMission.nBlow:
			szGuide = "Explode our target on the east side\n";
			szGuide = szGuide + "which is red fluttering flag \n";
			szGuide = szGuide + "Remember, only marine can do this with grenade.";
			break;
		case enMission.nAssassinate:
			szGuide = "Kill enemy's general.\nHe is on the far east side of the map.\n";
			szGuide = szGuide + "Unlike others, he's staying & phone calling.\n"
			szGuide = szGuide + "As wired fence block approaching him,\n only sniper can shot him.";
			break;
		
	}
	return szGuide;
}





/*
// testing: wasd key control to move map
*/
function moveLeft()
{
	moveMap(-20, 0);
	/*
	if(controls.bRight){
		return;
	}else if(controls.bLeft == false){
		controls.bLeft = true;
		if(controls.bStand)
			sprite.gotoAndPlay("run");
		else
			sprite.gotoAndPlay("crawl");
	}
	*/
}

function moveRight()
{
	moveMap(20, 0);
	/*
	if(controls.bLeft){
		return;
	}else if(controls.bRight == false){
		controls.bRight = true;
		if(controls.bStand)
			sprite.gotoAndPlay("run");
		else
			sprite.gotoAndPlay("crawl");
	}
	*/
}

function moveUp()
{
	moveMap(0, -20);
	/*
	if(controls.bDown){
		return;
	}else if(controls.bUp == false){
		controls.bUp = true;
		if(controls.bStand)
			sprite.gotoAndPlay("run");
		else
			sprite.gotoAndPlay("crawl");
	}
	*/
}

function moveDown()
{
	moveMap(0, 20);
	/*
	if(controls.bUp){
		return;
	}else if(controls.bDown == false){
		controls.bDown = true;
		if(controls.bStand)
			sprite.gotoAndPlay("run");
		else
			sprite.gotoAndPlay("crawl");
	}
	*/
}





