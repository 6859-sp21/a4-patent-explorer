// const width = 1800
// const height = 900
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


// create map container with pan and zoom
const map = svg.append('g')
              .attr('width', width)
              .attr('height', height)
              .call(d3.zoom()
                .scaleExtent([zoomMin, zoomMax])
                .translateExtent([[0,0], [width,height]])
                .extent([[0, 0], [width, height]])
                .on("zoom", zoomed));

function zoomed({transform}) {
  console.log(transform)
  map.attr("transform", transform);
  map.selectAll("circle")
    .attr("r", markerRadius/transform.k); // keep marker size constant on screen
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
    for (var i=0; i < 200; i++) {
      latlonglist.push([data[i].longitude, data[i].latitude, data[i].year]);
  }
  map.selectAll("circle")
  .data(latlonglist)
  .enter()
  .append("circle")
  .filter(function(d){ return d[2] === "2018"})
  .attr("cx", function (d) { return projection(d)[0]; })
  .attr("cy", function (d) { return projection(d)[1]; })
  .attr("r", markerRadius)
  .attr("fill", "gold")
  .attr('cursor', 'pointer');
});


//////////////////////////////////////////////////////////////////////////////////////////////
// var pointMarkers = svg.append( "g" );

// pointMarkers.selectAll( "path" )
//   .data( rodents_json.features )
//   .enter()
//   .append( "path" )
//   .attr( "fill", "#900" )
//   .attr( "stroke", "#999" )
//   .attr( "d", geoPath );




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
