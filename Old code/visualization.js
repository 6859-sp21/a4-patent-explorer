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

//calls tooltip class css
var tooltip = d3.select("body").append("div")
                .attr("class", "tooltip") //class was defined above to determine how tooltips appear
                .style("opacity", 0);

// Tracks clicking
var isClicked = false;

// specify what happens when when we zoom
function zoomed() {
  transform = d3.event.transform
  //console.log(transform)
  map.attr("transform", transform);
  map.selectAll("circle")
  .attr("r", markerRadius);
    // .attr("r", markerRadius/transform.k); // keep marker size constant on screen

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
  .attr('id', 'ocean')

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
// d3.csv("Patent_5yrs_all.csv")
//   .then(function(data) {
//     var latlonglist = [];
//     // for (var i=0; i < data.length; i++) {
//     for (var i=0; i < 1000; i++) {
//       latlonglist.push([data[i].longitude, data[i].latitude, data[i].year, data[i].city,data[i].state,data[i].country,data[i].organization]);
//   }

d3.csv("Patent_5yrs_all.csv")
  .then(function(data) {
        map.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        //.filter(function(d){ return d[6] === selection})
        .filter(function(d){ return d.year === "2018"; console.log(d.length)})
        .attr("cx", function (d) { return projection(d).longitude; })
        .attr("cy", function (d) { return projection(d).latitude; })
        .attr("r", markerRadius)
        .attr("fill", "gold")
        .attr('class', 'marker')
        .attr('cursor', 'pointer')
        .style('opacity', 0.6);
      });

  // d3.csv("Patent_5yrs_all.csv")
  //   .then(function(data) {
  //     d3.select("#range1").on("input", function(){
  //       map.selectAll('circle')
  //       .data(data)
  //       .enter()
  //       .append("circle")
  //       .filter(function(d){
  //         return d.date === d3.select("#range1").property("value")})
  //       .attr("r", markerRadius)
  //       .attr("fill", "gold")
  //       .attr('class', 'marker')
  //       .attr('cursor', 'pointer')
  //     })
  //   });


//   .on("mouseover", function(d, i) {
//     tooltip.transition()
//       .duration(500) //animation technique makes the tooltips visible
//       .style("opacity", .9);
//     tooltip.html("Location: " + (d)[3] +" "+(d)[4] +", "+(d)[5] + "<br/> Company: " +(d)[6] + "<br/> Year: " +(d)[2])
//       .style("left", (d3.event.pageX) + "px")
//       .style("top", (d3.event.pageY - 28) + "px");
//       //console.log( "Longitude " + (d)[0] + "<br/> Latitude: " +(d)[1])
//
//      d3.select(this) //select the point and change its properties on mouseover
//        .transition()
//        .duration(300)
//        .attr("fill", "white")
//        .style("opacity", 1)
//        // .attr("r", (5 * markerRadius/transform.k))
//     })
//
//   .on("mouseout", function(event, d) {
//     tooltip.transition()
//       .duration(300)
//       .style("opacity", 0);
//
//     d3.select(this)
//       .transition()
//       .attr("r", markerRadius)
//       .style("opacity", 0.6)
//       // .attr("r", markerRadius/transform.k)
//
//     if(isClicked === false){
//       d3.select(this) //restore point to original value
//          .transition()
//          .duration(300)
//          .attr("fill", "gold")
//          //.attr("r", markerRadius)
//          .attr("r", markerRadius)
//          // .attr("r", markerRadius/transform.k)
//     }
//   })
//
//   // highlight related companies
//
//   .on("click", function(d,i){
//     isClicked = true;
//     selection = d[2];
//     d3.selectAll(d[2]==="2018").style("fill-opacity", 1)
//     .attr("r", 5*markerRadius);
//     d3.select(this)
//     .transition()
//     .attr('fill',"white")
//     .attr("r", markerRadius/transform.k)
//     .style('opacity', 1)
//     //console.log(selection)
//   });
//
// console.log(selection)
//
//   });
//
// // d3.select("#range1").on("input", function(){
// //
// //   svg.selectAll('circle')
// //   .transition()
// //   .attr("fill", "gold")
// //   .filter(function(d){
// //
// //     return d[2] === d3.select("#range1").property("value")})
// //   // .attr("fill", "red")
// // });
// // add text
//
var showText = true;
// title = svg.append('text')
//   .text('Patent Explorer')
//   .attr('x', 30)
//   .attr('y', 60)
//   .attr('id', 'title')
//
// description = svg.append('text')
//   .attr('x', 30)
//   .attr('y', 90)
// description.append('tspan')
//     .text('Where do good ideas come from?')
//     .attr('dy', 7)
//     .attr('x', 30)
// description.append('tspan')
//     .text('Explore patents filed around the world:')
//     .attr('dy', 30)
//     .attr('x', 30)
// description.append('tspan')
//     .text('scroll')
//     .attr('dy', 30)
//     .attr('x', 50)
//     .attr('class', 'action')
// description.append('tspan')
//     .text(' to zoom')
// description.append('tspan')
//     .text('click and drag')
//     .attr('dy', 30)
//     .attr('x', 50)
//     .attr('class', 'action')
// description.append('tspan')
//     .text(' to pan')
// description.append('tspan')
//     .text('hover')
//     .attr('dy', 30)
//     .attr('x', 50)
//     .attr('class', 'action')
// description.append('tspan')
//     .text(' to explore data')
//
// sourceInfo = svg.append('text')
//   .text('Data source: patentsview.org (2018)')
//   .attr('x', 15)
//   .attr('y', height-20)
//   .attr('id', 'source')
//
//
// //////////////////////////////////////////////////////////////////////////////////////////////
// // var pointMarkers = svg.append( "g" );
//
// // pointMarkers.selectAll( "path" )
// //   .data( rodents_json.features )
// //   .enter()
// //   .append( "path" )
// //   .attr( "fill", "#900" )
// //   .attr( "stroke", "#999" )
// //   .attr( "d", geoPath );
//
// // function zoomed({transform}) {
// //   console.log(transform)
// //   map.attr("transform", transform);
// //   map.selectAll("circle")
// //     .attr("r", markerRadius/transform.k); // keep marker size constant on screen
// // }
//
//
// // function zoomed() {
// //   projection.translate(d3.event.translate).scale(d3.event.scale); // modify the projection
// //   g.selectAll("path").attr("d", path);   // update the paths
// //
// //   // update the circles/points:
// //   svg.selectAll("circle")
// //     .attr("cx", function (d) { return projection(d)[0]; })
// //     .attr("cy", function (d) { return projection(d)[1]; });
// // }
//
//
//   // function main() {
//   //   var margin = { top:50, left: 50, right: 50, bottom: 50},
//   //     height = 400 - margin.top - margin.bottom,
//   //     width = 800 - margin.left - margin.right;
//   //
//   //   var svg = d3.select("#map")
//   //         .append("svg")
//   //         .attr("height", height + margin.top + margin.bottom)
//   //         .attr("width", width + margin.left + margin.right)
//   //         .append("g")
//   //         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//   //
//   //   d3.json("world.topojson", function(data) {
//   //     console.log(data);
//   //   });
//   //
//   //   d3.queue()
//   //     .defer(d3.json, "world.topojson")
//   //     .await(ready);
//   //
//   //   function ready (error, data) {
//   //     // console.log(data)
//   //
//   //   }
//   //
//   // }
//   //
//   // main();
