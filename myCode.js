var w = 800,
  h = 400,
  marginLeft = 50,
  marginRight = 50,
  marginTop = 100,
  marginBottom = 100;

var tooltipDiv = d3.select("body").append("div")
  .attr("class", "tooltip")
  .attr("id", "tooltip")
  .style("opacity", 0);

var svg = d3.select("body")
  .append("svg")
  .attr("width", w + marginLeft + marginRight)
  .attr("height", h + marginTop + marginBottom);

d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
  .then(data => {
    data.forEach(d => {
      // Time: "38:36"
      // Place: 11
      // Seconds: 2316
      // Name: "Floyd Landis"
      // Year: 2006
      // Nationality: "USA"
      // Doping: "Stripped of 2006 Tour de France title"
      // URL: "https://en.wikipedia.org/wiki/Floyd_Landis_doping_case"
      var minSec = d.Time.split(':');
      d.Time = new Date(1978, 3, 14, 15, minSec[0], minSec[1]);
    });

    // Output Range!
    var xScale = d3.scaleLinear().range([0, w]);
    var yScale = d3.scaleTime().range([0, h]);
    // Input Data Domain!
    xScale.domain(d3.extent(data, d => d.Year)); // return [min, max] ie. [1994, 2015]
    yScale.domain(d3.extent(data, d => d.Time))

    svg.append("text")
      .attr("id", "title")
      .attr("x", (w / 2) + marginLeft)
      .attr("y", marginTop / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "50px")
      .text("Doping Allegations");

    svg.append("text")
      .attr("id", "legend")
      .attr("x", (w / 2) + marginLeft)
      .attr("y", marginTop)
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .text("In Professional Bicycle Racing");

    //Define X axis
    var xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"))
    //Create X axis
    svg.append("g")
      .attr("class", "axis")
      .attr('id', 'x-axis')
      .attr("transform", `translate(${marginLeft}, ${h + marginTop})`)
      .call(xAxis);

    //Define Y axis
    var yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));
    //Create Y axis
    svg.append("g")
      .attr("class", "axis")
      .attr('id', 'y-axis')
      .attr("transform", `translate(${marginLeft}, ${marginTop})`)
      .call(yAxis);

    svg.selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr('class', 'dot')
      .attr('data-xvalue', d => d.Year)
      .attr('data-yvalue', d => d.Time)
      .attr('cx', d => xScale(d.Year) + marginLeft)
      .attr('cy', d => yScale(d.Time) + marginTop)
      .attr('r', 5)
      .on('mouseover', d => {
        tooltipDiv.style('opacity', .9)
          .html(d.Name + '<br/>' + d.Year + ', ' + d.Time.getMinutes() + ':' + d.Time.getSeconds());
        tooltipDiv.style("left", (d3.event.pageX + 10))
        tooltipDiv.style("top", (d3.event.pageY - 50))
          .attr('data-year', d.Year)
      })
      .on('mouseout', d => {
        tooltipDiv.style('opacity', 0)
      })
  })

