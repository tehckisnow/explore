# explore


//TODO:
//transitions: move img right when turning left, etc.

//examine tool? (select examine and then click on something? or )

//why arn't fonts working?

clicking on inventory items in firefox works, but not in chrome

slideshow: like closeup but with an onclick that advances to next image

events: after updateView() check if current room has an event and if so, immediately start that script

//animations
  //gifs? other?
  inventory fade in or slide up instead of instantly appear

//ensure units is dictated by explore.js, not testgame.js
//choose units that will permit adjusting resolution without having to modify every interaction
//title screen music and scripts
//settings.title is not being updated
//document.getElementById("title").text = settings.title;
//make responsive

//interactions
  //-//add interaction
  //-//remove interaction
  //-//get item
  //-//remove item
  //-//item check (if you have item, do x)
  //use item (right now this just returns item id.  might change this)
  //-//display message
  //-//closeups/images
  //    (add support for interactions on top of closeups?)
  //-//set variable
  //-//check variable
  //-//toggle switch
  //book
  //  (similar to closup but with interactions for turning pages) 
  //door 
  //  (state: unlocked; 
  //      onclick: changeImage, removeInteraction, addInteraction, playsound;   
  //    state: locked; 
  //      onclick: playsound, 
  //      useKey: checkItem, removeitem(optional?), removeInteraction, addInteraction)
  //  consider using checkItem and displayMessage in here?

//example interactables:

//{id: "i006", type: "inventory", img: "cube.png", x: 200, y: 200, width: 30, height: 30, effect: function(){int.getItem("i006")}, inventoryEffect: function(){} },
//--------------------------------------------------------------------------

