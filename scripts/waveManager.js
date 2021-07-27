// Création des ennemis
function createWave() 
{ 
    let number = 10 + currentLevel; 
    let gameArea = $('.gameArea'); 
    let target = $('.hero'); 
    let offsets = {left: gameArea.offset().left, top: gameArea.offset().top}; 
    let size = {width: target.width(), height: target.height()}; 
    let coords = {
        left: target.offset().left + (size.width / 4) - offsets.left,
        top: target.offset().top + (size.height / 4) - offsets.top
    }; 
    for (let t = 0; t < number; t++)
    {
        let distance = 400 + parseInt((Math.random() * 100)); 
        let PV = parseInt(Math.random() * 3) + 1; 
        let anglePos = parseInt(Math.random() * 359); 
        let targetCartesianCoords = polarToCartesian(distance, anglePos); 
        let orientation = cartesianToPolar(
            coords.left,
            coords.top,
            coords.left + targetCartesianCoords.left,
            coords.top + targetCartesianCoords.top
            ); 
        spiders.push(
            {
                id: guid(), 
                PV: PV, 
                life: PV, 
                angle: anglePos, 
                coords: coords, 
                targetCartesianCoords: targetCartesianCoords, 
                orientation: orientation
            } 
        ); 
    }
    renderWave();
}


// Envoyer les araignées dans l’aire de jeu
function renderWave () 
{
    let spider; 
    spider = spiders.shift(); 
    if (spider) 
    {
        $('<img class="spider" data-id="' + spider.id + '"src="./images/ennemiPosition1.png">')
        .css(
            {
                left: (spider.coords.left + spider.targetCartesianCoords.left) + 'px', 
                top: (spider.coords.top + spider.targetCartesianCoords.top) + 'px', 
                transform: 'rotate(' + (spider.orientation.angle) + 'deg)' + (spider.PV == 1 ? ' scale(.75)' : spider.PV == 3 ? 'scale(1.5)' : '')
            }
        ) 
        .appendTo('.gameArea') 
        .animate (
            {
                left: spider.coords.left + 'px', 
                top: spider.coords.top + 'px' 
            }, 
            { 
                duration: 20000 - (spider.PV == 1 ? 10000 : spider.PV == 2 ? -10000 : 0), 
                easing: 'linear',
                // change image arraigné pour animation
                progress: function (animation, progression, timeleft) 
                {
                    let step = $(this).attr('data-step') || 0; 
                    if (++step % (3 * spider.PV) == 0)
                    {
                        $(this).attr('src', 'images/ennemiPosition' + (1 + Math.ceil(progression * 10000) % 3) + '.png');
                    }
                    $(this).attr('data-step', step);

                    let spiderPosition = $(this).offset(); 
                    let heroPosition = $('.hero').offset(); 
                    let radialCoords = cartesianToPolar(spiderPosition.left + ($(this).width() * spider.PV / 2), 
                        spiderPosition.top + ($(this).height() * spider.PV / 2),
                        heroPosition.left + ($('.hero').width() / 2),
                        heroPosition.top + ($('.hero').height() / 2)); 
                    if (radialCoords.distance <= 15 * spider.PV) 
                    { 
                        let spiderThing = $(this); 
                        let blinkTime = 10; 
                        heroLives--; 
                        spiderThing.remove();
                        showStats(); 
                        let theSpider = inGameSpiders.find(f => f.id == spider.id); 
                        inGameSpiders.splice(inGameSpiders.indexOf(theSpider), 1); 
                        let blink = function () 
                        { 
                            $('.hero').css('opacity', blinkTime-- % 2 == 1 ? 1 : 0); 
                            if (blinkTime > 0) 
                            { 
                               setTimeout(blink, 100); 
                            } 
                            else 
                            { 
                               $('.hero').css('opacity', 1); 
                            } 
                        }; 
                        blink(); 
                    } 
                }
            },
        );
        spider.htmlElement = $('.spider[data-id="' + spider.id + '"]'); 
        inGameSpiders.push(spider); 
        setTimeout (
            renderWave,
            2000
        ); 
    }
    else 
    { 
        newWave(); 
    }
    showStats();  
}

function newWave() 
{ 
    currentWave++; 
    $('.waveLevel').css(
        {
            opacity: 1,
            top: '200px'
        } 
    ).text('Vague ' + currentWave); 
    setTimeout(
        e =>
        {
            $('.waveLevel').css(
                { 
                    opacity: 0, 
                    top: '-100px' 
                } 
            ); 
            createWave(); 
        },3000 
    ); 
} 