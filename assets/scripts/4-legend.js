"use strict";

function legend(svg, data, color) {
  var pays = data.columns.slice(1);
  var max = 0;
  data.forEach(function (d1) {
    pays.forEach(function (d2, i) {
      if (parseInt(d1[d2]) > max) {
        max = parseInt(d1[d2])
      }
    });
  });

  var c = color.range();
  var svgLegend = svg.append('svg')
    .attr("width",600);
  var defs = svg.append('defs');
  var linearGradient = defs.append('linearGradient')
    .attr('id', 'linear-gradient');
  
  // horizontal gradient
  linearGradient.attr("x1", "0%")
  .attr("y1", "0%")
  .attr("x2", "100%")
  .attr("y2", "0%");
  
  // append multiple color stops by using D3's data/enter step
  linearGradient.selectAll("stop")
  .data([
    {offset: "0%", color: c[0]},
    {offset: "50%", color: c[1]},
    {offset: "100%", color: c[2]}
  ])
  .enter().append("stop") 
  .attr("offset", function(d) { 
    return d.offset; 
  })
  .attr("stop-color", function(d) { 
    return d.color; 
  });
  
  // append title
  svgLegend.append("text")
  .attr("class", "legendTitle")
  .attr("x", 150)
  .attr("y", 20)
  .style("text-anchor", "center")
  .text("Nombre d'occurences");
  
  svgLegend.append("text")
  .attr("x", 5)
  .attr("y", 45)
  .style("text-anchor", "left")
  .text("0");
  
  svgLegend.append("text")
  .attr("x", 420)
  .attr("y", 45)
  .style("text-anchor", "right")
  .text(max);

  svgLegend.append("rect")
  .attr("x", 20)
  .attr("y", 30)
  .attr("width", 400)
  .attr("height", 15)
  .attr("rx",10) 
  .attr("ry",10)
  .style("fill", "url(#linear-gradient)");
  }
    
    
  
    

