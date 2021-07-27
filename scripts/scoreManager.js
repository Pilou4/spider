function saveScores() 
{ 
    localStorage.setItem("HallOfFame", JSON.stringify(bestScores)); 
}

function loadScores() 
{ 
    let savedData = localStorage.getItem('HallOfFame'); 
    if (!savedData) 
    { 
        saveScores(); 
    } 
    else 
    { 
        bestScores = JSON.parse(savedData); 
    } 
}

function updateScore() 
{ 
    $('.currentScore').text(playerScore);
    showStats(); 
}

function addToScore(points, animationParams) 
{ 
    let no = guid(); 
    playerScore += points; 
    updateScore(); 
    if (animationParams) 
    { 
       $('.gameArea').append('<label class="points" data-id="' + no + '">' + points + '</label>'); 
       $('.points[data-id="' + no + '"]').css(
           { 
                left: animationParams.left + 'px', 
                top: animationParams.top + 'px' 
            } 
        ); 
       $('.points[data-id="' + no + '"]').animate (
           { 
                opacity: 0, 
                top: '-50px' 
            }, 
            { 
                duration: animationParams.duration, 
                easing: 'linear', 
                complete: function ()
                { 
                    $('.gameArea').find(this).remove(); 
                } 
            } 
        ); 
    } 
}

function showStats() 
{ 
    $("#waveNo").text(currentWave); 
    $("#spidersNumber").text(spiders.length + " - " + inGameSpiders.length); 
    $("#lives").text(heroLives + 1); 
    $("#killedSpiders").text(hits); 
}

function updateHallOfFame() 
{ 
    let playerName = 'AAA'; 
    bestScores.tenBests.push({name: playerName, score: playerScore}); 
    bestScores.tenBests.sort((a, b) => a.score > b.score ? -1 : a.score == b.score ? 0 : 1);
    bestScores.tenBests = bestScores.tenBests.slice(0, 10); 
    showHallOfFame(); 
}

function showHallOfFame() 
{ 
    let TBScoresOne = ""; 
    let TBScoresTwo = ""; 
    let LFScores = ""; 
    bestScores.tenBests.forEach((e, i) => {
        if (i < 5) 
        {
            TBScoresOne += '<label class="bestTen">' + e.score + ' - ' + e.name + '</label>'
        } else {
            TBScoresTwo += '<label class="bestTen">' + e.score + ' - ' + e.name + '</label>'
        }
    }); 
    bestScores.lastFive.forEach((e, i) => LFScores += '<label class="lastFive">' + e.score + ' - ' + e.name + '</label>'); 
    $('#BTOne').empty().append(TBScoresOne); 
    $('#BTTwo').empty().append(TBScoresTwo); 
    $('.lastFiveContainer').empty().append(LFScores); 
} 