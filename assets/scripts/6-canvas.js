
var nextCol;
var colourToNode; // Map to track the colour of nodes.

/**
 * Génère la couleur de la case suivante
 */
function genColor(){ 
  var ret = [];

  if(nextCol < 16777215){ 
    
    ret.push(nextCol & 0xff); // R 
    ret.push((nextCol & 0xff00) >> 8); // G 
    ret.push((nextCol & 0xff0000) >> 16); // B

    nextCol += 1; 
  }

  var col = "rgb(" + ret.join(',') + ")";
  return col;
}


/**
 * Remise à zéro des couleurs du canvas pour le tool-tip
 */
function resetColourNode(){
  colourToNode = {}
  nextCol = 1;
  d3.select('#tooltip')
  .style('opacity', 0);
}

/**
 * Crée les tuiles du canvas
 * @param {*} data Donnée
 * @param {*} width Largeur du canvas
 * @param {*} height Hauteur du canvas
 * @param {*} xGridSize Largeur d'une case
 * @param {*} yGridSize Hauteur d'une case
 * @param {*} color Échelle de couleur
 */
function databind(data,width,height,xGridSize,yGridSize,color) {

  var customBase = document.createElement('custom');
  var custom = d3.select(customBase);
  var join = custom.selectAll('custom.rect')
    .data(data.matrix);
  var enterSel = join.enter();
  enterSel.each(function(d,i){
    var sel = d3.select(this);
    var n = d.length;
    d.forEach(function(d1,j){
      sel.append('custom')
      .attr('class', 'rect')
      .attr("x", j*xGridSize)
      .attr("y", i*yGridSize)
      .attr('width', xGridSize + 0.08*xGridSize)
      .attr('height', yGridSize + 0.08*yGridSize)
      .attr('fillStyle', color(d1))
      .attr('fillStyleHidden', function(d2) {
        var col = genColor();
        colourToNode[col] = d1;
          return col;})
      .attr('data',d1);
    });
  })

  return custom;
}

/**
 * Dessine les éléments dans le canvas
 * @param {*} width Largeur du canvas
 * @param {*} height Hauteur du canvas
 * @param {*} context 
 * @param {*} custom 
 * @param {*} hidden
 */
function draw(width,height,context,custom,hidden){

  context.clearRect(0, 0, width, height);

  var elements = custom.selectAll('custom.rect');
  elements.each(function(d,i) {
    var node = d3.select(this);
    context.fillStyle = hidden ? node.attr('fillStyleHidden') : node.attr('fillStyle');
    context.fillRect(node.attr('x'), node.attr('y'), node.attr('width'), node.attr('height'));
  });
}

/**
 * Gère le survol de la souris
 * @param {*} mouseX Position horizontale de la souris
 * @param {*} mouseY Position verticale de la souris
 * @param {*} id id du canvas sur lequel on dessine
 * @param {*} heat Svg dans lequel il y a les cartes de chaleur
 */
function mouseEventHandler(mouseX,mouseY,id,heat){

  var hid = heat.selectAll(".hiddenCanvas")
    .filter(function(d) {return d3.select(this).attr("id") == id; })
  var hiddenCtx = hid.node().getContext('2d');
  var col = hiddenCtx.getImageData(mouseX, mouseY, 1, 1).data; 
  var colKey = 'rgb(' + col[0] + ',' + col[1] + ',' + col[2] + ')';
  var nodeData = colourToNode[colKey];

  if (nodeData+1){
    d3.select('#tooltip')
      .style('opacity', 0.8)
      .style('top', d3.event.pageY + 5 + 'px')
      .style('left', d3.event.pageX + 5 + 'px')
      .html(nodeData);
  } else {
    d3.select('#tooltip')
      .style('opacity', 0);
  }

  return nodeData;
}