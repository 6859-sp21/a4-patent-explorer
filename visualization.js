const width = 1800;
const height = 900;

const svg = d3.select('body')
              .append('svg')
              .attr('width', width)
              .attr('height', height);


const projection = d3.geoMercator().scale(200)
  .translate([width/2, height/1.4]);
const path = d3.geoPath(projection);

const g = svg.append('g')
              .call(d3.zoom()
              .scaleExtent([1/2, 4])
              .on("zoom", zoomed));

function zoomed({transform}) {
  g.attr("transform", transform);

    }

// function zoomed() {
//   projection.translate(d3.event.translate).scale(d3.event.scale); // modify the projection
//   g.selectAll("path").attr("d", path);   // update the paths
//
//   // update the circles/points:
//   svg.selectAll("circle")
//     .attr("cx", function (d) { return projection(d)[0]; })
//     .attr("cy", function (d) { return projection(d)[1]; });
// }

d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
  .then(data => {

const countries = topojson.feature(data, data.objects.countries);
g.selectAll('path')
  .data(countries.features)
  .enter()
  .append('path')
  .attr('class', 'country')
  .attr('cursor', 'pointer')
  .attr('d', path);


  });

  // Load lat and long from csv file
  d3.csv("Patent_5yrs_lat+long.csv").then(function(data) {
    var latlonglist = [];
    // for (var i=0; i < data.length/1000; i++) {
    for (var i=0; i < 100; i++) {
      latlonglist.push([data[i].longitude,data[i].latitude]);
  }
  // svg.selectAll("circle")
  g.selectAll("circle")
  .data(latlonglist).enter()
  .append("circle")
  .attr("cx", function (d) { console.log(projection(d)); return projection(d)[0]; })
  .attr("cy", function (d) { return projection(d)[1]; })
  .attr("r", "2px")
  .attr("fill", "gold")
  .attr('cursor', 'pointer');
  });

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
