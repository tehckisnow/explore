
//global game object: html div element
let game;
//these settings should be changed by passing an object to settings.settings from in the game file
let settings = {
  //various operations report to console and interactions are highlighted
  debug: false,
  //game dimensions: (include pixels for now.  This will likely be changed to just
  //numbers in the future so engine dictates unit, and can also be responsive)
  gameSize: {x: "480px", y: "300px"},
  //display this image after load
  startScreen: "url(0.png)",
  //if assets are located in an alt directory.
  assetDirectory: "",
  uiDirectory: "ui/",
  //window title
  defaultWindowTitle: "Explore",
  title: "Explore",
  //unit of measurement to use (px for now, may switch to vh)
  unit: "px",
  //UI color
  uiColor: "rgba(200,200,200,0.8)",
  //set fonts
  font: "'Oswald', sans-serif",
  //enter googleapi font reference address here
  fontRef: "Oswald",
  //adjust settings using this method
  settings: function(settingsObject){
    for(i in settingsObject){
      settings[i] = settingsObject[i];
    }
  },
};

let engine = {
  gameMode: "start",
  load: function(){
    //add keyboard trigger to start game
    document.body.setAttribute("onkeydown", "engine.pressKey(event)");
    //remove loading notification
    document.getElementById("loading").innerHTML = "";
    //create game element
    game = document.createElement("div");
    game.setAttribute("id", "game");
    document.body.appendChild(game);
    game.style = "margin: auto; border: 4px solid black; position: relative";
    game.style.backgroundImage = settings.startScreen;
    game.style.width = settings.gameSize.x;
    game.style.height = settings.gameSize.y;
    game.style.backgroundSize = settings.gameSize.x + " " + settings.gameSize.y;
    //add mouse trigger to start game
    game.addEventListener("click", engine.start);
    //set up window title
    let title = document.createElement("title");
    title.setAttribute("id", "title");
    document.head.appendChild(title);
    title.text = settings.title || settings.defaultWindowTitle;
    //build interactions layer to hold interactions
    let interactions = document.createElement("div");
    interactions.setAttribute("id", "interactions");
    interactions.style = "position: relative; height: inherit; width: inherit; ";
    game.appendChild(interactions);
    //get font
    let font = document.createElement("link");
    font.setAttribute("href", "https://fonts.googleapis.com/css?family=" + settings.fontRef);
    document.head.appendChild(font);
  },
  //build navigation interface
  buildNav: function(){
    let nav = document.createElement("div");
    nav.setAttribute("id", "nav");
    let left = document.createElement("div");
    left.setAttribute("id", "left");
    let right = document.createElement("div");
    right.setAttribute("id", "right");
    let forward = document.createElement("div");
    forward.setAttribute("id", "forward");
    nav.appendChild(left);
    nav.appendChild(forward);
    nav.appendChild(right);
    nav.style = "display: flex; flex-direction: row; height: inherit; ";
    forward.style = "flex: 1; height: inherit; ";
    forward.addEventListener("click", engine.move.goForward);
    left.style = "flex: 0.1; height: inherit; ";
    left.addEventListener("click", engine.move.turnL);
    left.style.cursor = "url(" + settings.uiDirectory + "leftarrow.png), auto";
    right.style = "flex: 0.1; height: inherit; ";
    right.addEventListener("click", engine.move.turnR);
    right.style.cursor = "url(" + settings.uiDirectory + "rightarrow.png), auto";
    if(settings.debug){
      left.style.backgroundColor = "rgba(0,0,100,0.7)";
      right.style.backgroundColor = "rgba(0,0,100,0.7)";
    }
    game.appendChild(nav);
  },
  //build inventory interface
  buildInv: function(){
    let inv = document.createElement("div");
    inv.setAttribute("id", "inv");
    inv.style.zIndex = "10";
    inv.style = "position: absolute; left: 0; right: 0; width: 80%; margin: auto; height: 40px; display: flex; flex-direction: row; ";
    inv.style.top = "260px";//CHANGE THIS!  settings.gameSize.y;
    inv.onmouseover = function(){engine.showInv()};
    inv.onmouseout = function(){engine.hideInv()};
    inv.style.cursor = "url(" + settings.uiDirectory + "point.png), auto";
    game.appendChild(inv);
  },
  //pass "true" if you want it to return the index, otherwise it will return the object
  getRoom: function(index){
    if(index){
      return map.findIndex(function(e){return e.id === player.room});
    }else{
      return map.find(function(e){return e.id === player.room});
    }
  },
  //pass "true" if you want it to return the index, otherwise it will return the object
  getDirection: function(index){
    if(index){
      return engine.getRoom().directions.findIndex(function(e){return e.dir === player.facing});
    }else{
      return engine.getRoom().directions.find(function(e){return e.dir === player.facing});
    }
  },
  getInvItem: function(id){ //might remove this
    return player.inv.find(function(e){return e.id === id});
  },
  //update and display inventory (called on mouseover)
  showInv: function(){
    let inv = document.getElementById("inv");
    inv.style.backgroundColor = settings.uiColor;
    for(i in player.inv){
      let newItem = document.createElement("div");
      newItem.style.width = player.inv[i].width + settings.unit;
      newItem.style.height = player.inv[i].height + settings.unit;
      newItem.style.backgroundImage = "url(" + settings.assetDirectory + player.inv[i].img + ")" || "";
      newItem.style.backgroundSize = player.inv[i].width + "px " + player.inv[i].height + "px";
      newItem.addEventListener("click", player.inv[i].inventoryEffect);
      newItem.style.cursor = "url(" + settings.uiDirectory + "select.png), auto";
      newItem.style.zIndex = "15";
      inv.appendChild(newItem);
    }
  },
  //called onmouseouth
  hideInv: function(){
    let inv = document.getElementById("inv");
    inv.style.backgroundColor = "transparent";
    while (inv.hasChildNodes()) {  
      inv.removeChild(inv.firstChild);
    } 
  },
  pressKey(event){
    switch(engine.gameMode){
      case "start":
        engine.start();
        break;
      case "explore":
        if(event.key === "ArrowLeft" || event.key === "a"){
          engine.move.turnL();
        }else if(event.key === "ArrowRight" || event.key === "d"){
          engine.move.turnR();
        }else if(event.key === "ArrowUp" || event.key === "w"){
          engine.move.goForward();
        }
        break;
    }
  },
  start: function(){
    engine.buildNav();
    engine.buildInv();
    engine.gameMode = "explore";
    game.removeEventListener("click", engine.start);
    init();
    engine.updateView();
  },
  move: {
    turnL: function(){
      let directionIndex = engine.getDirection(true) - 1;
      if(directionIndex < 0){
        directionIndex = engine.getRoom().directions.length - 1;
      }
      player.facing = engine.getRoom().directions[directionIndex].dir;
      engine.updateView();
    },
    turnR: function(){
      let directionIndex = engine.getDirection(true) + 1;
      if(directionIndex > engine.getRoom().directions.length - 1){
        directionIndex = 0;
      }
      player.facing = engine.getRoom().directions[directionIndex].dir;
      engine.updateView();
    },
    goForward: function(){
      let direction = engine.getDirection();
      if(direction.forwardDestination){
        //move to next room
        player.room = direction.forwardDestination;
        if(direction.forwardFacing){
          player.facing = direction.forwardFacing;
        }
      }
      engine.updateView();
    },
  },
  //update view
  updateView: function(){
    engine.wipeInteractions();
    game.style.backgroundImage = "url(" + settings.assetDirectory + engine.getDirection().img + ")";
    engine.showInteractions();
    //forward cursor
    if(engine.getDirection().forwardDestination){
      document.getElementById("forward").style.cursor = "url(" + settings.uiDirectory + "uparrow.png), auto";
    }else{
      document.getElementById("forward").style.cursor = "url(" + settings.uiDirectory + "point.png), auto";
    }
  },
  showInteractions: function(){
    //rebuild interactions layer
    let interactions = document.createElement("div");
    interactions.setAttribute("id", "interactions");
    game.appendChild(interactions);
    //iterate interactions in current room
    let currentInteractions = engine.getDirection().interactions;
    for(i in currentInteractions){
      let newInteraction = document.createElement("div");
      newInteraction.style = "position: absolute; ";
      interactions.appendChild(newInteraction);
      newInteraction.style.left = currentInteractions[i].x + settings.unit;
      newInteraction.style.top = currentInteractions[i].y + settings.unit;
      newInteraction.style.width = currentInteractions[i].width + settings.unit;
      newInteraction.style.height = currentInteractions[i].height + settings.unit;
      newInteraction.style.backgroundImage = "url(" + settings.assetDirectory + currentInteractions[i].img + ")" || "";
      //set background image dimensions
      newInteraction.style.backgroundSize = currentInteractions[i].width + settings.unit + " " + currentInteractions[i].height + settings.unit;
      newInteraction.addEventListener("click", currentInteractions[i].effect);
      newInteraction.style.cursor = "url(" + settings.uiDirectory + "select.png), auto";
      //highlight interactions
      if(settings.debug){newInteraction.style.backgroundColor = "rgba(100, 0, 0, 0.5)"};
      newInteraction.style.zIndex = "5";
      currentInteractions[i].node = newInteraction; //do I need this?
    }
  },
  wipeInteractions: function(){
    game.removeChild(document.getElementById("interactions"));
  },
};

//this object holds the interaction functions that are referenced in the game file
let int = {
  //set current room
  changeRoom: function(room, facing){
    player.room = room;
    if(facing){player.facing = facing;};
    engine.updateView();
  },

  //modify map and set image
  setImg: function(room, direction, img){
    let roomIndex = map.findIndex(function(e){return e.id === room});
    let viewIndex = map[roomIndex].directions.findIndex(function(e){return e.dir === direction});
    let view = map[roomIndex].directions[viewIndex];
    view.img = img;
    engine.updateView();
  },

  //add item to inventory
  getItem: function(id){
    let roomIndex = map.findIndex(function(e){return e.id === player.room});
    let viewIndex = map[roomIndex].directions.findIndex(function(e){return e.dir === player.facing});
    let view = map[roomIndex].directions[viewIndex];
    let item = view.interactions.find(function(e){return e.id === id});
    let itemIndex = view.interactions.findIndex(function(e){return e.id === id});
    item.width = 40;
    item.height = 40;
    //item.effect = function(){useItem(id)};
    player.inv.push(item);
    //remove item from room
    let interactions = document.getElementById("interactions");
    interactions.removeChild(item.node);
    view.interactions.splice(itemIndex, 1);
  },

  //when clicking on an item in inventory;
  useItem: function(id){
    console.log(id);
    return id;
  },

  //show closeup
  showCloseup: function(image, interactions){
    let back = document.createElement("div");
    back.setAttribute("id", "back");
    back.style.zIndex = "30";
    //back.addEventListener("click", goBack);
    back.style = "display: flex; flex-direction: row; position: absolute; top: 0; height: inherit; width: inherit; background-color: rgba(300, 300, 300, 0.5); ";
    game.appendChild(back);

    let closeup = document.createElement("div");
    closeup.setAttribute("id", "closeup");
    closeup.style.zIndex = "35";
    closeup.style.flex = "1";
    closeup.style.backgroundImage = "url(" + settings.assetDirectory + image + ")";
    closeup.style.cursor = "url(" + settings.uiDirectory + "point.png), auto";

    let size = settings.gameSize.x + " " + settings.gameSize.y;
    closeup.style.backgroundSize = size;

    let leftBack = document.createElement("div");
    back.appendChild(leftBack);
    let vert = document.createElement("div");
    back.appendChild(vert);
    vert.style = "display: flex; flex-direction: column; flex: 1; ";
    let topBack = document.createElement("div");
    let bottomBack = document.createElement("div");
    vert.appendChild(topBack);
    vert.appendChild(closeup);
    vert.appendChild(bottomBack);
    let rightBack = document.createElement("div");
    back.appendChild(rightBack);
    topBack.style.height = "5%";
    topBack.style.cursor = "url(" + settings.uiDirectory + "back.png), auto";
    bottomBack.style.height = "5%";
    bottomBack.style.cursor = "url(" + settings.uiDirectory + "back.png), auto";
    leftBack.style.width = "5%";
    leftBack.style.cursor = "url(" + settings.uiDirectory + "back.png), auto";
    rightBack.style.width = "5%";
    rightBack.style.cursor = "url(" + settings.uiDirectory + "back.png), auto";

    leftBack.addEventListener("click", int.goBack);
    rightBack.addEventListener("click", int.goBack);
    topBack.addEventListener("click", int.goBack);
    bottomBack.addEventListener("click", int.goBack);

    //engine.wipeInteractions();
    //additional interactions?  (use higher zIndex here!)
  },
  //!This should ONLY ever be called by int.showCloseUp();
  goBack: function(){
    let back = document.getElementById("back");
    back.parentNode.removeChild(back);
    engine.updateView();
  },

  addInteraction: function(room, direction, interaction){},
  removeInteraction: function(room, direction, interaction){},
  
  //display a text message on the screen
  displayMessage: function(message){
    let messageElement = document.createElement("div");
    messageElement.setAttribute("id", "messageElement");
    game.appendChild(messageElement);
    messageElement.style = "position: relative; margin: auto; bottom: 50%; text-align: center; padding: 30px; border: 2px solid white; background-color: rgb(48, 62, 128); color: white; z-index: 30";
    let text = document.createElement("p");
    messageElement.appendChild(text);
    text.appendChild(document.createTextNode(message));
    text.style.fontFamily = settings.font;
    messageElement.addEventListener("click", function(){game.removeChild(messageElement)});
    messageElement.style.cursor = "url(" + settings.uiDirectory + "back.png), auto";
  },

  setVariable: function(variableLocation, value){},
  toggleSwitch: function(toggleSwitch, state){},
  //if player is carring item with id "id", call callback method.  Otherwise, call altCallback
  checkItem: function(id, callback, altCallback){
    let found = false;
    for(i in player.inv){
      if(player.inv[i].id === id){
        found = true;
      }
    }
    if(found){
      callback();
    }else{
      altCallback();
    }
  }, //if you have x, do y

  //play/stop music()
  audio: {
    musicCurrentlyPlaying: [],
    //create audio asset
    new: function(file){
      let newAudio = document.createElement("audio");
      newAudio.setAttribute("src", file);
      return newAudio;
    },
    music: async function(track, loop, stop){
      //let track = track.toLowerCase();
      if((track === "stopall" || track === "stop all") && audio.musicCurrentlyPlaying.length > 0){
        for(i in audio.musicCurrentlyPlaying){
          audio.music(audio.musicCurrentlyPlaying[i], false, true);
        }
      }else if(stop){
        track.pause()
        audio.musicCurrentlyPlaying.splice(audio.musicCurrentlyPlaying.indexOf(track), 1);
      }else{
        try {
          track.load(); //this causes track to start over instead of resume from pause if called again
          await track.play();
          audio.musicCurrentlyPlaying.push(track);
        } catch(err) {
          console.log("error: " + err);
        }
        if(loop) track.loop = true;
      }
    },

    //play a sound effect
    sfx: async function(sound){
      try {
        await sound.play();
      } catch(err) {
        console.log("error: " + err);
      }
    }
  },

};