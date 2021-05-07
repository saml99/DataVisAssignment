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

        var parks = false, road = false, water = false, beach = false, bush = false, school = false, shops = false, dive = false, outdoor = false, other = false;

        d3.select("#Park").on("click", function () {

            if (parks == false) {
                svg.append("path")
                    .datum(dataset.filter(function (d) {
                        return d.site == "Parks"
                    }))
                    .attr("class", "line")
                    .attr("d", line)
                    .attr("id", "Parksid")
                    .style("fill", "none")
                    .style("stroke", "red")
                    .style("stroke-width", "2");

                parks = true;

            } else {
                d3.select("#Parksid").remove();

                parks = false;
            }

        });

        d3.select("#Road").on("click", function () {

            if (road == false) {
                svg.append("path")
                    .datum(dataset.filter(function (d) {
                        return d.site == "Roadway"
                    }))
                    .attr("class", "line")
                    .attr("d", line)
                    .attr("id", "Roadid")
                    .style("fill", "none")
                    .style("stroke", "green")
                    .style("stroke-width", "2");

                road = true;

            } else {
                d3.select("#Roadid").remove();

                road = false;

            }

        });

        d3.select("#Water").on("click", function () {

            if (water == false) {
                svg.append("path")
                    .datum(dataset.filter(function (d) {
                        return d.site == "Waterways"
                    }))
                    .attr("class", "line")
                    .attr("d", line)
                    .attr("id", "Waterid")
                    .style("fill", "none")
                    .style("stroke", "blue")
                    .style("stroke-width", "2");

                water = true;

            } else {
                d3.select("#Waterid").remove();

                water = false;
            }

        });

        d3.select("#Beach").on("click", function () {

            if (beach == false) {
                svg.append("path")
                    .datum(dataset.filter(function (d) {
                        return d.site == "Beach/Coastal"
                    }))
                    .attr("class", "line")
                    .attr("d", line)
                    .attr("id", "Beachid")
                    .style("fill", "none")
                    .style("stroke", "orange")
                    .style("stroke-width", "2");

                beach = true;

            } else {
                d3.select("#Beachid").remove();

                beach = false;
            }

        });

        d3.select("#Bush").on("click", function () {

            if (bush == false) {
                svg.append("path")
                    .datum(dataset.filter(function (d) {
                        return d.site == "Bushland"
                    }))
                    .attr("class", "line")
                    .attr("d", line)
                    .attr("id", "Bushid")
                    .style("fill", "none")
                    .style("stroke", "yellow")
                    .style("stroke-width", "2");

                bush = true;

            } else {
                d3.select("#Bushid").remove();

                bush = false;
            }

        });

        d3.select("#School").on("click", function () {

            if (school == false) {
                svg.append("path")
                    .datum(dataset.filter(function (d) {
                        return d.site == "School Grounds"
                    }))
                    .attr("class", "line")
                    .attr("d", line)
                    .attr("id", "Schoolid")
                    .style("fill", "none")
                    .style("stroke", "purple")
                    .style("stroke-width", "2");

                school = true;

            } else {
                d3.select("#Schoolid").remove();

                school = false;
            }

        });

        d3.select("#Shops").on("click", function () {

            if (shops == false) {
                svg.append("path")
                    .datum(dataset.filter(function (d) {
                        return d.site == "Shops/malls"
                    }))
                    .attr("class", "line")
                    .attr("d", line)
                    .attr("id", "Shopid")
                    .style("fill", "none")
                    .style("stroke", "navy")
                    .style("stroke-width", "2");

                shops = true;

            } else {
                d3.select("#Shopid").remove();

                shops = false;
            }

        });

        d3.select("#Dive").on("click", function () {

            if (dive == false) {
                svg.append("path")
                    .datum(dataset.filter(function (d) {
                        return d.site == "Dive Site"
                    }))
                    .attr("class", "line")
                    .attr("d", line)
                    .attr("id", "Diveid")
                    .style("fill", "none")
                    .style("stroke", "brown")
                    .style("stroke-width", "2");

                dive = true;

            } else {
                d3.select("#Diveid").remove();

                dive = false;
            }

        });

        d3.select("#Outdoor").on("click", function () {

            if (outdoor == false) {
                svg.append("path")
                    .datum(dataset.filter(function (d) {
                        return d.site == "Outdoor Transport"
                    }))
                    .attr("class", "line")
                    .attr("d", line)
                    .attr("id", "Outdoorid")
                    .style("fill", "none")
                    .style("stroke", "black")
                    .style("stroke-width", "2");

                outdoor = true;

            } else {
                d3.select("#Outdoorid").remove();

                outdoor = false;
            }

        });

        d3.select("#Other").on("click", function () {

            if (other == false) {
                svg.append("path")
                    .datum(dataset.filter(function (d) {
                        return d.site == "Other"
                    }))
                    .attr("class", "line")
                    .attr("d", line)
                    .attr("id", "Otherid")
                    .style("fill", "none")
                    .style("stroke", "teal")
                    .style("stroke-width", "2");

                other = true;

            } else {
                d3.select("#Otherid").remove();

                other = false;
            }

        });


    });




}

window.onload = init;