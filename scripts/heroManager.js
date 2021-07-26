// Rotation de la mouche.
// coords = coordonnées du héros (mouche).
// size = dimensions du héros.
// propriété .pageX et .pageY de l’objet évènement e renvoi la position horizontale et la position verticale du curseur de la souris
function rotateDiv(e) 
{ 
    let coords; 
    let size 
    let polar 
    coords = $('.hero').offset(); 
    size = {width: $('.hero').width(), height: $('.hero').height()}; 
    polar = cartesianToPolar(e.pageX, e.pageY, coords.left + (size.width / 2), coords.top + (size.height / 2)); 
    $('.hero').css (
        'transform', 
        'rotate(' + polar.angle + 'deg)'
        ); 
}

// gameArea = aire de jeux
// shooter = mouche
// offsets = position aire de jeux
// center = centre du jeux (où est la mouche)
// vector = coordonnées polaires permettant d'atteindre la cible (c’est-à-dire l’angle et la distance entre le centre de la mouche et le point cliqué)
// target = resultat de la fonction polarToCartesian
// orientation = récupère les coordonnées left et top 
function shoot(e) 
{
    let gameArea; 
    let shooter; 
    let offsets; 
    let center; 
    let vector; 
    let target; 
    let orientation;

    gameArea = $('.gameArea'); 
    shooter = $('.hero'); 
    offsets = {left: gameArea.offset().left, top: gameArea.offset().top}; 
    center = {
        left: shooter.offset().left - offsets.left + (shooter.width() / 2),
        top: shooter.offset().top - offsets.top + (shooter.height() / 2)
    }; 
    vector = cartesianToPolar(center.left, center.top, e.pageX - offsets.left, e.pageY - offsets.top);
    target = polarToCartesian(2500, (vector.angle + 90) * Math.PI / 180); 
    orientation = {
        horizontal: (center.left + target.left) > center.left ? 1 : -1, vertical: (center.top + target.top) > center.top ? 1 : -1
    }; 
    $('<div class="bullet"></div>')
    .css (
        {
            left: center.left + "px",
            top: center.top + "px"
        }
    ) 
    .appendTo('.gameArea') 
    .animate (
        {
            left: (center.left + target.left) + "px", 
            top: (center.top + target.top) + "px"
        }, 
        { 
            duration: 1500, 
            easing: 'linear',
            // Animation fini on supprime les tirs
            complete: function ()
            {
                $('.gameArea').find(this).remove(); 
            }
        } 
    ); 
} 