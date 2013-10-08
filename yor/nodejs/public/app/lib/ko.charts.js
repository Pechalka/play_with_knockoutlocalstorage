define([
    "knockout",
    "jquery",  
    "d3"  
    ], function(ko, $, d3){

var today = new Date();
var day = today.getUTCDate();
var year = today.getFullYear();
var month = today.getMonth();
        
function isEmpty(str) {
    return (!str || 0 === str.length);
}

function sum(kArray, func) {
    var total = 0;
    for (var p = 0; p < kArray.length; p++) {
        if(func!=null)
            total += parseFloat(func(kArray[p]));
        else
            total += parseFloat(kArray[p]);
    }
    return total;
}

function find(data, predicate) {
    var i = 0;
    for (i = 0; i < data.length; i++)
        if(predicate(data[i]))
            return data[i];
}

function max(kArray, predicate) {
    var max = 0;
    for (var p = 0; p < kArray.length; p++) {
        var v = predicate(kArray[p]);
        if (v >= max)
            max = v;
    }

    return max;
}

function positiveRounded(d) {
    if (d > 0)
        return Math.round(d);
    return 0;
}

function isString(x){
    return typeof(x) == 'string';
}

function toFixed(v,n){
    if (isString(v))
        return v;
    return v.toFixed(n);
}

function isValidDate(d) {
  if ( Object.prototype.toString.call(d) !== "[object Date]" )
    return false;
  return !isNaN(d.getTime());
}

function arraysAreEqual(ary1, ary2) {
 //   debugger
    if (ary1 != null && ary2 != null){
    
        return JSON.stringify(ary1) == JSON.stringify(ary2)

    //    return (ary1.join('') == ary2.join(''));
    }
    if (ary1 == null && ary2 == null)
        return true;

    return false;
}


//Takes as input collection of items [data]. Each item has two values [x] and [y].
function d3pieChart(elname, data, opt) {
    opt = opt || {};
    var width = opt.width || 200
    ,   height = opt.height || 200
    ,   showLegend = opt.showLegend == null ? true : opt.showLegend 
    ,   fildCenter = opt.fildCenter == null ? false : opt.fildCenter 
    ,   outerRadius = Math.min(width, height) / 2
    ,   innerRadius = !fildCenter ? outerRadius * .6 : 0;
    var showResultsInChart = opt.showResultsInChart == null ? true : opt.showResultsInChart;
    var showResultsInLegend = opt.showResultsInLegend == null ? false : opt.showResultsInLegend;
    var mouseover = opt.mouseover || function(){};
    var mouseout = opt.mouseout || function(){};

    width = width / 2;
    
    
    var color = d3.scale.category20(),
    donut = d3.layout.pie(),
    arc = d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius),
    parent = d3.select("#" + elname);

    var maxLegendLength = max(data, function (el) { return el.x.length; }) * 7;
    var maxLegendLengthValues = max(data, function (el) { return el.y; }).toString().length * 7;

    if (!showResultsInLegend) maxLegendLengthValues = 0;
    //assuming 25 pixels for the small rectangle and 7 pixels per character, rough estimation which more or less works
    var legendWidth = maxLegendLengthValues + 25 + maxLegendLength  ;

    donut.value(function (d) { return d.y; });

    if (showLegend) {
       var legend = parent
       .append("svg")
       .attr("width", legendWidth)
       .attr("height", height)
       .selectAll("g")
        .data(data)
        .enter().append("g")
        .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

        if (showResultsInLegend) {
      legend.append("text")
       .attr("x", 0)
       .attr("y", 9)
       .style("font-size","10px")
       .attr("dy", ".35em")
       .text(function (d) { return d.y; });
      }

       legend.append("rect")
            .attr("x", maxLegendLengthValues )
            .attr("y", 0)
           .attr("width", 18)
           .attr("height", 18)
           .style("fill", function (d, i) { return color(i); })

       legend.append("text")
       .attr("x", maxLegendLengthValues + 25)
       .attr("y", 9)
       .style("font-size","10px")
       .attr("dy", ".35em")
       .text(function (d) { return d.x; });
   }

      var vis = parent
      .append("svg")
        .data([data])

        .attr("width", width)
        .attr("height", height);

    var arcs = vis.selectAll("g.arc")
        .data(donut)
      .enter().append("g")
        .attr("class", "arc")
        .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");

    arcs.append("path")
        .attr("fill", function (d, i) { return color(i); })
        .attr("d", arc);

arcs.on('mouseover', mouseover);
arcs.on('mouseout', mouseout);


// arcs.on('click', function(a, b, c){
//   alert(a.data.x);
// })

  if (showResultsInChart == false) return;

    arcs.append("text")
        .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .attr("display", function (d) { return d.data.y > .15 ? null : "none"; })
        .text(function (d, i) {
            if (isString(d.data.y))
                return d.data.y;
            return d.data.y.toFixed(2);
        });
}


ko.bindingHandlers.piechart = {
    init: function(element, valueAccessor, allBindingsAccessor) {
      //initialize datepicker with some optional options
      var transf = allBindingsAccessor().transformation;
      var vmData = ko.utils.unwrapObservable(allBindingsAccessor().piechart);

      var data = vmData.map(transf);
      vmData._originalData = data;
      
      d3pieChart(element.id, data, allBindingsAccessor().chartOptions);
    },
    update: function(element, valueAccessor,allBindingsAccessor) {
      var transf = allBindingsAccessor().transformation;
      var vmData = ko.utils.unwrapObservable(allBindingsAccessor().piechart);

      
      var data = vmData.map(transf);
      
      if(!arraysAreEqual(data, vmData._originalData)){
          element.innerHTML = "";
            d3pieChart(element.id, data, allBindingsAccessor().chartOptions);
            vmData._originalData = data;
      }
    }
};


});

 