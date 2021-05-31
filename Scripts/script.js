function init() {

    //width and Height
    var w = 850;
    var h = 500;
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

        lineChart(dataset);
    });

    function lineChart() {
        //Defines the x-scale
        xScale = d3.scaleTime() //scaleTime is utilised as the value is a date, rather than a linear number
            .domain([
                d3.min(dataset, function (d) { return d.year; }), //finds the minimum date in the dataset
                d3.max(dataset, function (d) { return d.year; }) //find s the maximum date in the dataset
            ])
            .range([padding, w - padding]);

        //defines the y-scale
        yScale = d3.scaleLinear()
            .domain([0, d3.max(dataset, function (d) { return d.total; })]) //defines max possible input data value in the domain
            .range([h - padding, padding]);

        //Defines the x-axis
        xAxis = d3.axisBottom()
            .scale(xScale)
            .ticks(10)
            .tickFormat(formatTime);

        //Defines the y-axis
        yAxis = d3.axisLeft()
            .scale(yScale)
            .ticks(10);

        initialline = d3.line()
            .x(function (d) { return xScale(d.year); })
            .y(function (d) { return yScale(0); });

        line = d3.line()
            .x(function (d) { return xScale(d.year); })
            .y(function (d) { return yScale(d.total); });

        /*initialarea = d3.area()
            .x(function (d) { return xScale(d.year); })
            .y0(function () { return yScale.range()[0]; })
            .y1(function () { return yScale.range()[0]; });

        area = d3.area()
            .x(function (d) { return xScale(d.year); })

            .y0(function () { return yScale.range()[0]; }) //Specifys the bottom of the graph for the y-value
            .y1(function (d) { return yScale(d.total); }); //Specifys the top of the y-value with the actual data*/

        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        //creates the svg element
        var svg = d3.select("#chart")
            .append("svg")
            .attr("width", w + padding)
            .attr("height", h + 20)
            .append("g")
            .attr("transform", "translate(" + padding + " ,0)");

        //Creates the x-axis
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + (h - padding) + ")")
            .style("stroke-width", "1.5")
            .style("font-size", "16px")
            .call(xAxis);

        svg.append("text")
            .attr("transform", "translate(" + (w / 2) + " ," + (h) + ")")
            .text("Year")
            .style("font-size", "22px");

        //Creates the y-axis
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + padding + ",0)")
            .style("stroke-width", "1.5")
            .call(yAxis)
            .style("font-size", "12px");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - (padding / 2))
            .attr("x", 0 - (h - 150))
            .attr("dy", "1em")
            .text("Waste Per Year")
            .style("font-size", "22px");

        var mouseover = function (event, d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html(d.total + "<br> individual items of waste were collected for the area of " + d.site)
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY) + "px");
        }

        var mouseout = function (d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        }

        function ParkFunction() {
            svg.append("path")
                .datum(dataset.filter(function (d) {
                    return d.site == "Parks"
                }))
                .attr("class", "area").attr("d", initialline)
                .style("fill", "none").style("fill-opacity", "0.1").style("stroke", "black").style("stroke-width", "0")
                .transition()
                .duration(1000)
                .attr("d", line).attr("id", "Parksid").style("fill", "none")
                .style("fill-opacity", "0.2").style("stroke", "#FF4136").style("stroke-width", "4");

            svg.selectAll("Circles")
                .data(dataset.filter(function (d) {
                    return d.site == "Parks"
                }))
                .enter()
                .append("circle")
                .attr("cx", function (d) { return xScale(d.year) })
                .attr("cy", function (d) { return yScale(d.total) })
                .attr("r", 4)
                .on("mouseover", mouseover)
                .on("mouseout", mouseout)
                .attr("id", "ParksCircle")
                .attr("fill", "#EEFBFB")
                .style("fill-opacity", "0")
                .attr("stroke", "none")
                .attr("stroke-width", "1")
                .attr("stroke-opacity", "0")
                .transition()
                .delay(1000)
                .attr("fill", "#EEFBFB")
                .style("fill-opacity", "1")
                .attr("stroke", "black")
                .attr("stroke-width", "2")
                .attr("stroke-opacity", "1");
        }

        function ParkRemove() {
            d3.select("#Parksid").remove();

            svg.append("path")
                .datum(dataset.filter(function (d) {
                    return d.site == "Parks"
                }))
                .attr("class", "area")
                .attr("d", line)
                .style("fill", "none")
                .style("fill-opacity", "0.2")
                .style("stroke", "#FF4136")
                .style("stroke-width", "4")
                .transition()
                .duration(1000)
                .attr("d", initialline)
                .style("fill", "none")
                .style("fill-opacity", "0")
                .style("stroke", "black")
                .style("stroke-width", "0");

            d3.selectAll("#ParksCircle").remove();

        }

        function RoadFunction() {
            svg.append("path")
                .datum(dataset.filter(function (d) {
                    return d.site == "Roadway"
                }))
                .attr("class", "area")
                .attr("d", initialline)
                .style("fill", "none")
                .style("fill-opacity", "0.1")
                .style("stroke", "black")
                .style("stroke-width", "0")
                .transition()
                .duration(1000)
                .attr("d", line)
                .attr("id", "Roadid")
                .style("fill", "none")
                .style("fill-opacity", "0.2")
                .style("stroke", "#3D9970")
                .style("stroke-width", "4");

            svg.selectAll("Circles")
                .data(dataset.filter(function (d) {
                    return d.site == "Roadway"
                }))
                .enter()
                .append("circle")
                .attr("cx", function (d) { return xScale(d.year) })
                .attr("cy", function (d) { return yScale(d.total) })
                .attr("r", 4)
                .on("mouseover", mouseover)
                .on("mouseout", mouseout)
                .attr("id", "RoadCircle")
                .attr("fill", "#EEFBFB")
                .style("fill-opacity", "0")
                .attr("stroke", "none")
                .attr("stroke-width", "1")
                .attr("stroke-opacity", "0")
                .transition()
                .delay(1000)
                .attr("fill", "#EEFBFB")
                .style("fill-opacity", "1")
                .attr("stroke", "black")
                .attr("stroke-width", "2")
                .attr("stroke-opacity", "1");

        }

        function RoadRemove() {
            d3.select("#Roadid").remove();

            svg.append("path")
                .datum(dataset.filter(function (d) {
                    return d.site == "Roadway"
                }))
                .attr("class", "area")
                .attr("d", line)
                .style("fill", "none")
                .style("fill-opacity", "0.2")
                .style("stroke", "#3D9970")
                .style("stroke-width", "4")
                .transition()
                .duration(1000)
                .attr("d", initialline)
                .style("fill", "none")
                .style("fill-opacity", "0")
                .style("stroke", "black")
                .style("stroke-width", "0");

            d3.selectAll("#RoadCircle").remove();
        }

        function WaterFunction() {
            svg.append("path")
                .datum(dataset.filter(function (d) {
                    return d.site == "Waterways"
                }))
                .attr("class", "area")
                .attr("d", initialline)
                .style("fill", "none")
                .style("fill-opacity", "0.1")
                .style("stroke", "black")
                .style("stroke-width", "0")
                .transition()
                .duration(1000)
                .attr("d", line)
                .attr("id", "Waterid")
                .style("fill", "none")
                .style("fill-opacity", "0.2")
                .style("stroke", "#0074D9")
                .style("stroke-width", "4");


            svg.selectAll("Circles")
                .data(dataset.filter(function (d) {
                    return d.site == "Waterways"
                }))
                .enter()
                .append("circle")
                .attr("cx", function (d) { return xScale(d.year) })
                .attr("cy", function (d) { return yScale(d.total) })
                .attr("r", 4)
                .on("mouseover", mouseover)
                .on("mouseout", mouseout)
                .attr("id", "WaterCircle")
                .attr("fill", "#EEFBFB")
                .style("fill-opacity", "0")
                .attr("stroke", "none")
                .attr("stroke-width", "1")
                .attr("stroke-opacity", "0")
                .transition()
                .delay(1000)
                .attr("fill", "#EEFBFB")
                .style("fill-opacity", "1")
                .attr("stroke", "black")
                .attr("stroke-width", "2")
                .attr("stroke-opacity", "1");
        }

        function WaterRemove() {
            d3.select("#Waterid").remove();

            svg.append("path")
                .datum(dataset.filter(function (d) {
                    return d.site == "Waterways"
                }))
                .attr("class", "area")
                .attr("d", line)
                .style("fill", "none")
                .style("fill-opacity", "0.2")
                .style("stroke", "#0074D9")
                .style("stroke-width", "4")
                .transition()
                .duration(1000)
                .attr("d", initialline)
                .style("fill", "none")
                .style("fill-opacity", "0")
                .style("stroke", "black")
                .style("stroke-width", "0");

            d3.selectAll("#WaterCircle").remove();
        }

        function BeachFunction() {
            svg.append("path")
                .datum(dataset.filter(function (d) {
                    return d.site == "Beach/Coastal"
                }))
                .attr("class", "area")
                .attr("d", initialline)
                .style("fill", "none")
                .style("fill-opacity", "0.1")
                .style("stroke", "black")
                .style("stroke-width", "0")
                .transition()
                .duration(1000)
                .attr("d", line)
                .attr("id", "Beachid")
                .style("fill", "none")
                .style("fill-opacity", "0.2")
                .style("stroke", "#FF851B")
                .style("stroke-width", "4");

            svg.selectAll("Circles")
                .data(dataset.filter(function (d) {
                    return d.site == "Beach/Coastal"
                }))
                .enter()
                .append("circle")
                .attr("cx", function (d) { return xScale(d.year) })
                .attr("cy", function (d) { return yScale(d.total) })
                .attr("r", 4)
                .on("mouseover", mouseover)
                .on("mouseout", mouseout)
                .attr("id", "BeachCircle")
                .attr("fill", "#EEFBFB")
                .style("fill-opacity", "0")
                .attr("stroke", "none")
                .attr("stroke-width", "1")
                .attr("stroke-opacity", "0")
                .transition()
                .delay(1000)
                .attr("fill", "#EEFBFB")
                .style("fill-opacity", "1")
                .attr("stroke", "black")
                .attr("stroke-width", "2")
                .attr("stroke-opacity", "1");
        }

        function BeachRemove() {

            d3.select("#Beachid").remove();

            svg.append("path")
                .datum(dataset.filter(function (d) {
                    return d.site == "Beach/Coastal"
                }))
                .attr("class", "area")
                .attr("d", line)
                .style("fill", "none")
                .style("fill-opacity", "0.2")
                .style("stroke", "#FF851B")
                .style("stroke-width", "4")
                .transition()
                .duration(1000)
                .attr("d", initialline)
                .style("fill", "none")
                .style("fill-opacity", "0")
                .style("stroke", "black")
                .style("stroke-width", "0");

            d3.selectAll("#BeachCircle").remove();
        }

        function BushFunction() {
            svg.append("path")
                .datum(dataset.filter(function (d) {
                    return d.site == "Bushland"
                }))
                .attr("class", "area")
                .attr("d", initialline)
                .style("fill", "none")
                .style("fill-opacity", "0.1")
                .style("stroke", "black")
                .style("stroke-width", "0")
                .transition()
                .duration(1000)
                .attr("d", line)
                .attr("id", "Bushid")
                .style("fill", "none")
                .style("fill-opacity", "0.2")
                .style("stroke", "#FEB236")
                .style("stroke-width", "4");

            svg.selectAll("Circles")
                .data(dataset.filter(function (d) {
                    return d.site == "Bushland"
                }))
                .enter()
                .append("circle")
                .attr("cx", function (d) { return xScale(d.year) })
                .attr("cy", function (d) { return yScale(d.total) })
                .attr("r", 4)
                .on("mouseover", mouseover)
                .on("mouseout", mouseout)
                .attr("id", "BushCircle")
                .attr("fill", "#EEFBFB")
                .style("fill-opacity", "0")
                .attr("stroke", "none")
                .attr("stroke-width", "1")
                .attr("stroke-opacity", "0")
                .transition()
                .delay(1000)
                .attr("fill", "#EEFBFB")
                .style("fill-opacity", "1")
                .attr("stroke", "black")
                .attr("stroke-width", "2")
                .attr("stroke-opacity", "1");
        }

        function BushRemove() {
            d3.select("#Bushid").remove();

            svg.append("path")
                .datum(dataset.filter(function (d) {
                    return d.site == "Bushland"
                }))
                .attr("class", "area")
                .attr("d", line)
                .style("fill", "none")
                .style("fill-opacity", "0.2")
                .style("stroke", "#FEB236")
                .style("stroke-width", "4")
                .transition()
                .duration(1000)
                .attr("d", initialline)
                .style("fill", "none")
                .style("fill-opacity", "0")
                .style("stroke", "black")
                .style("stroke-width", "0");

            d3.selectAll("#BushCircle").remove();
        }

        function SchoolFunction() {
            svg.append("path")
                .datum(dataset.filter(function (d) {
                    return d.site == "School Grounds"
                }))
                .attr("class", "area")
                .attr("d", initialline)
                .style("fill", "none")
                .style("fill-opacity", "0.1")
                .style("stroke", "black")
                .style("stroke-width", "0")
                .transition()
                .duration(1000)
                .attr("d", line)
                .attr("id", "Schoolid")
                .style("fill", "none")
                .style("fill-opacity", "0.2")
                .style("stroke", "#6b5b95")
                .style("stroke-width", "4");

            svg.selectAll("Circles")
                .data(dataset.filter(function (d) {
                    return d.site == "School Grounds"
                }))
                .enter()
                .append("circle")
                .attr("cx", function (d) { return xScale(d.year) })
                .attr("cy", function (d) { return yScale(d.total) })
                .attr("r", 4)
                .on("mouseover", mouseover)
                .on("mouseout", mouseout)
                .attr("id", "SchoolCircle")
                .attr("fill", "#EEFBFB")
                .style("fill-opacity", "0")
                .attr("stroke", "none")
                .attr("stroke-width", "1")
                .attr("stroke-opacity", "0")
                .transition()
                .delay(1000)
                .attr("fill", "#EEFBFB")
                .style("fill-opacity", "1")
                .attr("stroke", "black")
                .attr("stroke-width", "2")
                .attr("stroke-opacity", "1");
        }

        function SchoolRemove() {
            d3.select("#Schoolid").remove();

            svg.append("path")
                .datum(dataset.filter(function (d) {
                    return d.site == "School Grounds"
                }))
                .attr("class", "area")
                .attr("d", line)
                .style("fill", "none")
                .style("fill-opacity", "0.2")
                .style("stroke", "#6b5b95")
                .style("stroke-width", "4")
                .transition()
                .duration(1000)
                .attr("d", initialline)
                .style("fill", "none")
                .style("fill-opacity", "0")
                .style("stroke", "black")
                .style("stroke-width", "0");

            d3.selectAll("#SchoolCircle").remove();

        }

        function ShopsFunction() {
            svg.append("path")
                .datum(dataset.filter(function (d) {
                    return d.site == "Shops/malls"
                }))
                .attr("class", "area")
                .attr("d", initialline)
                .style("fill", "none")
                .style("fill-opacity", "0.1")
                .style("stroke", "black")
                .style("stroke-width", "0")
                .transition()
                .duration(1000)
                .attr("d", line)
                .attr("id", "Shopid")
                .style("fill", "none")
                .style("fill-opacity", "0.2")
                .style("stroke", "#001f3f")
                .style("stroke-width", "4");

            svg.selectAll("Circles")
                .data(dataset.filter(function (d) {
                    return d.site == "Shops/malls"
                }))
                .enter()
                .append("circle")
                .attr("cx", function (d) { return xScale(d.year) })
                .attr("cy", function (d) { return yScale(d.total) })
                .attr("r", 4)
                .on("mouseover", mouseover)
                .on("mouseout", mouseout)
                .attr("id", "ShopCircle")
                .attr("fill", "#EEFBFB")
                .style("fill-opacity", "0")
                .attr("stroke", "none")
                .attr("stroke-width", "1")
                .attr("stroke-opacity", "0")
                .transition()
                .delay(1000)
                .attr("fill", "#EEFBFB")
                .style("fill-opacity", "1")
                .attr("stroke", "black")
                .attr("stroke-width", "2")
                .attr("stroke-opacity", "1");

        }

        function ShopsRemove() {
            d3.select("#Shopid").remove();

            svg.append("path")
                .datum(dataset.filter(function (d) {
                    return d.site == "Shops/malls"
                }))
                .attr("class", "area")
                .attr("d", line)
                .style("fill", "none")
                .style("fill-opacity", "0.2")
                .style("stroke", "#001f3f")
                .style("stroke-width", "4")
                .transition()
                .duration(1000)
                .attr("d", initialline)
                .style("fill", "none")
                .style("fill-opacity", "0")
                .style("stroke", "black")
                .style("stroke-width", "0");

            d3.selectAll("#ShopCircle").remove();

        }

        function DiveFunction() {
            svg.append("path")
                .datum(dataset.filter(function (d) {
                    return d.site == "Dive Site"
                }))
                .attr("class", "area")
                .attr("d", initialline)
                .style("fill", "none")
                .style("fill-opacity", "0.1")
                .style("stroke", "black")
                .style("stroke-width", "0")
                .transition()
                .duration(1000)
                .attr("d", line)
                .attr("id", "Diveid")
                .style("fill", "none")
                .style("fill-opacity", "0.2")
                .style("stroke", "#d64161")
                .style("stroke-width", "4");

            svg.selectAll("Circles")
                .data(dataset.filter(function (d) {
                    return d.site == "Dive Site"
                }))
                .enter()
                .append("circle")
                .attr("cx", function (d) { return xScale(d.year) })
                .attr("cy", function (d) { return yScale(d.total) })
                .attr("r", 4)
                .on("mouseover", mouseover)
                .on("mouseout", mouseout)
                .attr("id", "DiveCircle")
                .attr("fill", "#EEFBFB")
                .style("fill-opacity", "0")
                .attr("stroke", "none")
                .attr("stroke-width", "1")
                .attr("stroke-opacity", "0")
                .transition()
                .delay(1000)
                .attr("fill", "#EEFBFB")
                .style("fill-opacity", "1")
                .attr("stroke", "black")
                .attr("stroke-width", "2")
                .attr("stroke-opacity", "1");

        }

        function DiveRemove() {
            d3.select("#Diveid").remove();

            svg.append("path")
                .datum(dataset.filter(function (d) {
                    return d.site == "Dive Site"
                }))
                .attr("class", "area")
                .attr("d", line)
                .style("fill", "none")
                .style("fill-opacity", "0.2")
                .style("stroke", "#d64161")
                .style("stroke-width", "4")
                .transition()
                .duration(1000)
                .attr("d", initialline)
                .style("fill", "none")
                .style("fill-opacity", "0")
                .style("stroke", "black")
                .style("stroke-width", "0");

            d3.selectAll("#DiveCircle").remove();

        }

        function OutDoorFunction() {
            svg.append("path")
                .datum(dataset.filter(function (d) {
                    return d.site == "Outdoor Transport"
                }))
                .attr("class", "area")
                .attr("d", initialline)
                .style("fill", "none")
                .style("fill-opacity", "0.1")
                .style("stroke", "black")
                .style("stroke-width", "0")
                .transition()
                .duration(1000)
                .attr("d", line)
                .attr("id", "Outdoorid")
                .style("fill", "none")
                .style("fill-opacity", "0.2")
                .style("stroke", "#3e4444")
                .style("stroke-width", "4");

            svg.selectAll("Circles")
                .data(dataset.filter(function (d) {
                    return d.site == "Outdoor Transport"
                }))
                .enter()
                .append("circle")
                .attr("cx", function (d) { return xScale(d.year) })
                .attr("cy", function (d) { return yScale(d.total) })
                .attr("r", 4)
                .on("mouseover", mouseover)
                .on("mouseout", mouseout)
                .attr("id", "OutdoorCircle")
                .attr("fill", "#EEFBFB")
                .style("fill-opacity", "0")
                .attr("stroke", "none")
                .attr("stroke-width", "1")
                .attr("stroke-opacity", "0")
                .transition()
                .delay(1000)
                .attr("fill", "#EEFBFB")
                .style("fill-opacity", "1")
                .attr("stroke", "black")
                .attr("stroke-width", "2")
                .attr("stroke-opacity", "1");

        }

        function OutdoorRemove() {
            d3.select("#Outdoorid").remove();
            svg.append("path")
                .datum(dataset.filter(function (d) {
                    return d.site == "Outdoor Transport"
                }))
                .attr("class", "area")
                .attr("d", line)
                .style("fill", "none")
                .style("fill-opacity", "0.2")
                .style("stroke", "#3e4444")
                .style("stroke-width", "4")
                .transition()
                .duration(1000)
                .attr("d", initialline)
                .style("fill", "none")
                .style("fill-opacity", "0")
                .style("stroke", "black")
                .style("stroke-width", "0");

            d3.selectAll("#OutdoorCircle").remove();

        }

        function OtherFunction() {
            svg.append("path")
                .datum(dataset.filter(function (d) {
                    return d.site == "Other"
                }))
                .attr("class", "area")
                .attr("d", initialline)
                .style("fill", "none")
                .style("fill-opacity", "0.1")
                .style("stroke", "black")
                .style("stroke-width", "0")
                .transition()
                .duration(1000)
                .attr("d", line)
                .attr("id", "Otherid")
                .style("fill", "none")
                .style("fill-opacity", "0.2")
                .style("stroke", "#405d27")
                .style("stroke-width", "4");

            svg.selectAll("Circles")
                .data(dataset.filter(function (d) {
                    return d.site == "Other"
                }))
                .enter()
                .append("circle")
                .attr("cx", function (d) { return xScale(d.year) })
                .attr("cy", function (d) { return yScale(d.total) })
                .attr("r", 4)
                .on("mouseover", mouseover)
                .on("mouseout", mouseout)
                .attr("id", "OtherCircle")
                .attr("fill", "#EEFBFB")
                .style("fill-opacity", "0")
                .attr("stroke", "none")
                .attr("stroke-width", "1")
                .attr("stroke-opacity", "0")
                .transition()
                .delay(1000)
                .attr("fill", "#EEFBFB")
                .style("fill-opacity", "1")
                .attr("stroke", "black")
                .attr("stroke-width", "2")
                .attr("stroke-opacity", "1");

        }

        function OtherRemove() {
            d3.select("#Otherid").remove();

            svg.append("path")
                .datum(dataset.filter(function (d) {
                    return d.site == "Other"
                }))
                .attr("class", "area")
                .attr("d", line)
                .style("fill", "none")
                .style("fill-opacity", "0.2")
                .style("stroke", "#405d27")
                .style("stroke-width", "4")
                .transition()
                .duration(1000)
                .attr("d", initialline)
                .style("fill", "none")
                .style("fill-opacity", "0")
                .style("stroke", "black")
                .style("stroke-width", "0");

            d3.selectAll("#OtherCircle").remove();

        }

        var parks = false, road = false, water = false, beach = false, bush = false, school = false, shops = false, dive = false, outdoor = false, other = false;

        d3.select("#Park").on("click", function () {
            if (parks == false) {
                ParkFunction();
                parks = true;
            } else {
                ParkRemove();
                parks = false;
            }
        });

        d3.select("#Road").on("click", function () {
            if (road == false) {
                RoadFunction();
                road = true;
            } else {
                RoadRemove();
                road = false;
            }
        });

        d3.select("#Water").on("click", function () {
            if (water == false) {
                WaterFunction();
                water = true;
            } else {
                WaterRemove();
                water = false;
            }
        });

        d3.select("#Beach").on("click", function () {
            if (beach == false) {
                BeachFunction();
                beach = true;
            } else {
                BeachRemove();
                beach = false;
            }
        });

        d3.select("#Bush").on("click", function () {
            if (bush == false) {
                BushFunction();
                bush = true;
            } else {
                BushRemove();
                bush = false;
            }
        });

        d3.select("#School").on("click", function () {
            if (school == false) {
                SchoolFunction();
                school = true;
            } else {
                SchoolRemove();
                school = false;
            }
        });

        d3.select("#Shops").on("click", function () {
            if (shops == false) {
                ShopsFunction();
                shops = true;
            } else {
                ShopsRemove();
                shops = false;
            }
        });

        d3.select("#Dive").on("click", function () {
            if (dive == false) {
                DiveFunction();
                dive = true;
            } else {
                DiveRemove();
                dive = false;
            }
        });

        d3.select("#Outdoor").on("click", function () {
            if (outdoor == false) {
                OutDoorFunction();
                outdoor = true;
            } else {
                OutdoorRemove();
                outdoor = false;
            }
        });

        d3.select("#Other").on("click", function () {
            if (other == false) {
                OtherFunction();
                other = true;
            } else {
                OtherRemove();
                other = false;
            }
        });

        d3.select("#shAll").on("click", function () {
            if (parks == false) {
                ParkFunction();
                parks = true;
            } if (road == false) {
                RoadFunction();
                road = true;
            } if (water == false) {
                WaterFunction();
                water = true;
            } if (beach == false) {
                BeachFunction();
                beach = true;
            } if (bush == false) {
                BushFunction();
                bush = true;
            } if (school == false) {
                SchoolFunction();
                school = true;
            } if (shops == false) {
                ShopsFunction();
                shops = true;
            } if (dive == false) {
                DiveFunction();
                dive = true
            } if (outdoor == false) {
                OutDoorFunction();
                outdoor = true;
            } if (other == false) {
                OtherFunction();
                other = true;
            } else {
            }
        });

        d3.select("#clear").on("click", function () {
            if (parks == true) {
                ParkRemove();
                parks = false;
            } if (road == true) {
                RoadRemove();
                road = false;
            } if (water == true) {
                WaterRemove();
                water = false;
            } if (beach == true) {
                BeachRemove();
                beach = false;
            } if (bush == true) {
                BushRemove();
                bush = false;
            } if (school == true) {
                SchoolRemove();
                school = false;
            } if (shops == true) {
                ShopsRemove();
                shops = false;
            } if (dive == true) {
                DiveRemove();
                dive = false;
            } if (outdoor == true) {
                OutdoorRemove();
                outdoor = false;
            } if (other == true) {
                OtherRemove();
                other = false;
            } else {

            }
        });
    };

    var BarChartDataset;

    d3.csv("BarChartData.csv", function (d, i, columns) {
        for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
        d.total = t;
        return d;
    }).then(function (data) {
        BarChartDataset = data;
        console.log(BarChartDataset);
        barChart(BarChartDataset);
    });

    function barChart() {
        var color = d3.scaleOrdinal(d3.schemeCategory10);

        var series = d3.stack()
            .keys(BarChartDataset.columns.slice(1))
            (BarChartDataset);

        console.log(series);

        var xScale = d3.scaleBand()
            .range([padding, w])
            .paddingInner(0.05);

        xScale.domain(BarChartDataset.map(function (d) { return d.site }));

        var yScale = d3.scaleLinear()
            .domain([0, d3.max(BarChartDataset, function (d) { return d.total; })]) //defines max possible input data value in the domain
            .range([h - padding, 0]);

        var xAxis = d3.axisBottom()
            .scale(xScale);

        var yAxis = d3.axisLeft()
            .scale(yScale);

        var svg = d3.select("#barChart")
            .append("svg")
            .attr("width", w + 2 * padding)
            .attr("height", h + 2 * padding)
            .append("g")
            .attr("transform", "translate(" + padding + ", " + padding + ")");

        var groups = svg.selectAll("g")
            .data(series)
            .enter()
            .append("g")
            .style("fill", function (d) {
                return color(d.key);
            });

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
            .attr("class", "bar")
            on("mouseover", function() { tooltip.style("display", null); })
            .on("mouseout", function() { tooltip.style("display", "none"); })
            .on("mousemove", function(d) {
                var xPosition = d3.mouse(this)[0] - 15;
                var yPosition = d3.mouse(this)[1] - 25;
                tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
                tooltip.select("text").text(d[1]);
            });

        console.log(series);

        var text = svg.selectAll("text")
            .data(BarChartDataset, function (d) { return d.site; });

        text.enter()
            .append("text")
            .attr("text-anchor", "middle")
            .text(function (d) {
                return d.total;
            })
            .attr("x", function (d) {
                return xScale(d.site) + xScale.bandwidth() / 2;
            })
            .attr("y", function (d) {
                return yScale(d.total) - 5;
            })
            .attr("font-size", "10px");

        //Creates the x-axis
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + (h - padding) + ")")
            .call(xAxis)
            .style("stroke-width", "1.5")
            .style("font-size", "11px");

        svg.append("text")
            .attr("transform", "translate(" + (w / 2) + " ," + (h) + ")")
            .text("Site Type")
            .style("font-size", "22px");

        //Creates the y-axis
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + padding + ",0)")
            .call(yAxis)
            .style("stroke-width", "1.5")
            .style("font-size", "12px");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - (padding / 2))
            .attr("x", 0 - (h / 2))
            .attr("dy", "1em")
            .text("Total Waste")
            .style("font-size", "22px");

        var legend = svg.append("g")
            .attr("text-anchor", "end")
            .selectAll("g")
            .data(BarChartDataset.columns.slice(1))
            .enter()
            .append("g")
            .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("rect")
            .attr("x", w - 20)
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", color);

        legend.append("text")
            .attr("x", w - 25)
            .attr("y", 10)
            .attr("dy", "0.32em")
            .text(function (d) { return d; });

        var tooltip = svg.append("g")
            .attr("class", "tooltip")
            .style("display", "none");
              
        tooltip.append("rect")
            .attr("width", 30)
            .attr("height", 20)
            .attr("fill", "white")
            .style("opacity", 0.5);
          
        tooltip.append("text")
            .attr("x", 15)
            .attr("dy", "1.2em")
            .style("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("font-weight", "bold");

    };
}

window.onload = init;