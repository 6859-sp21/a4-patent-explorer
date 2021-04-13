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
    var id = 0;
    data.forEach(function(d) {
      d.id = id;
      id = id + 1;
    })

    var displayCircles = function(d) {
      var circles = map.selectAll("circle")
                    .data(d.slice(0,2000), function(d) { return d.id })
                    .enter()
                    .append("circle")
                      .attr("cx", function (d) { return projection([d.longitude, d.latitude])[0] })
                      .attr("cy", function (d) { return projection([d.longitude, d.latitude])[1] })
                      .attr("r", markerRadius)
                      .attr("fill", "gold")
                      .attr('class', 'marker')
                      .attr('cursor', 'pointer')
                    .style('opacity', 0.6);

        circles.transition()
                .delay(400)
                .duration(400);

        circles.on("mouseover", function(d, i) {
              tooltip.transition()
                .duration(500) //animation technique makes the tooltips visible
                .style("opacity", .9);
              tooltip.html("Location: " + d.city +" "+ d.state +", "+ d.country + "<br/> Company: " + d.organization)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
                //console.log( "Longitude " + (d)[0] + "<br/> Latitude: " +(d)[1])

               d3.select(this) //select the point and change its properties on mouseover
                 .transition()
                 .duration(300)
                 .attr("fill", "white")
                 .style("opacity", 1)
                 // .attr("r", (5 * markerRadius/transform.k))
              });

        circles.on("mouseout", function(event, d) {
          tooltip.transition()
            .duration(300)
            .style("opacity", 0);

          d3.select(this)
            .transition()
            .attr("r", markerRadius)
            .style("opacity", 0.6)
            // .attr("r", markerRadius/transform.k)

          if(isClicked === false){
            d3.select(this) //restore point to original value
               .transition()
               .duration(300)
               .attr("fill", "gold")
               //.attr("r", markerRadius)
               .attr("r", markerRadius)
               // .attr("r", markerRadius/transform.k)
          }
        });

        };

    var removeCircles = function(d) {
        map.selectAll("circle")
            .data(d, function(d) { return d.id })
            .exit()
            .transition()
              .duration(400)
              .attr("r", 1)
            .remove();
    }

    displayCircles(data.filter( function(d) { return +d.year === 2015 }));
    var orgList = [...new Set(data.filter( 
      function(d) { return +d.year === 2015 }).map(x=>x.organization))] 


    d3.select("#range1").on("change", function() {
        var selectedValue = this.value;
        var newData = data.filter( function(d) { return +d.year === +selectedValue });
        displayCircles(newData);
        removeCircles(newData);

        // restrict the searchable companies to those with displayed patents
        orgList = [...new Set(newData.map(x=>x.organization))] 
        }
      );

  // text search bar
  searchBar = new autoComplete({
        selector: "#searchBar",
        placeHolder: "Type a company name...",
        data: {
            src: orgList,
        },
        onSelection: (feedback) => {
          selectedOrg = feedback.selection.value

          // get that organization's patents
          map.selectAll("circle")
              .filter(function(d, i) {return d.organization === selectedOrg;})
              .attr("fill", "red")
        },
        resultsList: {
            noResults: (list, query) => {
                const message = document.createElement("li");
                message.setAttribute("class", "autoComplete_result");
                message.innerHTML = '<span>no results</span>';
                list.appendChild(message);
            },
        },
        resultItem: {
            highlight: {
                render: true
            }
        }
  });




});





var showText = true;
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
    .text('start')
    .attr('dy', 30)
    .attr('x', 50)
    .attr('class', 'action')
description.append('tspan')
    .text(' by choosing the year')
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
