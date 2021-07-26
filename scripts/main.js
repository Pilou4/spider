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


 
function init() 
{
    // empécher eventuel effet de bord (eviter le glisser-coller en cliquant avec la souris)
    $(document).attr('unselectable', 'on').css('user-select','none').css('MozUserSelect', 'none').on('selectstart', false);
    // sélectionner le bloc représentant l’aire de jeu et d’exécuter une fonction dédiée lorsque l’évènement de survol est déclenché.
    $('.gameArea').on('mousemove', rotateDiv);
    // écouteur au clic déclenche la fonction shoot
    $(document).on('click', shoot);

} 