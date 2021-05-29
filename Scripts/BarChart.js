function init() {

    //width and Height
    var w = 800;
    var h = 400;
    var padding = 60; //padding to allow for an axis

    //declares various variables
    var dataset, xScale, yScale, xAxis, yAxis, area;

    var formatTime = d3.timeFormat("%Y");

    d3.csv("LinePlotData.csv", function (d) {
        return {
            year: new Date(d.year),
            site: d.Site_Name,
            numOfSites: +d.Number_of_Sites,
            total: parseInt(+d.Number_of_Items_Found),
            percentage: +d.Percentage_of_National_total_waste,
            average: +d.Average_number_of_items_per_site
        };

    }).then(function (data) {
        dataset = data;
        console.log(dataset[0]);

        barChart(dataset);
    });

    function barChart() {
        var color = d3.scaleOrdinal(d3.schemeCategory10);

        var unique = (value, index, self) => {
            return self.indexOf(value) === index
          };

        var sites = dataset.map(function (d) {return d.site}).filter(unique);
        console.log(sites);

        console.log(dataset.columns.slice(1));
        console.log(dataset.map(function (d) {return d.year.getFullYear().toString()}).filter(unique));

        var series = d3.stack()
                    .keys(dataset.map(function (d) {return d.year.getFullYear()}).filter(unique))
                    (dataset);

        console.log(series);
        console.log(series[0]);

        var xScale = d3.scaleBand()
            .domain(dataset.map(function (d) { return d.site }))
            .range([padding, w])
            .paddingInner(0.05);

        var yScale = d3.scaleLinear()
            .domain([0, d3.max(sites, function (d) { 
                console.log(d);
                total = 0;
                for (i = 0; i < dataset.length; i++) {
                    if (dataset[i].site == d) {
                        total = total + dataset[i].total;
                    }
                }
                return total;
            })]) //defines max possible input data value in the domain
            .range([h - padding, 0]);

        var xAxis = d3.axisBottom()
            .scale(xScale);

        var yAxis = d3.axisLeft()
            .scale(yScale);

        var svg = d3.select("#barChart")
            .append("svg")
            .attr("width", w + 2 * padding)
            .attr("height", h + padding)
            .append("g")
            .attr("transform", "translate(" + padding + " ,0)");

        var groups = svg.selectAll("g")
            .data(series)
            .enter()
            .append("g")
            .style("fill", "blue");

        groups.selectAll("rect")
            .data(function (d) { return d; })
            .enter()
            .append("rect")
            .attr("x", function (d) {
                return xScale(d.data.site);
            })
            .attr("y", function (d) {
                return yScale(d[1]);
            })
            .attr("width", xScale.bandwidth())
            .attr("height", function (d) {
                return yScale(d[0]) - yScale(d[1]);
            })
            .style("fill", "blue");

        //Creates the x-axis
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + (h - padding) + ")")
            .call(xAxis);

        svg.append("text")
            .attr("transform", "translate(" + (w/2) + " ," + (h) + ")")
            .text("Site Type");

        //Creates the y-axis
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + padding + ",0)")
            .call(yAxis);

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - (padding/2))
            .attr("x",0 - (h / 2))
            .attr("dy", "1em")
            .text("Total Waste");
    };
}

window.onload = init;