function init() {

    //width and Height
    var w = 800;
    var h = 400;
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
        console.log(dataset[0]);

        lineChart(dataset);
        barChart(dataset);
    });

    function lineChart() {
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
            .attr("width", w)
            .attr("height", h);

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

        var mouseover = function (event, d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html(d.total)
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
        }

        var mouseout = function (d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        }


        var parks = false, road = false, water = false, beach = false, bush = false, school = false, shops = false, dive = false, outdoor = false, other = false;

        d3.select("#Park").on("click", function () {

            if (parks == false) {
                svg.append("path")
                    .datum(dataset.filter(function (d) {
                        return d.site == "Parks"
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
                    .attr("id", "Parksid")
                    .style("fill", "none")
                    .style("fill-opacity", "0.2")
                    .style("stroke", "red")
                    .style("stroke-width", "2");

                parks = true;

                svg.selectAll("Circles")
                    .data(dataset.filter(function (d) {
                        return d.site == "Parks"
                    }))
                    .enter()
                    .append("circle")
                    .attr("cx", function (d) { return xScale(d.year) })
                    .attr("cy", function (d) { return yScale(d.total) })
                    .attr("r", 3)
                    .on("mouseover", mouseover)
                    .on("mouseout", mouseout)
                    .attr("id", "ParksCircle")
                    .attr("fill", "Black")
                    .style("fill-opacity", "0")
                    .attr("stroke", "none")
                    .transition()
                    .delay(1000)
                    .attr("fill", "Black")
                    .style("fill-opacity", "1")
                    .attr("stroke", "none");


            } else {
                d3.select("#Parksid").remove();

                svg.append("path")
                    .datum(dataset.filter(function (d) {
                        return d.site == "Parks"
                    }))
                    .attr("class", "area")
                    .attr("d", line)
                    .style("fill", "none")
                    .style("fill-opacity", "0.2")
                    .style("stroke", "red")
                    .style("stroke-width", "2")
                    .transition()
                    .duration(1000)
                    .attr("d", initialline)
                    .style("fill", "none")
                    .style("fill-opacity", "0")
                    .style("stroke", "black")
                    .style("stroke-width", "0");


                d3.selectAll("#ParksCircle").remove();

                parks = false;
            }

        });

        d3.select("#Road").on("click", function () {

            if (road == false) {
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
                    .style("stroke", "green")
                    .style("stroke-width", "2");

                road = true;

                svg.selectAll("Circles")
                    .data(dataset.filter(function (d) {
                        return d.site == "Roadway"
                    }))
                    .enter()
                    .append("circle")
                    .attr("cx", function (d) { return xScale(d.year) })
                    .attr("cy", function (d) { return yScale(d.total) })
                    .attr("r", 3)
                    .on("mouseover", mouseover)
                    .on("mouseout", mouseout)
                    .attr("id", "RoadCircle")
                    .attr("fill", "Black")
                    .style("fill-opacity", "0")
                    .attr("stroke", "none")
                    .transition()
                    .delay(1000)
                    .attr("fill", "Black")
                    .style("fill-opacity", "1")
                    .attr("stroke", "none");

            } else {
                d3.select("#Roadid").remove();

                svg.append("path")
                    .datum(dataset.filter(function (d) {
                        return d.site == "Roadway"
                    }))
                    .attr("class", "area")
                    .attr("d", line)
                    .style("fill", "none")
                    .style("fill-opacity", "0.2")
                    .style("stroke", "green")
                    .style("stroke-width", "2")
                    .transition()
                    .duration(1000)
                    .attr("d", initialline)
                    .style("fill", "none")
                    .style("fill-opacity", "0")
                    .style("stroke", "black")
                    .style("stroke-width", "0");

                d3.selectAll("#RoadCircle").remove();

                road = false;

            }

        });

        d3.select("#Water").on("click", function () {

            if (water == false) {
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
                    .style("stroke", "blue")
                    .style("stroke-width", "2");

                water = true;

                svg.selectAll("Circles")
                    .data(dataset.filter(function (d) {
                        return d.site == "Waterways"
                    }))
                    .enter()
                    .append("circle")
                    .attr("cx", function (d) { return xScale(d.year) })
                    .attr("cy", function (d) { return yScale(d.total) })
                    .attr("r", 3)
                    .on("mouseover", mouseover)
                    .on("mouseout", mouseout)
                    .attr("id", "WaterCircle")
                    .attr("fill", "Black")
                    .style("fill-opacity", "0")
                    .attr("stroke", "none")
                    .transition()
                    .delay(1000)
                    .attr("fill", "Black")
                    .style("fill-opacity", "1")
                    .attr("stroke", "none");

            } else {
                d3.select("#Waterid").remove();

                svg.append("path")
                    .datum(dataset.filter(function (d) {
                        return d.site == "Waterways"
                    }))
                    .attr("class", "area")
                    .attr("d", line)
                    .style("fill", "none")
                    .style("fill-opacity", "0.2")
                    .style("stroke", "blue")
                    .style("stroke-width", "2")
                    .transition()
                    .duration(1000)
                    .attr("d", initialline)
                    .style("fill", "none")
                    .style("fill-opacity", "0")
                    .style("stroke", "black")
                    .style("stroke-width", "0");

                d3.selectAll("#WaterCircle").remove();

                water = false;
            }

        });

        d3.select("#Beach").on("click", function () {

            if (beach == false) {
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
                    .style("stroke", "orange")
                    .style("stroke-width", "2");

                beach = true;

                svg.selectAll("Circles")
                    .data(dataset.filter(function (d) {
                        return d.site == "Beach/Coastal"
                    }))
                    .enter()
                    .append("circle")
                    .attr("cx", function (d) { return xScale(d.year) })
                    .attr("cy", function (d) { return yScale(d.total) })
                    .attr("r", 3)
                    .on("mouseover", mouseover)
                    .on("mouseout", mouseout)
                    .attr("id", "BeachCircle")
                    .attr("fill", "Black")
                    .style("fill-opacity", "0")
                    .attr("stroke", "none")
                    .transition()
                    .delay(1000)
                    .attr("fill", "Black")
                    .style("fill-opacity", "1")
                    .attr("stroke", "none");

            } else {
                d3.select("#Beachid").remove();

                svg.append("path")
                    .datum(dataset.filter(function (d) {
                        return d.site == "Beach/Coastal"
                    }))
                    .attr("class", "area")
                    .attr("d", line)
                    .style("fill", "none")
                    .style("fill-opacity", "0.2")
                    .style("stroke", "orange")
                    .style("stroke-width", "2")
                    .transition()
                    .duration(1000)
                    .attr("d", initialline)
                    .style("fill", "none")
                    .style("fill-opacity", "0")
                    .style("stroke", "black")
                    .style("stroke-width", "0");

                d3.selectAll("#BeachCircle").remove();

                beach = false;
            }

        });

        d3.select("#Bush").on("click", function () {

            if (bush == false) {
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
                    .style("stroke", "yellow")
                    .style("stroke-width", "2");

                bush = true;

                svg.selectAll("Circles")
                    .data(dataset.filter(function (d) {
                        return d.site == "Bushland"
                    }))
                    .enter()
                    .append("circle")
                    .attr("cx", function (d) { return xScale(d.year) })
                    .attr("cy", function (d) { return yScale(d.total) })
                    .attr("r", 3)
                    .on("mouseover", mouseover)
                    .on("mouseout", mouseout)
                    .attr("id", "BushCircle")
                    .attr("fill", "Black")
                    .style("fill-opacity", "0")
                    .attr("stroke", "none")
                    .transition()
                    .delay(1000)
                    .attr("fill", "Black")
                    .style("fill-opacity", "1")
                    .attr("stroke", "none");

            } else {
                d3.select("#Bushid").remove();

                svg.append("path")
                    .datum(dataset.filter(function (d) {
                        return d.site == "Bushland"
                    }))
                    .attr("class", "area")
                    .attr("d", line)
                    .style("fill", "none")
                    .style("fill-opacity", "0.2")
                    .style("stroke", "yellow")
                    .style("stroke-width", "2")
                    .transition()
                    .duration(1000)
                    .attr("d", initialline)
                    .style("fill", "none")
                    .style("fill-opacity", "0")
                    .style("stroke", "black")
                    .style("stroke-width", "0");

                d3.selectAll("#BushCircle").remove();

                bush = false;
            }

        });

        d3.select("#School").on("click", function () {

            if (school == false) {
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
                    .style("stroke", "purple")
                    .style("stroke-width", "2");

                school = true;

                svg.selectAll("Circles")
                    .data(dataset.filter(function (d) {
                        return d.site == "School Grounds"
                    }))
                    .enter()
                    .append("circle")
                    .attr("cx", function (d) { return xScale(d.year) })
                    .attr("cy", function (d) { return yScale(d.total) })
                    .attr("r", 3)
                    .on("mouseover", mouseover)
                    .on("mouseout", mouseout)
                    .attr("id", "SchoolCircle")
                    .attr("fill", "Black")
                    .style("fill-opacity", "0")
                    .attr("stroke", "none")
                    .transition()
                    .delay(1000)
                    .attr("fill", "Black")
                    .style("fill-opacity", "1")
                    .attr("stroke", "none");

            } else {
                d3.select("#Schoolid").remove();

                svg.append("path")
                    .datum(dataset.filter(function (d) {
                        return d.site == "School Grounds"
                    }))
                    .attr("class", "area")
                    .attr("d", line)
                    .style("fill", "none")
                    .style("fill-opacity", "0.2")
                    .style("stroke", "purple")
                    .style("stroke-width", "2")
                    .transition()
                    .duration(1000)
                    .attr("d", initialline)
                    .style("fill", "none")
                    .style("fill-opacity", "0")
                    .style("stroke", "black")
                    .style("stroke-width", "0");

                d3.selectAll("#SchoolCircle").remove();

                school = false;
            }

        });

        d3.select("#Shops").on("click", function () {

            if (shops == false) {
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
                    .style("stroke", "navy")
                    .style("stroke-width", "2");

                shops = true;

                svg.selectAll("Circles")
                    .data(dataset.filter(function (d) {
                        return d.site == "Shops/malls"
                    }))
                    .enter()
                    .append("circle")
                    .attr("cx", function (d) { return xScale(d.year) })
                    .attr("cy", function (d) { return yScale(d.total) })
                    .attr("r", 3)
                    .on("mouseover", mouseover)
                    .on("mouseout", mouseout)
                    .attr("id", "ShopCircle")
                    .attr("fill", "Black")
                    .style("fill-opacity", "0")
                    .attr("stroke", "none")
                    .transition()
                    .delay(1000)
                    .attr("fill", "Black")
                    .style("fill-opacity", "1")
                    .attr("stroke", "none");

            } else {
                d3.select("#Shopid").remove();

                svg.append("path")
                    .datum(dataset.filter(function (d) {
                        return d.site == "Shops/malls"
                    }))
                    .attr("class", "area")
                    .attr("d", line)
                    .style("fill", "none")
                    .style("fill-opacity", "0.2")
                    .style("stroke", "navy")
                    .style("stroke-width", "2")
                    .transition()
                    .duration(1000)
                    .attr("d", initialline)
                    .style("fill", "none")
                    .style("fill-opacity", "0")
                    .style("stroke", "black")
                    .style("stroke-width", "0");

                d3.selectAll("#ShopCircle").remove();

                shops = false;
            }

        });

        d3.select("#Dive").on("click", function () {

            if (dive == false) {
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
                    .style("stroke", "brown")
                    .style("stroke-width", "2");

                dive = true;

                svg.selectAll("Circles")
                    .data(dataset.filter(function (d) {
                        return d.site == "Dive Site"
                    }))
                    .enter()
                    .append("circle")
                    .attr("cx", function (d) { return xScale(d.year) })
                    .attr("cy", function (d) { return yScale(d.total) })
                    .attr("r", 3)
                    .on("mouseover", mouseover)
                    .on("mouseout", mouseout)
                    .attr("id", "DiveCircle")
                    .attr("fill", "Black")
                    .style("fill-opacity", "0")
                    .attr("stroke", "none")
                    .transition()
                    .delay(1000)
                    .attr("fill", "Black")
                    .style("fill-opacity", "1")
                    .attr("stroke", "none");

            } else {
                d3.select("#Diveid").remove();

                svg.append("path")
                    .datum(dataset.filter(function (d) {
                        return d.site == "Dive Site"
                    }))
                    .attr("class", "area")
                    .attr("d", line)
                    .style("fill", "none")
                    .style("fill-opacity", "0.2")
                    .style("stroke", "brown")
                    .style("stroke-width", "2")
                    .transition()
                    .duration(1000)
                    .attr("d", initialline)
                    .style("fill", "none")
                    .style("fill-opacity", "0")
                    .style("stroke", "black")
                    .style("stroke-width", "0");

                d3.selectAll("#DiveCircle").remove();

                dive = false;
            }

        });

        d3.select("#Outdoor").on("click", function () {

            if (outdoor == false) {
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
                    .style("stroke", "black")
                    .style("stroke-width", "2");

                outdoor = true;

                svg.selectAll("Circles")
                    .data(dataset.filter(function (d) {
                        return d.site == "Outdoor Transport"
                    }))
                    .enter()
                    .append("circle")
                    .attr("cx", function (d) { return xScale(d.year) })
                    .attr("cy", function (d) { return yScale(d.total) })
                    .attr("r", 3)
                    .on("mouseover", mouseover)
                    .on("mouseout", mouseout)
                    .attr("id", "OutdoorCircle")
                    .attr("fill", "Black")
                    .style("fill-opacity", "0")
                    .attr("stroke", "none")
                    .transition()
                    .delay(1000)
                    .attr("fill", "Black")
                    .style("fill-opacity", "1")
                    .attr("stroke", "none");

            } else {
                d3.select("#Outdoorid").remove();
                svg.append("path")
                    .datum(dataset.filter(function (d) {
                        return d.site == "Outdoor Transport"
                    }))
                    .attr("class", "area")
                    .attr("d", line)
                    .style("fill", "none")
                    .style("fill-opacity", "0.2")
                    .style("stroke", "black")
                    .style("stroke-width", "2")
                    .transition()
                    .duration(1000)
                    .attr("d", initialline)
                    .style("fill", "none")
                    .style("fill-opacity", "0")
                    .style("stroke", "black")
                    .style("stroke-width", "0");

                d3.selectAll("#OutdoorCircle").remove();

                outdoor = false;
            }

        });

        d3.select("#Other").on("click", function () {

            if (other == false) {
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
                    .style("stroke", "teal")
                    .style("stroke-width", "2");

                other = true;

                svg.selectAll("Circles")
                    .data(dataset.filter(function (d) {
                        return d.site == "Other"
                    }))
                    .enter()
                    .append("circle")
                    .attr("cx", function (d) { return xScale(d.year) })
                    .attr("cy", function (d) { return yScale(d.total) })
                    .attr("r", 3)
                    .on("mouseover", mouseover)
                    .on("mouseout", mouseout)
                    .attr("id", "OtherCircle")
                    .attr("fill", "Black")
                    .style("fill-opacity", "0")
                    .attr("stroke", "none")
                    .transition()
                    .delay(1000)
                    .attr("fill", "Black")
                    .style("fill-opacity", "1")
                    .attr("stroke", "none");

            } else {
                d3.select("#Otherid").remove();

                svg.append("path")
                    .datum(dataset.filter(function (d) {
                        return d.site == "Other"
                    }))
                    .attr("class", "area")
                    .attr("d", line)
                    .style("fill", "none")
                    .style("fill-opacity", "0.2")
                    .style("stroke", "teal")
                    .style("stroke-width", "2")
                    .transition()
                    .duration(1000)
                    .attr("d", initialline)
                    .style("fill", "none")
                    .style("fill-opacity", "0")
                    .style("stroke", "black")
                    .style("stroke-width", "0");

                d3.selectAll("#OtherCircle").remove();

                other = false;
            }

        });

        d3.select("#clear").on("click", function () {

            if (parks == true || road == true || water == true || beach == true || bush == true || school == true || shops == true || dive == true || outdoor == true || other == true) {


                d3.select("#Parksid").remove() && d3.select("#Roadid").remove() && d3.select("#Waterid").remove() && d3.select("#Beachid").remove() && d3.select("#Bushid").remove() &&
                    d3.select("#Schoolid").remove() && d3.select("#Shopid").remove() && d3.select("#Diveid").remove() && d3.select("#Outdoorid").remove() && d3.select("#Otherid").remove();

                d3.selectAll("#ParksCircle").remove() && d3.selectAll("#RoadCircle").remove() && d3.selectAll("#WaterCircle").remove() && d3.selectAll("#BeachCircle").remove() &&
                    d3.selectAll("#BushCircle").remove() && d3.selectAll("#SchoolCircle").remove() && d3.selectAll("#ShopCircle").remove() && d3.selectAll("#DiveCircle").remove() &&
                    d3.selectAll("#OutdoorCircle").remove() && d3.selectAll("#OtherCircle").remove();

                parks = false;
                road = false;
                water = false;
                beach = false;
                bush = false;
                school = false;
                shops = false;
                dive = false;
                outdoor = false;
                other = false;

            }




        });
    };

    function barChart() {
        var color = d3.scaleOrdinal(d3.schemeCategory10);

        console.log(dataset.Date);

        var stack = d3.stack()
                    .keys();

        console.log(stack);

        var xScale = d3.scaleBand()
            .domain(dataset.map(function (d) { return d.site }))
            .range([padding, w])
            .paddingInner(0.05);

        var yScale = d3.scaleLinear()
            .domain([0, d3.max(dataset, function (d) { return d.total; })]) //defines max possible input data value in the domain
            .range([h - padding, 0]);

        var xAxis = d3.axisBottom()
            .scale(xScale);

        var yAxis = d3.axisLeft()
            .scale(yScale);

        var svg = d3.select("#barChart")
            .append("svg")
            .attr("width", w + padding)
            .attr("height", h + padding)
            .append("g")
            .attr("transform", "translate(" + padding + " ,0)");

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

        svg.selectAll("rect")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("x", function (d, i) {
                return xScale(d.site);
            })
            .attr("y", function (d) {
                return yScale(d.total);
            })
            .attr("width", xScale.bandwidth())
            .attr("height", function (d) {
                return h - yScale(d.total) - padding;
            })
            .style("fill", "blue")
    };
}

window.onload = init;