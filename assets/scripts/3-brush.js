"use strict";

function brushUpdate(brush, heat, xHeat, xBrush, xAxisHeat, yAxisHeat,brushInterval) {
    var s = d3.event.selection || xBrush.range();

    var numberYears = Math.round(Math.abs((xBrush.domain()[1].getFullYear() - xBrush.domain()[0].getFullYear())))+1;
    var tickArray = xBrush.ticks(numberYears);
    var diffi = 1;
    var diffj= 1;
    var i = -1;
    var j = -1;
    while(diffi > 0 || diffj > 0 ){
      if(diffi > 0 ){
        i++; 
        diffi = s[0] - xBrush(tickArray[i])

      }
      if(diffj > 0){
        j++;
        diffj = s[1] - xBrush(tickArray[j])
      }
    }
    if(i>0){
      i--;
    }
    var p = [ xBrush(tickArray[i]),xBrush(tickArray[j])];

    xHeat.domain(p.map(xBrush.invert, xBrush));
    heat.selectAll(".x.axis").call(xAxisHeat)
    .selectAll("text")	
    .style("text-anchor", "start")
    .attr("dx", "0.5em")
    .attr("dy", "0.5em")
    .attr("transform", "rotate(-60)");
}


