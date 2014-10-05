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
        tempDate = new Date(data.events[i].date);
        var tzDifference = tempDate.getTimezoneOffset();
        data.events[i].date = new Date(tempDate.getTime() + tzDifference * 60 * 1000);
    };

    var earliestDate = d3.min(data.events, function(d) { return d.date; });
    var latestDate = d3.max(data.events, function(d) { return d.date; });

    var w = $(window).width();
    var h = $(window).height();

    var y = d3.scale.linear()
        .domain([earliestDate, latestDate])
        .range([0, h+100])

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
        .attr("cy", function(d) { return fullHeight - d.y + nodeRadius + 1; })
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
        .attr("y", function(d) { return fullHeight - d.y + nodeRadius*1.8; })
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
        .attr("width", "100")
        .attr("x", w/5.0 + 15)
        .attr("y", function(d) { return fullHeight - d.y + nodeRadius*1.8; })
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
        .attr("y", function(d) { return fullHeight - d.y - 25; } )
        .attr("width", 80)
        .attr("height", 80)
        .attr('fill', function(d) { return 'url(#pattern' + d.eventId + ')'; })
        .style("visibility", "hidden")

}
