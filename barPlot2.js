let svg2 = d3.select("#graph3")
    .append("svg")
    .attr("width", graph_3_width)
    .attr("height", graph_3_height)
    .append("g")
    .attr("transform", `translate(${margin.left - 50}, ${margin.top})`);

let x2 = d3.scaleBand()
    .range([0, graph_3_width - margin.left - margin.right]).padding(0.4);

let y2 = d3.scaleLinear()
    .range([graph_3_height - margin.top - margin.bottom, 0]);

let countRef1 = svg2.append("g");
let x_axis_label = svg2.append("g");

svg2.append("text")
    .attr("transform", `translate(${(graph_3_width - margin.left - margin.right) / 2},
      ${(graph_3_height - margin.top - margin.bottom) + 35})`)
    .style("text-anchor", "middle")
    .text("Genre");

let y_axis_text2 = svg2.append("text")
    .attr("transform", `translate(-75, ${(graph_3_height - margin.top - margin.bottom) / 2})`)
    .style("text-anchor", "middle");

let title2 = svg2.append("text")
    .attr("transform", `translate(${(graph_3_width - margin.left - margin.right) / 2}, ${-10})`)
    .style("text-anchor", "middle")
    .style("font-size", 15)
    .style("font-weight", 700);

let color2 = d3.scaleOrdinal()
    .range(["#23171b", "#000f9c", "#4a58dd","#2f9df5","#27d7c4","#4df884",
            "#5f9e34","#dedd32","#ffa423","#f65f18","#ba2208","#d745ff"]);

function setData1() {
    d3.csv("./data/video_games.csv").then(function(data2) {
        data2 = d3.entries(cleanData2(data2));

        x2.domain(data2.map(function(d) { return d.key }));
        y2.domain([0, d3.max(data2, function(d) { return d.value[1]; })]);
        color2.domain(data2.map(function(d) { return d.key }));
        x_axis_label.attr("transform",
          `translate(0,${graph_3_height - margin.top - margin.bottom})`)
          .call(d3.axisBottom(x2).tickSize(0).tickPadding(10));

        let bars2 = svg2.selectAll("rect").data(data2);
        bars2.enter()
            .append("rect")
            .merge(bars2)
            .transition()
            .duration(800)
            .attr("fill", function(d) { return color2(d.key); })
            .attr("x", function(d) { return x2(d.key); })
            .attr("y", function(d) { return y2(d.value[1]); })
            .attr("height", function(d) { return graph_3_height - margin.top - margin.bottom - y2(d.value[1]); })
            .attr("width", x2.bandwidth() + 5);

        y_axis_text2.text("Sales in Millions");
        title2.text(`Top Video Game Publisher Per Genre (By Sales)`);

        let ranks1 = countRef1.selectAll("text").data(data2);
        ranks1.enter()
            .append("text")
            .merge(ranks1)
            .transition()
            .duration(800)
            .attr("x", function(d) { return x2(d.key) + 4; })
            .attr("y", function(d) { return y2(d.value[1]) - 10; })
            .style("text-anchor", "start")
            .text(function(d) { return d.value[1]; });

        svg2.selectAll("mydots").data(data2.map(function(d) { return d.key; }))
            .enter()
            .append("circle")
            .attr("cx", 550)
            .attr("cy", function(d,i) { return 100 + i*25; })
            .attr("r", 7)
            .style("fill", function(d){ return color2(d); })

        svg2.selectAll("mylabels").data(data2.map(function(d) { return d.value[0]; }))
            .enter()
            .append("text")
            .attr("x", 570)
            .attr("y", function(d,i) { return 100 + i*25; })
            .style("fill", function(d) { return color2(d); })
            .text(function(d) { return d; })
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")

        bars2.exit().remove();
        ranks1.exit().remove();
    });
}

function cleanData2(data2) {
  let transformed_data = {};
  data2.map(function(row) {
    if (!(row.Genre in transformed_data)) {
      transformed_data[row.Genre] = {};
      transformed_data[row.Genre][row.Publisher] = parseInt(row.Global_Sales);
    }
    else {
      if (!(row.Publisher in transformed_data[row.Genre])) {
        transformed_data[row.Genre][row.Publisher] = parseInt(row.Global_Sales);
      } else {
        transformed_data[row.Genre][row.Publisher] += parseInt(row.Global_Sales);
      }
    }
  })

  let final_data = {};
  for (const [genre, publisher_dict] of Object.entries(transformed_data)) {
    let top_publisher = "";
    let top_sales = 0.0;
    for (const [publisher, sales] of Object.entries(publisher_dict)) {
      if (sales > top_sales) {
        top_publisher = publisher;
        top_sales = sales;
      }
    }
    final_data[genre] = [top_publisher, top_sales];
  }
  return final_data;
}

setData1();
