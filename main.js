// Global function called when select element is changed
function onCategoryChanged() {
    var select = d3.select('#categorySelect').node();
    // Get current value of select element
    var category = select.options[select.selectedIndex].value;
    // Update chart with the selected category of letters
    updateChart(category);
}
var movieEnter;
var svg = d3.select('svg');

//zoom
var zoom = d3.zoom().filter(() => !d3.event.button)
    .scaleExtent([.5, 500])
    .extent([[0, 0], [1400, 700]])
    .on("zoom", zoomer);

function zoomer() {
    // create new scale ojects based on event
    var new_xScale = d3.event.transform.rescaleX(budgetScale);
    var new_yScale = d3.event.transform.rescaleY(grossScale);
    // update axes
    gX.call(xAxis.scale(new_xScale));
    gY.call(yAxis.scale(new_yScale));
    movieEnter
     .data(movies)
     .attr('transform', function(d) { return 'translate(' + (new_xScale(d.budget) + 50) + ',' + new_yScale(d.gross) + ')'});
}

var clip = svg.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", 1295)
    .attr("height", 645)
    .attr("x", 105)
    .attr("y", 0);

//color
var color = "#f58231";

// Tooltip
var Tooltip = d3.select('body')
.append("div")
.style("opacity", 0)
.attr("class", "tooltip")
.style("background-color", "white")
.style("border", "solid")
.style("border-width", "2px")
.style("border-radius", "5px")
.style("padding", "5px")

// Three function that change the tooltip when user hover / move / leave a cell
var mouseover = function(d) {
Tooltip
  .style("opacity", 1)
  d3.select(this)
  .style("stroke", "black")
  .style("opacity", 1);
}
var mousemove = function(d) {
    var coordinates= d3.mouse(this.parentNode);
    var x = coordinates[0];
    var y = coordinates[1];

    var score = parseFloat(d.imdb_score).toFixed(1);

Tooltip
  .html("<h1>" + d.movie_title + "</h1>" +
        "<p> Language: " + d.language + "</p>" +
        "<p> Director: " + d.director_name + "</p>" + 
        "<p> Notable Actors: " + d.actor_1_name + ", " + d.actor_2_name + ", " + d.actor_3_name + "</p>" + 
        "<p> IMDB Score: </p>" +
        "<div class='rings'>" + "<div class='percent1'>" +
        "<svg class= 'circholder' style='height: 200px'>" +
         "<circle class='circ' cx='70' cy='70' r='70'></circle>" +
         "<circle class='circ' cx='70' cy='70' r='70'></circle>" +
        "</svg>" + 
        "<div class='number'>" +
        "<h2>" + (score) + " <span> / 10.0</span></h2>" +
        "</div>" +
        "</div>" +  
        "</div>") 
  .style("left", (x + 35) + "px")
  .style("top", (y) + "px")
  .style("stroke-dashoffset", "calc(440 - (440 *" + score + ") / 10)")
  .style("stroke", color);
}
var mouseleave = function(d) {
Tooltip
  .style("opacity", 0)
  .style("left", (-387) + "px")
  .style("top", (-389) + "px")
d3.select(this)
  .style("stroke", "none")
  .style("opacity", 0.8);
}

//global vars
var movies;

//chart scales
var budgetScale = d3.scaleLinear()
    .domain([0,600000000]).range([60,1300]);

var grossScale = d3.scaleLinear()
    .domain([0,700000000]).range([640,20]);

function scaleBudget(budget) {
    return budgetScale(budget);
}
    
function scaleGross(gross) {
    return grossScale(gross);
}

var xAxis = d3.axisBottom(budgetScale);

var yAxis = d3.axisLeft(grossScale);

var gX = svg.append('g').attr('class', 'x axis')
    .attr('transform', 'translate(50,645)')
    .call(xAxis);

svg.append('text')
    .attr('class', 'label')
    .attr('transform','translate(730,685)')
    .style('font-size', '14')
    .text('Movie Budget ($)');

var gY = svg.append('g').attr('class', 'y axis')
    .attr('transform', 'translate(105,0)')
    .call(yAxis);

svg.append('text')
    .attr('class', 'label')
    .attr('transform','translate(15,300) rotate(90)')
    .style('font-size', '14')
    .text('Movie Grossing ($)');

svg.append('text')
    .attr('class', 'title')
    .attr('transform','translate(730,30)')
    .style('font-size', '20')
    .style('font-weight', 'bold')
    .text('What Kind of Movies Make Money?');


d3.csv('movies.csv').then(function(dataset) {
    // Create global variables here and intialize the chart
    movies = dataset;

    // Update the chart for all letters to initialize
    updateChart('all-genres');
});


function updateChart(filterKey) {
    // Create a filtered array of letters based on the filterKey
    var filteredMovies = movies.filter(function(d){
        if (filterKey === 'all-genres') {

            return d;
        } else if (d.genres.includes(filterKey)) {
            return d;
        }
    });

    // picking colors
    if (filterKey === "all-genres") {
        color = "#f58231";
    } else if (filterKey === "Action") {
        color = "#e6194b";
    } else if (filterKey === "Adventure") {
        color = "#42d4f4";
    } else if (filterKey === "Animation") {
        color = "#ffe119";
    } else if (filterKey === "Biography") {
        color = "#469990";
    } else if (filterKey === "Comedy") {
        color = "#f032e6";
    } else if (filterKey === "Crime") {
        color = "#a9a9a9";
    } else if (filterKey === "Documentary") {
        color = "#9A6324";
    } else if (filterKey === "Drama") {
        color = "#dcbeff";
    } else if (filterKey === "Family") {
        color = "#ffd8b1";
    } else if (filterKey === "Fantasy") {
        color = "#911eb4";
    } else if (filterKey === "Horror") {
        color = "#000000";
    } else if (filterKey === "Music") {
        color = "#3cb44b";
    } else if (filterKey === "Musical") {
        color = "#cccc00";
    } else if (filterKey === "Mystery") {
        color = "#a9a9a9";
    } else if (filterKey === "Romance") {
        color = "#fabed4";
    } else if (filterKey === "Sci-Fi") {
        color = "#bfef45";
    } else if (filterKey === "Sport") {
        color = "#469990";
    } else if (filterKey === "Thriller") {
        color = "#4363d8";
    } else if (filterKey === "War") {
        color = "#800000";
    } else if (filterKey === "Western") {
        color = "#000075";
    }

    svg.append("rect")
        .attr('transform', 'translate(105,0)')
        .attr("width", 1295)
        .attr("height", 650)
        .style("fill", "none")
        .style("pointer-events", "all")
        .call(zoom);

    // **** Draw and Update your chart here ****
    d3.selectAll('.movie').remove();
    
    // Create the scatter variable: where both the circles and the brush take place
    var mov = svg.append('g')
        .attr("clip-path", "url(#clip)");

    moviez = mov.selectAll('.movie')
        .data(filteredMovies, function(d){
            return d;
        });

    movieEnter = moviez.enter()
        .append('g')
        .attr('class', 'movie')
        .attr('transform', function(d) { return 'translate(' + (scaleBudget(d.budget) + 50) + ',' + scaleGross(d.gross) + ')'})
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);
    
    var circle = movieEnter.append('circle')
        .attr('r', 0);
        
    
    circle
        .transition()
        .duration(500)
        .delay(100)
        .style("fill",color)
        .attr("r",5);

    moviez.exit().remove();

}

// Remember code outside of the data callback function will run before the data loads