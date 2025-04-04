console.log(countryPlayerCounts);

function calculateOpacity(playerCount, minPlayers, maxPlayers) {
    var normalizedCount = (playerCount - minPlayers) / (maxPlayers - minPlayers);
    var minOpacity = 0.2;
    var maxOpacity = 0.8;
    return minOpacity + normalizedCount * (maxOpacity - minOpacity);
}

var minPlayers = Math.min(...Object.values(countryPlayerCounts).map(d => d.Players));
var maxPlayers = Math.max(...Object.values(countryPlayerCounts).map(d => d.Players));

for (var country in countryPlayerCounts) {
    var playerCount = countryPlayerCounts[country].Players;
    var opacity = calculateOpacity(playerCount, minPlayers, maxPlayers);
    countryPlayerCounts[country].fillColor = `rgba(250, 102, 94, ${opacity})`;
}

var map = new Datamap({element: document.getElementById('main-container'),
    fills: {
        defaultFill: 'rgba(80, 80, 80, 0)'
    },
    geographyConfig: {
    highlightBorderColor: '#bada55',
    popupTemplate: function(geo, data) {
        if (!data) return;
        return ['<div class="hoverinfo">',
            '<strong>', geo.properties.name, '</strong>',
            '<br>Players: ', data.Players,
            '</div>'].join('');
        }
    },
    data: countryPlayerCounts,
    done: function(datamap) {
        datamap.svg.selectAll('.datamaps-subunit').style('fill', function(geo) {
            var countryCode = geo.id;
            if (countryPlayerCounts[countryCode]) {
                return countryPlayerCounts[countryCode].fillColor;
            }
            return 'transparent'; 
        });
    },
    responsive: true
});

window.addEventListener('resize', function() {
    map.resize();
});

/*
Player count
Maps completed
Maps in progress
Sky fails

*/ 