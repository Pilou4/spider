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
            progress: function (animation, progression, timeLeft)
            {
                checkImpact({htmlElement: $(animation.elem),orientation: orientation}); 
            },
            // Animation fini on supprime les tirs
            complete: function ()
            {
                $('.gameArea').find(this).remove(); 
            }
        } 
    ); 
}

function checkImpact(bullet) 
{
    let touchedSpiders = inGameSpiders.filter(
    function (e)
    {
        let bulletCoords = bullet.htmlElement.offset(); 
        let spiderCoords = e.htmlElement.offset(); 
        if (bullet.orientation.horizontal == 1 && bullet.orientation.vertical == 1)
        {
            if (bulletCoords.left + bullet.htmlElement.width() >= spiderCoords.left &&
            bulletCoords.left <= spiderCoords.left + (e.htmlElement.width() * e.PV) &&
            bulletCoords.top + bullet.htmlElement.height() >= spiderCoords.top &&
            bulletCoords.top <= spiderCoords.top + (e.htmlElement.height() * e.PV))
            {
                return true;
            }
        }
        if (bullet.orientation.horizontal == -1 && bullet.orientation.vertical == 1)
        {
            if (bulletCoords.left >= spiderCoords.left && bulletCoords.left + 
                bullet.htmlElement.width() <= spiderCoords.left + (e.htmlElement.width() * e.PV) && 
                bulletCoords.top + bullet.htmlElement.height() >= spiderCoords.top && 
                bulletCoords.top <= spiderCoords.top + (e.htmlElement.height() * e.PV))
            {
                return true;
            }
        }
        if (bullet.orientation.horizontal == 1 && bullet.orientation.vertical == -1)
        {
            if (bulletCoords.left + bullet.htmlElement.width() >= spiderCoords.left && 
                bulletCoords.left <= spiderCoords.left + (e.htmlElement.width() * e.PV) &&
                bulletCoords.top <= spiderCoords.top + (e.htmlElement.height() * e.PV) &&
                bulletCoords.top + bullet.htmlElement.height() >= spiderCoords.top)
            {
                return true;
            }
        }
        if (bullet.orientation.horizontal == -1 && bullet.orientation.vertical == -1)
        {
            if (bulletCoords.left <= spiderCoords.left + (e.htmlElement.width() * e.PV) && 
                bulletCoords.left + bullet.htmlElement.width() >= spiderCoords.left && 
                bulletCoords.top <= spiderCoords.top + (e.htmlElement.height() * e.PV) && 
                bulletCoords.top + bullet.htmlElement.height() >= spiderCoords.top)
            {
                return true;
            }
        }
        return false;
    });
    if (touchedSpiders.length > 0)
    {
        touchedSpiders.forEach(
            function (e)
            {
                let position = e.htmlElement.offset(); 
                let size = {width: e.htmlElement.width() * e.PV, height: e.htmlElement.height() * e.PV}; 
                let decalage = $('.gameArea').offset(); 
                let no = guid();
                e.life--; 
                bullet.htmlElement.remove(); 
                if (e.life <= 0)
                {
                    // inGameSpiders.slice(inGameSpiders.indexOf(e), 1);
                    // e.htmlElement.remove();
                    hits++;
                    inGameSpiders.splice(inGameSpiders.indexOf(e), 1); 
                    e.htmlElement.remove();
                    $('.gameArea').append('<img class="explosion"src="images/smoke1.png" data-id="' + no + '">');
                    $('.explosion[data-id="' + no + '"]').css (
                        {
                            left: (position.left - decalage.left) + (size.width / 2) + 'px', 
                            top: (position.top - decalage.top) + (size.height / 2 ) + 'px',
                            transform: 'scale(' + e.PV + ')'
                        }
                    );
                    $('.explosion[data-id="' + no + '"]').animate (
                        {
                            opacity: .5 
                        },
                        {
                            duration: 600, 
                            easing: 'linear', 
                            progress: function (animation,progression, timeLeft)
                            {
                                let index =+ $(this).attr('src').substr(-5, 1);
                                 if ((timeLeft < 500 && index ==  1) || 
                                    (timeLeft < 400 && index == 2) || 
                                    (timeLeft < 300 && index == 3) ||
                                    (timeLeft < 200 && index == 4))
                                {
                                    $(this).attr('src', 'images/smoke' + (index + 1) + '.png');
                                }
                            },
                            complete: function () 
                            { 
                                $('.gameArea').find(this).remove(); 
                            } 
                        }
                    );
                }
                // Animation pour affiché score au moment de l'impact
                let points = (50 + parseInt(Math.random() * 50));
                addToScore(
                    points, {left: (position.left - decalage.left) +
                    (size.width / 2), top: (position.top - decalage.top) + 
                    (size.height / 2 ), duration: 1000 + (position.top * 4)}
                );
            }
        ); 
    } 
} 