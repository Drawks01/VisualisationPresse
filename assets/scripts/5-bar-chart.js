"use strict";


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