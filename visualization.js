const width = window.innerWidth;
const height = window.innerHeight;

const mapOffsetX = width/2
const mapOffsetY = height/1.4
const mapScale = 200

const zoomMin = 1.0
const zoomMax = 50

const markerRadius = 3


// create the svg canvas for our visualization
const svg = d3.select('body')
              .append('svg')
              .attr('width', width)
              .attr('height', height);


// create pan and zoom interaction and add to svg canvas
zoom = d3.zoom()
        .scaleExtent([zoomMin, zoomMax])
        .translateExtent([[0,0], [width,height]])
        .on("zoom", zoomed)
svg.call(zoom)


// create map container with pan and zoom
const map = svg.append('g')
              .attr('width', width)
              .attr('height', height)

var tooltip = d3.select("body").append("div")
                .attr("class", "tooltip") //class was defined above to determine how tooltips appear
                .style("opacity", 0);


// specify what happens when when we zoom
function zoomed() {
  transform = d3.event.transform
  console.log(transform)
  map.attr("transform", transform);
  map.selectAll("circle")
    .attr("r", markerRadius/transform.k); // keep marker size constant on screen

  // hide the text
  if(showText){
    showText = false
    d3.selectAll('text')
      .transition()
      .duration(600)
      .style('opacity', 0)
  }
}


// add background rectangle to enable interaction anywhere on map
background = map.append('rect')
  .attr('x', 0)
  .attr('y', 0)
  .attr('width', width)
  .attr('height', height)
  .attr('fill', 'gray');


// add countries to map
const projection = d3.geoMercator().scale(mapScale)
  .translate([mapOffsetX, mapOffsetY]);
const geoPath = d3.geoPath(projection);

d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
  .then(data => {
    const countries = topojson.feature(data, data.objects.countries);
    map.selectAll('path')
      .data(countries.features)
      .enter()
      .append('path')
      .filter(function(d){ return d.properties.name !== "Antarctica" })
      .attr('class', 'country')
      .attr('cursor', 'pointer')
      .attr('d', geoPath);
});


// add point markers to map
d3.csv("Patent_5yrs_lat+long+year.csv")
  .then(function(data) {
    var latlonglist = [];
    // for (var i=0; i < data.length; i++) {
    for (var i=0; i < 100; i++) {
      latlonglist.push([data[i].longitude, data[i].latitude, data[i].year]);
  }
 // const symbol = d3.symbol();
  map.selectAll("circle")
  .data(latlonglist)
  .enter()
  .append("circle")
  .filter(function(d){ return d[2] === "2018"})
  .attr("cx", function (d) { return projection(d)[0]; })
  .attr("cy", function (d) { return projection(d)[1]; })
  .attr("r", markerRadius)
  .attr("fill", "gold")
  .attr('cursor', 'pointer')
  //.attr('d', d => symbol())
  .on("mouseover", function(event, d) {
    tooltip.transition()
      .duration(200) //animation technique makes the tooltips visible
      .style("opacity", .9);
    tooltip.html("Longitude " )
      .style("left", (event.pageX) + "px")
      .style("background", "gold")
      .style("top", (event.pageY - 28) + "px");
      console.log( "Longitude " + (d)[0] + "<br/> Latitude: " +(d)[1])

     d3.select(this) //select the point and change its properties on mouseover
       .attr("fill", "white")
     //  console.log("Longitude " + function (d) {return d[0];}+ "<br/> Latitude: " + function (d) {return d[1];})
     //  .attr('d', symbol.size(64 * 4));
    })
  .on("mouseout", function(event, d) {
    tooltip.transition()
      .duration(500)
      .style("opacity", 0);

    d3.select(this) //restore point to original value
       .attr("fill", "gold")
    //   .attr("d", symbol.size(64));

   });
  });


// add text
var showText = true
title = svg.append('text')
  .text('Patent Explorer')
  .attr('x', 30)
  .attr('y', 60)
  .attr('id', 'title')

description = svg.append('text')
  .attr('x', 30)
  .attr('y', 90)
description.append('tspan')
    .text('Where do good ideas come from?')
    .attr('dy', 7)
    .attr('x', 30)
description.append('tspan')
    .text('Explore patents filed around the world:')
    .attr('dy', 30)
    .attr('x', 30)
description.append('tspan')
    .text('scroll')
    .attr('dy', 30)
    .attr('x', 50)
    .attr('class', 'action')
description.append('tspan')
    .text(' to zoom')
description.append('tspan')
    .text('click and drag')
    .attr('dy', 30)
    .attr('x', 50)
    .attr('class', 'action')
description.append('tspan')
    .text(' to pan')
description.append('tspan')
    .text('hover')
    .attr('dy', 30)
    .attr('x', 50)
    .attr('class', 'action')
description.append('tspan')
    .text(' to explore data')

sourceInfo = svg.append('text')
  .text('Data source: patentsview.org (2018)')
  .attr('x', 15)
  .attr('y', height-20)
  .attr('id', 'source')


//////////////////////////////////////////////////////////////////////////////////////////////
// var pointMarkers = svg.append( "g" );

// pointMarkers.selectAll( "path" )
//   .data( rodents_json.features )
//   .enter()
//   .append( "path" )
//   .attr( "fill", "#900" )
//   .attr( "stroke", "#999" )
//   .attr( "d", geoPath );

// function zoomed({transform}) {
//   console.log(transform)
//   map.attr("transform", transform);
//   map.selectAll("circle")
//     .attr("r", markerRadius/transform.k); // keep marker size constant on screen
// }


// function zoomed() {
//   projection.translate(d3.event.translate).scale(d3.event.scale); // modify the projection
//   g.selectAll("path").attr("d", path);   // update the paths
//
//   // update the circles/points:
//   svg.selectAll("circle")
//     .attr("cx", function (d) { return projection(d)[0]; })
//     .attr("cy", function (d) { return projection(d)[1]; });
// }


  // function main() {
  //   var margin = { top:50, left: 50, right: 50, bottom: 50},
  //     height = 400 - margin.top - margin.bottom,
  //     width = 800 - margin.left - margin.right;
  //
  //   var svg = d3.select("#map")
  //         .append("svg")
  //         .attr("height", height + margin.top + margin.bottom)
  //         .attr("width", width + margin.left + margin.right)
  //         .append("g")
  //         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  //
  //   d3.json("world.topojson", function(data) {
  //     console.log(data);
  //   });
  //
  //   d3.queue()
  //     .defer(d3.json, "world.topojson")
  //     .await(ready);
  //
  //   function ready (error, data) {
  //     // console.log(data)
  //
  //   }
  //
  // }
  //
  // main();
