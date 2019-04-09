"use strict";

/**
 * Crée les axes du canvas, le canvas et le tooltip
 * @param {*} heat Svg dans lequel dessiner
 * @param {*} sources Array de données
 * @param {*} xAxisHeat Axe des abscisses de la carte de chaleur
 * @param {*} yAxisHeat Axe des ordonnées de la carte de chaleur
 * @param {*} heightHeat Hauteur d'une carte de chaleur
 * @param {*} widthHeat Largeur d'une carte de chaleur
 * @param {*} interHeat Écart vertical entre deux cartes de chaleur
 * @param {*} transXY Translation diagonale dans le svg pour dessiner la carte de chaleur
 */
function createHeatMapAxis(heat, sources, xAxisHeat, yAxisHeat, heightHeat, widthHeat, interHeat, transXY) {

    sources.forEach(function (d, i) {

        var groupe = heat.append("svg")
            .attr("id", d.name)
            .attr("height", heightHeat)
            .attr("width", widthHeat)
            .attr("transform", "translate(50," + (200 + i * (interHeat + heightHeat)) + ")");

        heat.append("text")
            .attr("id", d.name)
            .classed("textPays", true)
            .attr("transform", "translate(" + (-transXY) + "," + (225 + i * (interHeat + heightHeat)) + ")")
            .text(jsUcfirst(d.name))
            .attr("font-weight",800)
            .style("font-size",22+"px");

        groupe.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(" + transXY + "," + transXY + ")")
            .call(xAxisHeat.ticks(d3.timeYear))
            .selectAll("text")
            .style("text-anchor", "start")
            .attr("dx", "0.5em")
            .attr("dy", "0.5em")
            .attr("transform", "rotate(-60)");

        groupe.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + transXY + "," + transXY + ")")
            .call(yAxisHeat);


        var foreignObject = groupe.append("foreignObject")
            .attr("width", widthHeat)
            .attr("height", heightHeat);

        var foBody = foreignObject.append("xhtml:body")
            .style("width", widthHeat + "px")
            .style("height", heightHeat + "px")
            .style("margin", "0px")
            .style("padding", "0px")
            .style("background-color", "none")

        var container = foBody.append("div")
            .style("width", widthHeat + "px")
            .style("height", heightHeat + "px")
            .style("margin", "0px")
            .style("padding", "0px");

        container.append("canvas")
            .style("margin", "50px")
            .classed('mainCanvas', true)
            .style("position", "absolute")
            .attr("width", widthHeat + "px")
            .attr("height", heightHeat - 50 + "px")
            .attr("id", d.name)
            .on('mousemove', function () {
                var mouseX = d3.event.layerX || d3.event.offsetX;
                var mouseY = d3.event.layerY || d3.event.offsetY;
                mouseEventHandler(mouseX, mouseY, d3.select(this).attr("id"), heat);
            })
            .on('mouseout', function () {
                d3.select('#tooltip')
                    .style('opacity', 0);
            })
            .filter(function (d, i) {
                console.log(d3.select(this).node());
            });

        container.append("canvas")
            .style("margin", "50px")
            .classed('hiddenCanvas', true)
            .style("display", "none")
            .style("position", "absolute")
            .attr("width", widthHeat + "px")
            .attr("height", heightHeat - 50 + "px")
            .attr("id", d.name)
            .filter(function (d, i) {
                console.log(d3.select(this).node());
            });

    });

}

/**
 * Met à jour les places des cartes de chaleur en fonction du nombre total d'occurences sur la période sélectionnée
 * @param {*} newData Array de données sélectionnée par le brush
 * @param {*} heat Svg dans lequel les cartes de chaleur sont dessinnées
 * @param {*} interHeat Écart vertical entre deux cartes de chaleur
 * @param {*} heightHeat Hauteur d'une carte de chaleur
 * @param {*} transXY Translation diagonale dans le svg pour dessiner la carte de chaleur
 */
function updateClassement(newData, heat, interHeat, heightHeat, transXY) {
    newData.forEach(function (d, i) {
        heat.selectAll("#" + d.name)
            .filter(function (d, i1) {
                if (d3.select(this).attr("class") == "textPays") {
                    d3.select(this).transition()
                        .duration(1000)
                        .attr("transform", "translate(" + (-transXY) + "," + (250 + i * (interHeat + heightHeat)) + ")")

                } else {
                    d3.select(this).transition()
                        .duration(1000)
                        .attr("transform", "translate(50," + (200 + i * (interHeat + heightHeat)) + ")");

                }
                return true;
            })
    })
}

/**
 * Remplissage des canvas en fonction de la donnée
 * @param {*} heat Svg dans lequel les cartes de chaleur sont dessinnées
 * @param {*} matrix Donnée à dessiner
 * @param {*} color Palette de couleur de la carte de chaleur
 * @param {*} xHeat Axe des abscisses de la carte de chaleur
 * @param {*} yHeat Axe des ordonnées de la carte de chaleur
 * @param {*} minDate Date minimale des données
 */
function createHeatMap(heat, matrix, color, xHeat, yHeat, minDate) {

    var numberYears = Math.round(Math.abs((xHeat.domain()[1].getFullYear() - xHeat.domain()[0].getFullYear()))) + 1;
    var debutYear = xHeat.domain()[0].getFullYear();
    var tickArray = xHeat.ticks(numberYears);
    var brushInterval = xHeat(tickArray[tickArray.length - 1]) - xHeat(tickArray[tickArray.length - 2]);
    var xGridSize = brushInterval;
    var yGridSize = yHeat.bandwidth();
    var width = numberYears * xGridSize;
    var height = 12 * yGridSize;

    resetColourNode();

    heat.selectAll("canvas")
        .filter(function (d, i) {
            var idCanv = d3.select(this).attr("id");
            var matrixPays = matrix.filter(function (d1) {
                return d1.name == idCanv
            })
            var context = d3.select(this).node().getContext('2d');
            var matrixPays = matrixPays[0];
            var submatrix = submat(matrixPays.matrix, 0, (debutYear - minDate.getFullYear()), 12, numberYears);
            var data = {
                name: matrixPays.name,
                matrix: submatrix
            };
            var custom = databind(data, width, height, xGridSize, yGridSize, color, idCanv);
            if (d3.select(this).attr("class") == "mainCanvas") {
                draw(width, height, context, custom, false);
            } else {
                draw(width, height, context, custom, true);
            }
            return false;
        });
}

/**
 * Extrait une sous matrice de la matrice principale
 * @param {*} matrix Matrice principale
 * @param {*} ipos Ligne de départ
 * @param {*} jpos Colonne de départ
 * @param {*} isize Nombre de lignes
 * @param {*} jsize Nombre de colonnes
 */
function submat(matrix, ipos, jpos, isize, jsize) {
    var result = [];
    for (var i = ipos; i < ipos + isize; i++) {
        var ligne = []
        for (var j = jpos; j < jpos + jsize; j++) {
            ligne.push(matrix[i][j]);
        }
        result.push(ligne);
    }
    return result;
}

/**
 * Met à jour les ticks sur les axes en fonction de la taille du brush
 * @param {*} numberYears Nombres d'années sélectionnées par le brush
 * @param {*} chaleurSvg Svg dans lequel on a dessiné les cartes de chaleur
 */
function axeUpdate(numberYears, chaleurSvg) {
    var inter;
    if (numberYears > 50) {
        inter = 10
    } else if (numberYears > 25) {
        inter = 5
    } else if (numberYears > 10) {
        inter = 2
    } else {
        inter = 1
    }

    chaleurSvg.selectAll("g.x.axis g.tick line")
        .attr("stroke-width", function (d, i) {

                if ((d.getFullYear()) % inter == 0) {
                    return 2;
                } //if it's an even multiple of 10%
                else
                    return 0.5;

            }
            //d for the tick line is the value
            //of that tick 
            //(a number between 0 and 1, in this case)

        )
        .attr("y2", function (d) {
            if ((d.getFullYear()) % inter == 0) {
                return -10;
            } else
                return -5;
        });

    chaleurSvg.selectAll("g.x.axis g.tick text")
        .style("font-size", 12 + "px").transition().duration(200)
        .attr("fill-opacity", function (d, i) {

            if ((d.getFullYear()) % inter == 0 || i == 0) {
                return 100;
            } else {
                return 0;
            }

        });
}

/**
 * Ajoute une majuscule à une string
 * @param {*} string Mot auquel ajouter une majuscule
 */
function jsUcfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}