const NUM_EXAMPLES = 10;

let svg = d3.select("#graph1")
    .append("svg")
    .attr("width", graph_1_width)
    .attr("height", graph_1_height)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

let x = d3.scaleLinear()
    .range([0, graph_1_width - margin.left - margin.right]);

let y = d3.scaleBand()
    .range([0, graph_1_height - margin.top - margin.bottom])
    .padding(0.1);

let countRef = svg.append("g");
let y_axis_label = svg.append("g");

svg.append("text")
    .attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2},
      ${(graph_1_height - margin.top - margin.bottom) + 15})`)
    .style("text-anchor", "middle")
    .text("Sales in Millions");

let y_axis_text = svg.append("text")
    .attr("transform", `translate(-175, ${(graph_1_height - margin.top - margin.bottom) / 2})`)
    .style("text-anchor", "middle");

let title = svg.append("text")
    .attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2}, ${-10})`)
    .style("text-anchor", "middle")
    .style("font-size", 15)
    .style("font-weight", 700);

let color = d3.scaleOrdinal()
    .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#81c2c3"), NUM_EXAMPLES));

function setData(attr) {
    d3.csv("./data/video_games.csv").then(function(data) {
        data = cleanData(data, function(a, b) {
            return parseInt(b.Global_Sales) - parseInt(a.Global_Sales)
        }, NUM_EXAMPLES);

        x.domain([0, d3.max(data, function(d) { return parseInt(d.Global_Sales); })]);
        y.domain(data.map(function(d) { return d[attr] }));
        color.domain(data.map(function(d) { return d[attr] }));
        y_axis_label.call(d3.axisLeft(y).tickSize(0).tickPadding(10));

        let bars = svg.selectAll("rect").data(data);
        bars.enter()
            .append("rect")
            .merge(bars)
            .transition()
            .duration(800)
            .attr("fill", function(d) { return color(d[attr]); })
            .attr("x", x(0))
            .attr("y", function(d) { return y(d[attr]); })
            .attr("width", function(d) { return x(parseInt(d.Global_Sales)); })
            .attr("height",  y.bandwidth());

        longest_title = d3.max(data, function(d) { return d.Name.length; })
        y_axis_text.attr("transform", `translate(${-50 - longest_title * 5}, ${(graph_1_height - margin.top - margin.bottom) / 2})`)
        y_axis_text.text("Game");
        title.text(`Top 10 Video Games of All Time (By Sales)`);

        let ranks = countRef.selectAll("text").data(data);
        ranks.enter()
            .append("text")
            .merge(ranks)
            .transition()
            .duration(800)
            .attr("x", function(d) { return x(parseInt(d.Global_Sales)) + 10; })
            .attr("y", function(d) { return y(d[attr]) + 10; })
            .style("text-anchor", "start")
            .text(function(d) { return parseInt(d.Global_Sales); });

        bars.exit().remove();
        ranks.exit().remove();
    });
}

function setYearData(attr) {
    d3.csv("./data/video_games.csv").then(function(data) {
        let year = document.getElementById("year").value;
        data = getYearData(data, year)
        data = cleanData(data, function(a, b) {
            return parseInt(b.Global_Sales) - parseInt(a.Global_Sales)
        }, NUM_EXAMPLES);

        x.domain([0, d3.max(data, function(d) { return parseInt(d.Global_Sales); })]);
        y.domain(data.map(function(d) { return d[attr] }));
        color.domain(data.map(function(d) { return d[attr] }));
        y_axis_label.call(d3.axisLeft(y).tickSize(0).tickPadding(10));

        let bars = svg.selectAll("rect").data(data);
        bars.enter()
            .append("rect")
            .merge(bars)
            .transition()
            .duration(800)
            .attr("fill", function(d) { return color(d[attr]) })
            .attr("x", x(0))
            .attr("y", function(d) { return y(d[attr]); })
            .attr("width", function(d) { return x(parseInt(d.Global_Sales)); })
            .attr("height",  y.bandwidth());

        longest_title = d3.max(data, function(d) { return d.Name.length; })
        y_axis_text.attr("transform", `translate(${-50 - longest_title * 5}, ${(graph_1_height - margin.top - margin.bottom) / 2})`)
        y_axis_text.text("Game");
        title.text(`Top 10 Video Games in ${year} (By Sales)`);

        let ranks = countRef.selectAll("text").data(data);
        ranks.enter()
            .append("text")
            .merge(ranks)
            .transition()
            .duration(800)
            .attr("x", function(d) { return x(parseInt(d.Global_Sales)) + 10; })
            .attr("y", function(d) { return y(d[attr]) + 10; })
            .style("text-anchor", "start")
            .text(function(d) { return parseInt(d.Global_Sales); });

        bars.exit().remove();
        ranks.exit().remove();
    });
}

function cleanData(data, comparator, numExamples) {
    return data.sort(comparator).slice(0, numExamples);
}

function getYearData(data, year) {
    return data.filter(function(d) { return d.Year == year });
}

setData("Name");
