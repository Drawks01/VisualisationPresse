/**
 * Fichier principal permettant de dessiner les deux graphiques demandés. Ce fichier utilise les autres fichiers
 * que vous devez compléter.
 *
 * /!\ Aucune modification n'est nécessaire dans ce fichier!
 */
(function(d3, localization) {
  "use strict";

  /***** Configuration *****/
  // Paramètres

  var wS = screen.width;
  var hS = screen.height;

  var hSvg = 6000; 
  var wSvg = 0.85*wS;

  var marginBrush = {
    top: 10,
    right: 10,
    bottom: 50,
    left: 60
  };

  var marginHeat = {
    top: 100,
    right: 50,
    bottom: 50,
    left: 60
  };

  var barChartMargin = {
    top: 55,
    right: 50,
    bottom: 150,
    left: 100
  };

  var barChartWidth = 0.7*wS - barChartMargin.left - barChartMargin.right;
  var barChartHeight = 0.5*hS - barChartMargin.top - barChartMargin.bottom;

  var heightHeat = hSvg - marginHeat.top - marginHeat.bottom;
  var widthHeat = wSvg - marginBrush.left - marginBrush.right;

  var heightHisto = 0.8*hS;
  var widthHisto = 0.8*wS;
  
  var hPays = 0.2*hS;
  var wPays = 0.5*widthHeat;
  var interPays = 0.1*hPays;
  var transXY = 50;

  var widthBrush = 600;
  var heightBrush = 25;

  /***** Échelles *****/

  var xHeat = d3.scaleTime().range([0, wPays - transXY]);
  var yHeat = d3.scaleBand().range([0, hPays - transXY]);

  var xBrush = d3.scaleTime().range([0, widthBrush]);
  var yBrush = d3.scaleLinear().range([heightBrush,0,]);
    
  var xAxisHeat = d3.axisTop(xHeat).tickFormat(d3.timeFormat("%Y")).tickSizeInner(10).tickSizeOuter(10);
  var yAxisHeat = d3.axisLeft(yHeat);

  var xAxisBrush = d3.axisTop(xBrush);

  /***** Création des éléments *****/

  var tabs = d3.selectAll(".tabs li");
  tabs.on("click", function (d, i) {
    var self = this;
    var index = i;
    tabs.classed("active", function () {
      return self === this;
    });
    d3.selectAll(".tabs .tab")
      .classed("visible", function (d, i) {
        return index === i;
      });
  });

  
  var body = d3.select("body");

  var brushDiv = d3.select("#brush-div");

  var chaleurSvg = d3.select("#chaleur-svg")
    .attr("width", widthHeat + marginHeat.left + marginHeat.right)
    .attr("height", heightHeat + marginHeat.top + marginHeat.bottom);

  var histoSvg = d3.select("#histogramme-svg")
    .attr("width", widthHisto + marginHeat.left + marginHeat.right)
    .attr("height", heightHisto + marginHeat.top + marginHeat.bottom);

  var histoGroup = histoSvg.append("g")
    .attr("transform", "translate(" + barChartMargin.left + "," + barChartMargin.top + ")");

  var heat = chaleurSvg.append("g")
    .classed("center", true)
    .attr("id","heat");

  brushDiv.style("width", (0.5*wS + "px"))
    .style("height", (0.1*hS + "px"))
    .style("left", "50%")
    .style("top", "50%")
    .style("margin-left", (0.25*wS+"px"))
    .style("margin-right", (0.05*hS+"px"));

  var brushG = brushDiv.append("svg")
    .style("width", (0.5*wS + "px"))
    .style("height", (0.1*hS + "px"))
    .attr("id","brush");

  chaleurSvg.append("defs")
    .append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", widthHeat)
    .attr("height", heightHeat);

  var sources;
  var color;
  var brushInterval; //Distance entre 2 tick de l'axe brush
  var minDate;
  var matrix;
  var newData;
  var x;
  var y;
  var colorBar;
  var xAxis;
  var yAxis;

  // Permet de redessiner le graphique principal lorsque le zoom/brush est modifié.
  var brush = d3.brushX()
    .extent([[0, 0], [widthBrush, heightBrush]])
    .on("brush", function () {
      brushUpdate(brush, heat, xHeat, xBrush, xAxisHeat, yAxisHeat,brushInterval);
      newData = sourcesToChart(sources, xHeat);
      newData = newData.sort(function(x,y){ return d3.descending(x.count,y.count)})
      updateClassement(newData,heat,interPays,hPays,transXY);
      createHeatMap(heat, matrix, color, xHeat, yHeat, minDate);
      var nb = Math.round(Math.abs((xHeat.domain()[1].getFullYear() - xHeat.domain()[0].getFullYear())))+1;
      axeUpdate(nb,chaleurSvg);
      domainXChart(x, newData);
      domainYChart(y, newData);
      transition(histoGroup, newData, x, y, colorBar, xAxis, yAxis, barChartHeight);
    });

  /***** Construction de la visualisation *****/
  d3.csv("./data/articleDevoir2.csv").then(function(data) {

    // Prétraitement des données
    color = d3.scaleLinear();
    
    domainColor(color, data);
    parseDate(data);

    console.log("Data", data);

    sources = createSources(color, data);
    matrix = createMatrixPays(data);
    minDate = minimumDate(data);

    console.log("Sources", sources);

    domainX(xHeat, xBrush, data);
    domainY(yHeat, yBrush, sources);

    var numberYears = Math.round(Math.abs((xBrush.domain()[1].getFullYear() - xBrush.domain()[0].getFullYear())))+1;
    var tickArray = xBrush.ticks(numberYears);
    brushInterval = xBrush(tickArray[tickArray.length - 1]) - xBrush(tickArray[tickArray.length - 2]);
    
    // Création du graphique Heat 

    createHeatMapAxis(heat,sources,xAxisHeat,yAxisHeat,hPays,wPays, interPays, transXY);
    d3.selectAll("g.y.axis g.tick line")
      .attr("stroke-width", 1)
      .attr("x2", 0);
    d3.selectAll("g.y.axis g.tick text")
      .style("font-size",12+"px");
    d3.selectAll("g.x.axis g.tick text")
      .style("font-size",12+"px");

    createHeatMap(heat, matrix, color, xHeat, yHeat, minDate);
    axeUpdate(numberYears,chaleurSvg);

    // Axes brush

    brushG.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(20," + heightBrush + ")")
      .call(xAxisBrush);

    brushG.append("g")
      .attr("class", "x brush")
      .call(brush)
      .selectAll("rect")
      .attr("y", -6)
      .attr("height", heightBrush + 7);

    // Création de la légende
    
    legend(chaleurSvg, data, color)

    // Création des médailles

    heat.append("svg:image")
      .attr('x',-20)
      .attr('y', 270)
      .attr('width', 50)
      .attr('height', 50)
      .attr("xlink:href", "assets/pngs/gold-medal.png");

    heat.append("svg:image")
      .attr('x',-20)
      .attr('y', 470)
      .attr('width', 50)
      .attr('height', 50)
      .attr("xlink:href", "assets/pngs/silver-medal.png");

    heat.append("svg:image")
      .attr('x',-20)
      .attr('y', 670)
      .attr('width', 50)
      .attr('height', 50)
      .attr("xlink:href", "assets/pngs/bronze-medal.png");
  
    // Création de l'histogramme

    colorBar = d3.scaleOrdinal(d3.schemeCategory10);
    x = d3.scaleBand().range([0, barChartWidth]).round(0.05);
    y = d3.scaleLinear().range([barChartHeight, 0]);

    // Prétraitement des données

    var chartSources = sourcesToChart(sources, xHeat);
    console.log("chartSources", chartSources);

    domainColorChart(colorBar, chartSources);
    domainXChart(x, chartSources);
    domainYChart(y, chartSources);

    xAxis = d3.axisBottom(x);
    yAxis = d3.axisLeft(y);

    createAxes(histoGroup, xAxis, yAxis, barChartHeight);
    createBarChart(histoGroup, chartSources, x, y, colorBar, barChartHeight);
   

    body.selectAll("text")
      .attr("font-family", "Arvo");
    });
  })(d3, localization);

