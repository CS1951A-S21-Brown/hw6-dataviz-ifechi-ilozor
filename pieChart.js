let svg1 = d3.select("#graph2")
    .append("svg")
    .attr("width", graph_2_width)
    .attr("height", graph_2_height)
    .append("g")
    .attr("transform", `translate(${(margin.left + 150)}, ${(margin.top + 150)})`);

let radius = Math.min(graph_2_width, graph_2_height) / 2 - margin.top;

function setRegionData(attr) {
    d3.csv("./data/video_games.csv").then(function(data1) {
        svg1.selectAll("*").remove();
        let region = document.getElementById("region").value;
        data1 = cleanData1(data1, region);

        let pie = d3.pie().value(function(d) { return d.value; });
        let data_ready = pie(d3.entries(data1));

        let color = d3.scaleOrdinal()
                      .domain(data_ready.map(function(d) { return d.key; }))
                      .range(["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf", "#f803fc"]);


        let arc = d3.arc().innerRadius(radius * 0.5).outerRadius(radius * 0.8);
        let outerArc = d3.arc().innerRadius(radius * 0.9).outerRadius(radius * 0.9);

        let slices = svg1.selectAll('allSlices').data(data_ready);
        slices.enter()
              .append('path')
              .attr("d", arc)
              .attr("fill", function(d) { return (color(d.data.key)); })
              .attr("stroke", "white")
              .style("stroke-width", "2px")
              .style("opacity", 0.7)
              .on("mouseover", function (d) {
                  d3.select("#tooltip")
                    .style("left", d3.event.pageX + "px")
                    .style("top", d3.event.pageY + "px")
                    .style("opacity", 1)
                    .style("cursor", "pointer");
                  d3.select("#genre-title")
                      .text(d.data.key)
                  d3.select("#genre-sales")
                      .text(d.data.value.toString());
              })
              .on("mousemove", function(d) {
                  d3.select("#tooltip").style("top", (d3.event.pageY - 10) + "px")
                  .style("left", (d3.event.pageX + 10) + "px")
                  .style("cursor", "pointer");
              })
              .on("mouseout", function () {
                  d3.select("#tooltip").style("opacity", 0)
                  .style("cursor", "auto");
              });

        let title1 = svg1.append("text")
            .attr("transform", `translate(${-340}, ${0})`)
            .style("text-anchor", "middle")
            .style("font-size", 15)
            .style("font-weight", 700);
        title1.text(`Video Game Genre Sales in ${regionParse(region)} (Hover Me!)`);
        slices.exit().remove();
    });
}

function cleanData1(data1, region) {
    let transformed_data = {};
    data1.map(function(row) {
      if (!(row.Genre in transformed_data)) {
        transformed_data[row.Genre] = parseInt(row[region]);
      }
      else {
        transformed_data[row.Genre] += parseInt(row[region]);
      }
    })
    return transformed_data;
}

function regionParse(region) {
    return `${region === 'NA_Sales' ? 'North America' :
              region === 'EU_Sales' ? 'Europe' :
              region === 'JP_Sales' ? 'Japan' :
              region === 'Other_Sales' ? 'Other' : 'the World'}`;
}

setRegionData("Genre");
