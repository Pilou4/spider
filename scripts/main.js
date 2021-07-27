let gameIsOn = false;
// numéro de la vague
let currentWave = 0;
// enemie générer pas encore en jeu
let spiders = [];
// stocker les arraignées au fur et mesure de leur insertion
let inGameSpiders = [];
let inGameExtras = [];
let playerScore = 0; 
let currentLevel = 1;
let heroLives = 3;
let bestScores = {tenBests: [], lastFive: []}; 
let hits = 0;
let baseExtraChance;
let tirEventail = false; 
let tirFragment = false; 
let tirPerforant = false; 
let tirDeregle = false; 
let tirEnraye = false; 
let extraNames = ['Renforts ennemis', 'Dérèglement de la visée',
'Enrayement du tir', 'Projectiles perforants', 'Tir en éventail', 
'Tir à fragmentation', 'Vie supplémentaire'];
let canShoot = false;
let username = "AAA"; 

$(document).ready(init);

// Système de changement de coordonnées qui consiste, à partir des coordonnées x et y d’un point dans l’espace d’un plan cartésien, à obtenir un vecteur constitué d’une distance et d’un angle vers un autre point du plan.
// distance entre le point (X1, Y1) et le point (X2, Y2)
// angle que fait la droite passant par ces deux points dans un repère cartésien centré en (X1, Y1)
function cartesianToPolar (x1, y1, x2, y2) 
{ 
    let x = x2 - x1; 
    let y = y2 - y1; 
    return {
        distance : Math.sqrt((x * x) + (y * y)), 
        angle : -(Math.atan2(x, y) * 180 / Math.PI) 
    }; 
}

// Système de changement de coordonnées
// Donne la distance entre 2 points
function polarToCartesian (distance, angle) 
{ 
    return {
        left: distance * Math.cos(angle), 
        top: distance * Math.sin(angle) 
    }; 
} 

// Création suite de caractère permettant de créer des id
function guid() 
{
    let group = function (groupLength)
    {
        return String(' ')
        .repeat(groupLength) 
        .split('') 
        .map(e => crypto.getRandomValues(new Uint8Array(1))[0] % 16).map(e => e.toString(16).toUpperCase()).join('');
    };
    return group(8) + "-" + group(4) + "-" + group(4) + "-" + group(4) + "-" + group(12); 
} 

function startGame(e) 
{ 
    $('.mainMenu').css ("display", "none"); 
    $('.spider,.bullet,.extra').remove(); 
    gameIsOn = true; 
    currentWave = 0; 
    spiders = []; 
    inGameSpiders = []; 
    inGameExtras = []; 
    playerScore = 0; 
    heroLives = 2; 
    hits = 0; 
    tirEventail = false; 
    tirFragment = false; 
    tirPerforant = false; 
    tirDeregle = false; 
    tirEnraye = false; 
    canShoot = false; 
    e.stopPropagation(); 
    updateScore(); 
    newWave(); 
}

function showMainMenu() 
{ 
    userName = $('.userName').val(); 
    updateScore(); 
    saveScores(); 
    $('.gameOverZone').addClass ("gameNotOver"); 
    $('.mainMenu').css ("display", "initial"); 
} 
 
function init() 
{
    // empécher eventuel effet de bord (eviter le glisser-coller en cliquant avec la souris)
    $(document).attr('unselectable', 'on').css('user-select','none').css('MozUserSelect', 'none').on('selectstart', false);
    // sélectionner le bloc représentant l’aire de jeu et d’exécuter une fonction dédiée lorsque l’évènement de survol est déclenché.
    $('.gameArea').on('mousemove', rotateDiv);
    // écouteur au clic déclenche la fonction shoot
    $(document).on('click', shoot);
    $('.startGame').on('click', startGame);
    $('.applyButton').on('click', showMainMenu); 
    // createWave();
    // renderWave();
    // newWave();
} 
