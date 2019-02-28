
settings.settings({
  //gameSize: {x: "1000px", y: "600px"},
  //gameMode: "start",
  startScreen: "url(0.png)",
  assetDirectory: "testgame/assets/",
  title: "Test Game!",
});

function takeCube(id){
  int.displayMessage("Nice cube, bro!");
  int.removeItem(id);
};

let variablesObject = {
  variableTest: "one",
};

let firstSwitch;

function init(){
  let music = int.audio.new("testgame/audio/tim-kahn-cedellia.wav");
  int.audio.music(music, true);

  firstSwitch = int.switch.createSwitch(
    "off", function(){int.removeInteraction("i398476")},
    "on", function(){int.addInteraction({id: "i398476", type: "inventory", img: "cube.png", x: 250, y: 173, width: 30, height: 30, effect: function(){int.getItem("i398476")}, inventoryEffect: function(){int.displayMessage("You got it, boss!")}})}
    );
};

let player = {
  room: 1,
  facing: "n",
  inv: [],
};

let map = [
  {id: 0,
    directions: [],
  },
  {id: 1,
    directions: [
      //these should always be listed in clockwise order, starting with north(or closest to north)
      {dir: "n", img: "1n.png", interactions: [], forwardDestination: 2, forwardFacing: "n"},
			{dir: "e", img: "1e.png", interactions: [
        {id: "i111175", type: "switch", img: "cube.png", x: 100, y: 100, width: 20, height: 20, effect: function(){int.removeInteraction("i017", 1, "w")} },
        {img: "des.png", x: 208, y: 100, width: 65, height: 50, effect: function(){int.addInteraction(
          {id: "i0076", type: "inventory", img: "cube.png", x: 250, y: 173, width: 30, height: 30, effect: function(){int.getItem("i0076")}, inventoryEffect: function(){int.displayMessage("This cube looks nothing like the other one.")} }
          )}},
      ]},
			{dir: "s", img: "1s.png", interactions: []},
			{dir: "w", img: "1w.png", interactions: [
        {id: "i017", type: "closeup", img: "des.png", x: 208, y: 100, width: 65, height: 50, effect: function(){int.showCloseup("des.png")}},
      ]},
    ],
  },
  {id: 2,
    directions: [
      {dir: "n", img: "2n.png", interactions: [
        {id: "i93483942", type: "switch", img: "des.png", x: 308, y: 100, width: 65, height: 50, effect: function(){int.toggleSwitch(firstSwitch)}},
      ], forwardDestination: 6, forwardFacing: "n"},
			{dir: "e", img: "2e.png", interactions: [], forwardDestination: 5},
			{dir: "s", img: "2s.png", interactions: [], forwardDestination: 1, forwardFacing: "s"},
			{dir: "w", img: "2w.png", interactions: [], forwardDestination: 3},
    ],
  },
  {id: 3,
    directions: [
      {dir: "n", img: "3n.png", interactions: [
        {id: "i003", type: "exit", img: "", x: 200, y: 80, width: 75, height: 170, effect: function(){int.changeRoom(4)}},
        {id: "i004", type: "whoknows", img: "cube.png", x: 30, y: 30, width: 30, height: 30, effect: function(){int.setImg(3, "n", "2n.png")}},
      ]},
			{dir: "e", img: "3e.png", interactions: [], forwardDestination: 2},
			{dir: "s", img: "3s.png", interactions: []},
			{dir: "w", img: "3w.png", interactions: []},
    ],
  },
  {id: 4,
    directions: [
      {dir: "n", img: "4n.png", interactions: [
        {id: "i034398", type: "varCheck", img: "cube.png", x: 200, y: 80, width: 75, height: 170, effect: function(){int.checkVariable(
          variablesObject.variableTest, 
          "one", function(){int.setVariable(variablesObject, "variableTest", "two")}, 
          "two", function(){int.showCloseup("des.png")} )}},
      ]},
			{dir: "e", img: "4e.png", interactions: []},
			{dir: "s", img: "4s.png", interactions: [], forwardDestination: 3, forwardFacing: "s"},
			{dir: "w", img: "4w.png", interactions: []},
    ],
  },
  {id: 5,
    directions: [
      {dir: "n", img: "5n.png", interactions: []},
			{dir: "e", img: "5e.png", interactions: [
        {id: "30938", type: "check", img: "cube.png", x: 200, y: 173, width: 30, height: 30, effect: function(){int.checkItem("i006", function(){takeCube("i006")}, function(){int.displayMessage("You are not carrying any cubes.")})} },
      ]},
			{dir: "s", img: "5s.png", interactions: []},
			{dir: "w", img: "5w.png", interactions: [], forwardDestination: 2},
    ],
  },
  {id: 6,
    directions: [
      {dir: "n", img: "6n.png", interactions: [
        {id: "i006", type: "inventory", img: "cube.png", x: 200, y: 173, width: 30, height: 30, effect: function(){int.getItem("i006")}, inventoryEffect: function(){int.displayMessage("This cube looks exactly like the other one.")} },
        {id: "i007", type: "inventory", img: "cube.png", x: 250, y: 173, width: 30, height: 30, effect: function(){int.getItem("i007")}, inventoryEffect: function(){int.displayMessage("This cube looks nothing like the other one.")} },
      ]},
			{dir: "e", img: "6e.png", interactions: []},
			{dir: "s", img: "6s.png", interactions: [], forwardDestination: 2, forwardFacing: "s"},
			{dir: "w", img: "6w.png", interactions: []},
    ],
  },
];
