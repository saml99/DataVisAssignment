function init() {

    //width and Height
    var w = 800;
    var h = 300;
    var padding = 60; //padding to allow for an axis

    //declares various variables
    var dataset, xScale, yScale, xAxis, yAxis, area;


    var formatTime = d3.timeFormat("%Y");

    d3.csv("WasteData.csv", function (d) {
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
        console.table(dataset, ["site", "total"]);

        //Defines the x-scale
        xScale = d3.scaleTime() //scaleTime is utilised as the value is a date, rather than a linear number
            .domain([
                d3.min(dataset, function (d) { return d.year; }), //finds the minimum date in the dataset
                d3.max(dataset, function (d) { return d.year; }) //find s the maximum date in the dataset
            ])
            .range([padding, w]);

        //defines the y-scale
        yScale = d3.scaleLinear()
            .domain([0, d3.max(dataset, function (d) { return d.total; })]) //defines max possible input data value in the domain
            .range([h - padding, 0]);

        //Defines the x-axis
        xAxis = d3.axisBottom()
            .scale(xScale)
            .ticks(10)
            .tickFormat(formatTime);

        //Defines the y-axis
        yAxis = d3.axisLeft()
            .scale(yScale)
            .ticks(10);

        line = d3.line()
          .x(function (d) { return xScale(d.year); })
          .y(function (d) { return yScale(d.total); });

        /*area = d3.area()
            .x(function (d) { return xScale(d.year); })

            .y0(function () { return yScale.range()[0]; }) //Specifys the bottom of the graph for the y-value
            .y1(function (d) { return yScale(d.total); }); //Specifys the top of the y-value with the actual data*/

        //creates the svg element
        var svg = d3.select("#chart")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

        svg.append("path")
            .datum(dataset.filter(function (d) {
                return d.site == "Parks"
            }))
            .attr("class", "line")
            .attr("d", line);

        //Creates the x-axis
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + (h - padding) + ")")
            .call(xAxis);

        //Creates the y-axis
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + padding + ",0)")
            .call(yAxis);
    });

}

window.onload = init;