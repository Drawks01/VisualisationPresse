"use strict";

/**
 * Créer les axes de l'histogramme
 * @param {*} g Svg dans lequel dessiner
 * @param {*} xAxis Axe des abscisses de la carte de chaleur
 * @param {*} yAxis Axe des ordonnées de la carte de chaleur
 * @param {*} height Hauteur de la carte de chaleur
 */
function createAxes(g, xAxis, yAxis, height) {
  // Axe horizontal
  
  var xAxisGroup = g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
  xAxisGroup.selectAll("text")
    .attr("y", 15)
    .attr("x", 5)
    .attr("dy", "0.7em")
    .attr("transform", "rotate(30)")
    .style("text-anchor", "start")
    .attr("font-size", 12.5);
  
  // Axe vertical
  g.append("g")
    .attr("class", "y axis")
    .call(yAxis)

  g.append("text")
    .attr('transform', 'translate(70, -15)')
    .attr("font-size", 13)
    .style("text-anchor", "end")
    .text("Nombre d'occurences");
}

/**
 * Crée le barchart
 * @param {*} g Svg dans lequel dessiner
 * @param {*} currentData Donnée sélectionnée par le brush
 * @param {*} x Axe des abscisses de l'histogramme
 * @param {*} y Axe des ordonnées de l'histogramme
 * @param {*} color Palette de couleurs de l'histogramme
 * @param {*} height Hauteur maximale de l'histogramme
 */
function createBarChart(g, currentData, x, y, color, height) {

  g.selectAll("rect")
    .data(currentData)
    .enter()
    .append("rect")
    .attr("x", function(d) {
      return x(d.name);
    })
    .attr("y", function(d) {
      return y(d.count);
    })
    .attr("width", x.bandwidth())
    .attr("height", function(d) {
      return height - y(d.count);
    })
    .attr("fill", function(d) {
      return color(d.name);
    })
}

/**
 * Effectue une transition entre l'ancien set de données et le nouveau
 * @param {*} g Svg dans lequel l'histogramme est dessiné
 * @param {*} newData Donnée sélectionnée par le brush
 * @param {*} x Domaine des abscisses de l'histogramme
 * @param {*} y Domaine des ordonnées de l'histogramme
 * @param {*} color Palette de couleurs de l'histogramme
 * @param {*} xAxis Axe des abscisses de l'histogramme
 * @param {*} yAxis Axe des ordonnées de l'histogramme
 * @param {*} height Hauteur maximale de l'histogramme
 */
function transition(g, newData, x, y, color, xAxis, yAxis, height) {
  g.selectAll("rect")
    .data(newData)
    .transition()
    .duration(200)
    .attr("x", function(d) {
      return x(d.name);
    })
    .attr("y", function(d) {
      return y(d.count);
    })
    .attr("fill", function(d) {
      return color(d.name);
    })
    .attr("height", function(d) {
      return height - y(d.count);
    });

  g.select(".axis.y")
    .transition()
    .duration(200)
    .call(yAxis);

  g.select(".axis.x")
    .transition()
    .duration(200)
    .call(xAxis);
}