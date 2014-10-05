function renderTimeline(data) {

/*var data = {
    'stories':[{
        'storyId':1,
        'title':'Ebola Outbreak in Africa'
    }],
    'events':[{
        'eventId':1,
        'date': '2014-03-01',
        'title': 'outbreak starts',
        'urls': [{
            'url':'http://www.storylinenews.co',
            'img':'http://www.nywaterway.com/UserFiles/Images/2013/LatestNews.jpeg'
        }],
        'tags': 'ebola, health, africa'
    },
    {
        'eventId':2,
        'date': '2014-05-01',
        'title': 'the world notices',
        'urls': [{
            'url':'http://www.storylinenews.co',
            'img':'http://www.nywaterway.com/UserFiles/Images/2013/LatestNews.jpeg'
        }],
        'tags': 'ebola, health, africa'
    },
    {
        'eventId':3,
        'date': '2014-10-01',
        'title': 'first case in us',
        'urls': [{
            'url':'http://www.storylinenews.co',
            'img':'http://www.nywaterway.com/UserFiles/Images/2013/LatestNews.jpeg'
        }],
        'tags': 'ebola, health, africa'
    }]
}*/

    var i;
    for (i in data.events) {
        data.events[i].date = new Date(data.events[i].date);
    };

    var earliestDate = d3.min(data.events, function(d) { return d.date; });
    var latestDate = d3.max(data.events, function(d) { return d.date; });

    var w = $(window).width();
    var h = $(window).height();

    var y = d3.scale.linear()
        .domain([earliestDate, latestDate])
        .range([20, h-20 + 800])

    var titleHeight = 30;
    for (i = 0; i < data.events.length; i++) {
        var val = y(data.events[i].date);
        if (i > 0) {
            var prev = data.events[i-1].y;
            if (val - prev < titleHeight) {
                val = prev + titleHeight;
            }
        }
        data.events[i].y = val;
    }
    var fullHeight = data.events[data.events.length - 1].y;

    var svg = d3.select("#storylineViz").append("svg")
                .attr("id", "playgraph")
                 //better to keep the viewBox dimensions with variables
                .attr("viewBox", "0 0 " + w + " " + (fullHeight + 50) )
                .attr("preserveAspectRatio", "xMidYMid meet");

    var timeline = svg.append("line")
            .attr("class", "timeline")
            .attr("x1", w/5.0)
            .attr("x2", w/5.0)
            .attr("y1", y(earliestDate))
            .attr("y2", fullHeight)
            .attr("stroke-width", 4);

    var svgDef = svg.append('defs').attr("class", "imagePatterns")
        svgDef.selectAll(".imgPattern")
            .data(data.events)
            .enter()
            .append('pattern')
            .attr("id", function(d) { return 'pattern' + d.eventId })
            .attr("class", "imgPattern")
            .attr("patternContentUnits", "objectBoundingBox")
            .attr("width", 1)
            .attr("height", 1)
            .append('image')
            .attr("x", 0).attr("y",0)
            .attr("width", 1).attr("height", 1)
            .attr("xlink:href", function(d) { return d.urls[0].img });

    var nodeRadius = 10;
    svg.selectAll('.eventNode')
        .data(data.events)
        .enter()
        .append('circle')
        .attr("class", "eventNode")
        .attr("cy", function(d) { return d.y; })
        .attr("cx", w/5.0)
        .attr("r", nodeRadius)
        .style("stroke", '#001557')
        .style("stroke-width", 2)
        .style("fill", '#001557')
        .on("mouseover", function(d) {
            target_id = '#urlImg' + d.eventId;
            d3.select(target_id).style("visibility", "visible");
        })
        .on("mouseout", function(d) {
            target_id = '#urlImg' + d.eventId;
            d3.select(target_id).style("visibility", "hidden");
        });

    svg.selectAll('.eventDateStr')
        .data(data.events)
        .enter()
        .append("text")
        .attr("x", w/5.0 - 15)
        .attr("y", function(d) { return d.y + nodeRadius/2; })
        .text(function(d) {return d.date.toDateString()})
        .attr("font-size", "20px")
        .style("text-anchor", "end")
        .attr("fill", "Black");

    svg.selectAll('.eventTitle')
        .data(data.events)
        .enter()
        .append("a")
        .attr("xlink:href", function(d) { return d.urls[0].url })
        .attr('target', '_blank')
        .append("text")
        .attr("x", w/5.0 + 15)
        .attr("y", function(d) { return d.y + nodeRadius/2; })
        .text(function(d) { return d.title })
        .attr('font-family', '"Helvetica Neue",Helvetica,Arial,sans-serif')
        .attr("font-size", "20px")
        .attr("fill", "Black")
        .on("mouseover", function(d) {
            target_id = '#urlImg' + d.eventId;
            d3.select(target_id).style("visibility", "visible");
        })
        .on("mouseout", function(d) {
            target_id = '#urlImg' + d.eventId;
            d3.select(target_id).style("visibility", "hidden");
        });

    /*svg.selectAll('.eventUrl')
        .data(data.events)
        .enter()
        .append("a")
        .attr("xlink:href", function(d) { return d.urls[0].url })
        .append("text")
        .attr("x", w/5.0 + 15)
        .attr("y", function(d) { return y(d.date) + 25; })
        .text(function(d) { return d.urls[0].url })
        .attr("font-size", "20px")
        .attr("fill", "Black")*/

    svg.selectAll('.urlImg')
        .data(data.events)
        .enter()
        .append("rect")
        .attr("id", function(d) { return 'urlImg' + d.eventId; })
        .attr("x", w / 2)
        .attr("y", function(d) { return d.y - 25; } )
        .attr("width", 80)
        .attr("height", 80)
        .attr('fill', function(d) { return 'url(#pattern' + d.eventId + ')'; })
        .style("visibility", "hidden")


    /*

    var margin = {top: 40, right: 20, bottom: 40, left: 40},
        width = 800 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom,
        r = height/11;

    var style_color = d3.scale.ordinal()
        .domain([0, 1, 2, 3])
        .range(["#ee8000","#da2454","#437ad7","#27b28c"]);
        //a little not here: because of how we do plans, they will actually be 'null' but that will map to first member of the domain

    //x and y scales are for shape elements
    var y = d3.scale.ordinal()
        .domain([3, 2, 1, 0])
        .range([height*.2, height*.4, height*.6, height*.8])

    var x = d3.scale.linear()
        .domain([7, 0])
        .range([0, width])

    //zoom is attached to main svg group to capture mouse events there
    var zoom = d3.behavior.zoom()
        .x(x)
        .scaleExtent([1, 250])
        .on("zoom", updateVis);

    //This is a dummy scale and zoom never attached to a visable svg obj. Used to to control tAxis
    var tScale = d3.time.scale()
        .domain([oneWeekAgo, now])
        .range([0, width]);

    var tZoom = d3.behavior.zoom()
        .x(tScale)
        .scaleExtent(zoom.scaleExtent());

    var tAxis = d3.svg.axis()
        .scale(tScale)
        .orient("bottom")
        .tickSize(-height, 0)
        .tickPadding(6)
        .tickFormat(d3.time.format.multi([
            ["%I:%M", function(d) { return d.getMinutes(); }],
            ["%I %p", function(d) { return d.getHours(); }],
            ["%a", function(d) { return true; }]
        ]));


    //Now we can get to drawing our basic elements
    var svg = d3.select("#graph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(zoom);

    /*
    var svgDef = svg.append('defs').attr("class", "imagePatterns")

    svg.append("rect")
        .attr("class", "background")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width)
        .attr("height", height);

    svg.append("g")
        .attr("class", "time axis")
        .attr("transform", "translate(0," + height + ")");

    svg.selectAll("#timeline")
        .data(y.range())
        .enter()
        .append("line")
        .attr("class", "timeline")
        .attr("x1", x(0))
        .attr("x2", x(7))
        .attr("y1", function(d) {return d})
        .attr("y2", function(d) {return d})
        .attr("stroke-width", 2)
        .attr("stroke", "black");



        /*Tool tip for video detail
        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
                return "Workout: <span style='color:white'>" + vids[d.videoID].seriesName + ": " + vids[d.videoID].seriesIndex + "</span><p>\
                        Nets Earned: <span style='color:white'>" + d.netsEarned + "</span><p>\
                        Time logged: <spam style='color:white'>" + d.sessionDate + "</span>";
            });
            svg.call(tip);*/

        /*console.log(client)
        console.log(vids)

        svgDef.selectAll(".imgPattern")
            .data(d3.values(data.vids))
            .enter()
            .append('pattern')
            .attr("id", function(d) { return 'pattern' + d.videoID })
            .attr("class", "imgPattern")
            .attr("patternContentUnits", "objectBoundingBox")
            .attr("width", 1)
            .attr("height", 1)
            .append('image')
            .attr("x", 0).attr("y",0)
            .attr("width", 1).attr("height", 1)
            .attr("xlink:href", function(d) { return d.resourceRoot + d.imgFile });

        svg.append("text")
            .attr("x", 20)
            .attr("y", 20)
            .text(client.info.firstName + " " + client.info.lastName)
            .attr("font-size", "20px")
            .attr("fill", "Black");

        svg.selectAll(".vidSession")
            .data(client.full_sessions)
            .enter()
            .append("circle")
            .attr("class", "vidSession")
            .attr("cy", function(d) { return y( Math.floor((now - d.sessionDate) / (86400000*7)) ); })
            .attr("r", r)
            .style("stroke", function(d) {
                return style_color(vids[d.videoID].style) })
            .style("stroke-width", r/8)
            .style("fill", function(d) { return "url(#pattern" + d.videoID + ")" })
            .on("mouseover", tip.show)
            .on("mouseout", tip.hide);

        //cx values for circles set inside onZoom()
        updateVis();
    });

    //Main update for visualization
    function updateVis() {
        //this first part should prob be a built-in part of d3.behavior.zoom()
        //it prevents us from translating beyond the origional setup
        var minXtrans = -width * (zoom.scale() - 1)
        var maxXtrans = 0
        trans = zoom.translate()
        trans[0] = Math.max(trans[0], minXtrans)
        trans[0] = Math.min(trans[0], maxXtrans)
        zoom.translate(trans)

        //fill our dummy zoom in on what is going on
        tZoom.scale(zoom.scale())
        tZoom.translate(zoom.translate())

        //now that we've set our zooms, redraw the vidSessions, timelines, and tAxis based on the updated scales
        svg.selectAll(".vidSession")
            .attr("cx", function(d) {
                return x( ((now - d.sessionDate) / 86400000) % 7 ); //86400000 = number of miliseconds in a day
            })
        svg.selectAll(".timeline")
            .attr("x1", x(0))
            .attr("x2", x(7))

        svg.select("g.time.axis").call(tAxis);
    }
    */
}
