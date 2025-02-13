// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;

let template = {
	"name": ["Cheri","Fox","Morgana","Jedoo","Brick","Shadow","Krox","Urga","Zelph"]
,	"story": ["#hero.capitalize# was a great #occupation#, and this song tells of #heroTheir# adventure. #hero.capitalize# #didStuff#, then #heroThey# #didStuff#, then #heroThey# went home to read a book."]
,	"monster": ["dragon","ogre","witch","wizard","goblin","golem","giant","sphinx","warlord"]
,	"setPronouns": ["[heroThey:they][heroThem:them][heroTheir:their][heroTheirs:theirs]","[heroThey:she][heroThem:her][heroTheir:her][heroTheirs:hers]","[heroThey:he][heroThem:him][heroTheir:his][heroTheirs:his]"]
,	"setOccupation": ["[occupation:baker][didStuff:baked bread,decorated cupcakes,folded dough,made croissants,iced a cake]","[occupation:warrior][didStuff:fought #monster.a#,saved a village from #monster.a#,battled #monster.a#,defeated #monster.a#]"]
,	"origin": ["#[#setPronouns#][#setOccupation#][hero:#name#]story#"]

}

let grammar = {
    "story": [`There once was #heroAdjective.a# #heroNoun# from #place#\n
                Whose #relation# #threat# to #ruin# #heroTheir# #placeRhyme1#\n
                But #heroThey# #seized# the #noun#\n
                And said "#relation# you can #ruin# my #nounRhyme#\n
                You #insult#, #insult# #excuse# of #placeRhyme2.a#"`,
                
            ]
,	"setPronouns": ["[heroThey:they][heroThem:them][heroTheir:their][heroTheirs:theirs][heroNoun:person]",
                    "[heroThey:she][heroThem:her][heroTheir:her][heroTheirs:hers][heroNoun:woman]",
                    "[heroThey:he][heroThem:him][heroTheir:his][heroTheirs:his][heroNoun:man]"]
,	"origin": ["#[#setPronouns#][relation:#relative#]story#"]
,   "heroAdjective": ["young", "old", "brave", "kind", "sly", "bold", "fierce", "noble"]
,   "relative": ["mom", "dad", "sister", "brother", "aunt", "uncle", "cousin", "grandma", "grandpa"]
,   "threat": ["dared", "threatened", "jepordized", "vowed", "swore", "promised", "pledged", "declared", "proclaimed", "announced"]
,   "ruin": ["grab", "steal", "burn", "destroy", "ruin", "smash", "crush", "shatter", "break", "wreck"]
,   "seized": ["seized", "grabbed", "snatched", "ran off with"]
,   "insult": ["mean", "cruel", "vile", "evil", "nasty", "horrid", "vicious", "spiteful", "weak", "crude"]
,   "excuse": ["excuse", "disgrace", "joke", "mockery", "insult", "disappointment", "embarrassment"]
}

// Asked chatgpt for a list of places
let places = [
    "Paris",
    "Sofia",
    "France",
    "Nepal",
    "Rome",
    "Prague",
    "Bordeaux",
    "Berlin",
    "Lima",
    "Seattle",
    "Tucson",
    "Vienna",
    "Dallas",
    "Atlanta",
    "Cyrus",
    "Dallas",
    "China",
    "Madrid",
    "Lima",
    "Japan",
    "Peru",
    "Greece",
    "Spain",
    "Chile",
    "Rhodes",
    "Norway",
    "Dubai",
    "Quebec",
    "Nairobi",
    "Beijing",
    "Fargo",
    "Manila",
    "Madrid",
    "Brazil",
]

let easyNouns = [
    "cat",
    "bat",
    "hat",
    "mat",
    "rat",
    "dog",
    "log",
    "frog",
    "ball",
    "hall",
    "mall",
    "call",
    "wall",
    "tree",
    "bee",
    "sea",
    "key",
    "sky",
    "eye",
    "home",
    "comb",
    "stone",
    "phone",
    "car",
    "star",
    "bar",
    "jar",
    "rain",
    "pain",
    "gain",
    "brain",
    "moon",
    "soon",
    "room",
    "tune",
    "day",
    "play",
    "way",
    "say",
    "lay",
    "floor",
    "door",
    "more",
    "roar",
    "light",
    "night",
    "fight",
    "kite",
    "time",
    "rhyme",
    "lime",
    "mine",
    "sound",
    "ground",
    "round",
    "town",
    "cloud",
    "blood"
]

let placeData = [];
let nounData = [];
function getRhymes(place, noun) {
    let placeURL = "https://api.datamuse.com/words?rel_rhy=" + place +"&md=p&max=20&topics=" + place + "," + noun;
    let nounURL = "https://api.datamuse.com/words?rel_rhy=" + noun +"&md=p&max=20&topics=" + place + "," + noun;
    try {
        fetch(placeURL)
            .then(response => response.json())
            .then(data => {
                placeData = data;
            });
    }catch(e) {
        console.error(e);
    }

    try {
        fetch(nounURL)
            .then(response => response.json())
            .then(data => {
                nounData = data;
            });
    }catch(e) {
        console.error(e);
    }

    // Wait for the data to be fetched
    setTimeout(() => {
        writeLimerick(placeData, nounData);
    }, 1000);
}

let limerickContainer;
// setup() function is called once when the program starts
function setup() {
    let place = places[Math.floor(Math.random() * places.length)];
    let noun = easyNouns[Math.floor(Math.random() * easyNouns.length)];
    grammar["place"] = place;
    grammar["noun"] = noun;
    getRhymes(place, noun);
}

function writeLimerick(placeRhymes, nounRhymes) {
    let placeRhymeList = [];
    let placeWeight = 0;
    let nounRhymeList = [];
    let nounWeight = 0;
    for(let i = 0; i < placeRhymes.length; i++) {
        if(placeRhymes[i].numSyllables <= 3 && placeRhymes[i].score > 100 && placeRhymes[i].tags !== undefined && placeRhymes[i].tags.includes("n")) {
            placeWeight += placeRhymes[i].score;
            placeRhymeList.push([placeRhymes[i].word, placeWeight])
        }
    }

    for(let i = 0; i < nounRhymes.length; i++) {
        if(nounRhymes[i].numSyllables <= 3 && nounRhymes[i].score > 100 && nounRhymes[i].tags !== undefined && nounRhymes[i].tags.includes("n")) {
            nounWeight += nounRhymes[i].score;
            nounRhymeList.push(nounRhymes[i].word)
        }
    }

    let placeIndex1 = Math.floor(Math.random() * placeWeight);
    let place1Set = false;
    let placeIndex2 = Math.floor(Math.random() * placeWeight);
    let place2Set = false;
    let nounIndex = Math.floor(Math.random() * nounWeight);
    for(let i = 0; i < placeRhymeList.length; i++) {
        if(placeIndex1 < placeRhymeList[i][1] && !place1Set) {
            place1Set = true;
            grammar["placeRhyme1"] = placeRhymeList[i][0];
        }
        if(placeIndex2 < placeRhymeList[i][1] && !place2Set) {
            place2Set = true;
            grammar["placeRhyme2"] = placeRhymeList[i][0];
        }
    }
    for(let i = 0; i < nounRhymeList.length; i++) {
        if(nounIndex < nounWeight) {
            grammar["nounRhyme"] = nounRhymeList[i];
        }
    }
    let t = tracery.createGrammar(grammar);
    let limerick = t.flatten("#origin#").split("\n");
    document.getElementById("line1").textContent = limerick[0];
    document.getElementById("line2").textContent = limerick[2];
    document.getElementById("line3").textContent = limerick[4];
    document.getElementById("line4").textContent = limerick[6];
    document.getElementById("line5").textContent = limerick[8];
}

setup();