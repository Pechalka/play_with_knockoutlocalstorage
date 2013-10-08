define([
    "knockout",
    "jquery",
    "text!./../templates/Deagramm2.html",
    "vent", 
    "d3"
    ], function(ko, $,  template, vent, d3){

    return function(model){
        var self = this;

        self.members = model.members;

        self.transformToChart = function() {
        }

        self.transformToChart = function(member){
            return { x: member.name, y: member.sum };
        }


    self.mouseout = function(a, b, c){
        $('#partsChart').popover('toggle');
    }
    
    self.mouseover = function(a,b,c){
      $('#partsChart').attr('data-original-title', a.data.x);
      $('#partsChart').attr('data-content', 'bala' + a.data.y)
      $('#partsChart').popover('toggle');
    }


    self.afterRender = function() {


var width = 280;
var height = 200;

  var incomeValue = model.incomeSum;
  var expenditureValue = model.expenditureSum;
  var annualValue = model.annualSum;

 
 var scale = d3.scale.linear().
  domain([0, d3.max([incomeValue, expenditureValue + annualValue])]). // your data minimum and maximum
  range([0, 200]); // the pixels to map to, e.g., the width of the diagram.


var barDemo = d3.select("#barChart").
  append("svg:svg").
  attr("width", width).
  attr("height", height);

      var bottomY = 200;
      barDemo.append("rect")
      .data([incomeValue])
      .attr("x", 50)
      .attr("y", function(datum) { return bottomY - scale(datum); })
      .attr("width", 80)
      .attr("height", scale)
      .attr("fill", "#1f77b4");

      barDemo.append("rect")
      .data([expenditureValue])
      .attr("x", 150)
      .attr("y", function(datum) { return bottomY - scale(datum); })
      .attr("width", 80)
      .attr("height", scale)
      .attr("fill", "#24A828");

      barDemo.append("rect")
      .data([annualValue])
      .attr("x", 150)
      .attr("y", function(datum) { return bottomY - scale(expenditureValue + datum); })
      .attr("width", 80)
      .attr("height", scale)
      .attr("fill", "#D6E685");


    }
        self.template = template;
    }
});