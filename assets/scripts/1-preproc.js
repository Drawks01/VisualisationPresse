"use strict";

/**
 * Définit la palette de couleurs
 * 
 * @param {*} color Palette de couleurs des cartes de chaleur
 * @param {*} data Donnée brute
 */
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
    
    color.domain([0,  max/8, max/4])
      .range(["#f7fbff", "#4292c6", "#08306b"]);
}   

/**
 * Formatte la date selon le format du CSV
 * @param {*} data Donnée brute
 */
function parseDate(data) {
  var parser = d3.timeParse("%m/%Y");
  var pays = data.columns.slice(1);
  
  data.forEach( function(d1, i) {
    d1.Date = parser(d1.DATE);
    pays.forEach(function (d2, i) {
      d1[d2] = parseInt(d1[d2])
    });
  });
}

/**
 * Crée un array avec la structure {name: *, values: *, count: *}
 * @param {*} color Palette de couleurs des cartes de chaleur
 * @param {*} data Donnée brute
 */
function createSources(color, data) {
  var pays = data.columns.slice(1);

  var retArray = new Array(pays.length);
  pays.forEach(function(d, i) {
  var entree = new Array(data.length);
  var total = 0;
  data.forEach(function(d2,i2) {
    entree[i2] = {date: d2.Date, count: parseInt(d2[d])};
    total += parseInt(d2[d]);
  });
  retArray[i] = {name: d, values: entree, count: total};
});

retArray.sort(function(a, b){return b.count - a.count});
return retArray.slice(2, 10);
}

/**
 * Crée la matrice utilisée dans les cartes de chaleur
 * @param {*} data Donnée brute
 */
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

/**
 * Met à jour l'axe de la carte de chaleur en fonction du brush
 * @param {*} xHeat Axe de ka carte de chaleur
 * @param {*} xBrush Axe du brush
 * @param {*} data DOnnée brute
 */
function domainX(xHeat, xBrush, data) {
  var dataDate = data.map(function(d) { return d.Date} );
  var maxDate = d3.max(dataDate)
  xHeat.domain([data[0].Date, maxDate]);
  xBrush.domain([data[0].Date, maxDate]);
}

/**
 * Récupère la date minimum d'un jeu de données
 * @param {*} data Donnée brute
 */
function minimumDate(data){
  var dataDate = data.map(function(d) { return d.Date} );
  var minDate = d3.min(dataDate)
  return minDate;
}

/**
 * Définit l'axe Y de la carte de chaleur
 * @param {*} yHeat Axe vertical de la carte de chaleur
 * @param {*} yBrush Axe du brush
 * @param {*} sources Array de données
 */
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

/**
 * Crée un array de données directement exploitable pour dessiner l'histogramme
 * @param {*} sources Array de données
 * @param {*} xHeat Axe du brush
 */
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

/**
 * Remplit la palette de couleur de l'histogramme en fonction de la donnée
 * @param {*} color Palette de couleur de l'histogramme
 * @param {*} data Données
 */
function domainColorChart(color, data) {
  color.domain(data.map(function (d) {
    return d.name;
  }));
}

/**
 * Met à jour le domaine de l'axe des abscisses de l'histogramme
 * @param {*} x Axe des abscisses de l'histogramme
 * @param {*} data Données
 */
function domainXChart(x, data) {
  var list = data.map(function (d) {
    return d.name;
  });
  x.domain(list);
}

/**
 * Met à jour le domaine de l'axe des ordonnées de l'histogramme
 * @param {*} y Axe des ordonnées de l'histogramme
 * @param {*} currentData Données
 */
function domainYChart(y, currentData) {
  var results = currentData.map(function(d) {return d.count});
  y.domain([0, d3.max(results)]);
}

