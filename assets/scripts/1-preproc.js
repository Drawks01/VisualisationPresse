"use strict";

function domainColor(color, data) {
    var pays = data.columns.slice(1);
    var max = 0;
    data.forEach(function (d1) {
      pays.forEach(function (d2, i) {
        if (parseInt(d1[d2]) > max) {
            max = parseInt(d1[d2])
        }
      });
    });
      
    color.domain([0,  max/2, max])
      .range(["#f7fbff", "#4292c6", "#08306b"]);
}   

function parseDate(data) {
  var parser = d3.timeParse("%m/%Y");
  var pays = data.columns.slice(1);

  data.forEach( function(d1, i) {
    d1.Date = parser(d1.Date);
    pays.forEach(function (d2, i) {
      d1[d2] = parseInt(d1[d2])
    });
  });
}

function createSources(color, data) {
    var pays = data.columns.slice(1);
    var retArray = new Array(pays.length);
    pays.forEach(function(d, i) {
    var entree = new Array(data.length);
    data.forEach(function(d2,i2) {
      entree[i2] = {date: d2.Date, count: parseInt(d2[d])};
    });
    retArray[i] = {name: d, values: entree};
  });
  return retArray;
}

function createMatrixPays(data){
  var pays = data.columns.slice(1);

  var dataDate = data.map(function(d) { return d.Date} );
  var maxDate = d3.max(dataDate)
  var minDate = d3.min(dataDate)
  var nbYears = maxDate.getFullYear()-minDate.getFullYear();
  var retArray = new Array(pays.length);

  pays.forEach(function(d, i) {
  var entree = new Array(12);
  for (var k = 0; k < entree.length; k++) {
    entree[k] = new Array(nbYears);
      }

  data.forEach(function(d2,i2) {
    var m = d2.Date.getMonth();
    var y = d2.Date.getFullYear();

    entree[m][y-minDate.getFullYear()] = parseInt(d2[d]);
  });
  retArray[i] = {name: d, matrix: entree};
});
return retArray;
}

function domainX(xHeat, xBrush, data) {
  var dataDate = data.map(function(d) { return d.Date} );
  var maxDate = d3.max(dataDate)
  xHeat.domain([data[0].Date, maxDate]);
  xBrush.domain([data[0].Date, maxDate]);
}

function minimumDate(data){
  var dataDate = data.map(function(d) { return d.Date} );
  var minDate = d3.min(dataDate)
  return minDate;
}

function domainY(yHeat, yBrush, sources) {
  var mois = ["Janv", "Févr", "Mars", "Avr", "Mai", "Juin", "Juil","Août","Sept","Oct","Nov","Déc"];
  var max = 0;
  var maxTemp;
  sources.forEach(function(d,i) {
    maxTemp = Math.max.apply(Math, d.values.map(function(o) { return o.count; }));
    if(max < maxTemp) {max = maxTemp};
  });
  yHeat.domain(mois);
  yBrush.domain([0, 10]);

}

function sourcesToChart(sources, xHeat) {
  var endYear = xHeat.domain()[1].getFullYear();
  var debutYear = xHeat.domain()[0].getFullYear();

  var retArray = new Array(sources.length);
  sources.forEach(function(d, i) {
    var counting = 0;
    d.values.forEach(function(d2) {
      var cYear = d2.date.getFullYear();
      if(cYear>=debutYear && cYear<=endYear) {
        counting += d2.count;
      }
      
    });
    retArray[i] = {name: d.name, count:counting};
  })
  return retArray;
}

function domainColorChart(color, data) {
  color.domain(data.map(function (d) {
    return d.name;
  }));
}

function domainXChart(x, data) {
  var list = data.map(function (d) {
    return d.name;
  });
  x.domain(list);
}

function domainYChart(y, currentData) {
  var results = currentData.map(function(d) {return d.count});
  y.domain([0, d3.max(results)]);
}
