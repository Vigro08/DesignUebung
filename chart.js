import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

async function drawChart(number) {   
    

    let dataRaw = await d3.csv("DesignubungGradingData.csv", function (d) {
    return {
        "Year" : d.Year,
        "Course" : d.Course,
        "BM" : d.BM,
        "Study" : d.Study,
        "Grade" : +d.Grade
    }});

    let dataRawWinfo = dataRaw.filter(d => d.Study === "WirtschaftsInformatik");
    let dataRawWiMa = dataRaw.filter(d => d.Study === "(Wirtschafts-)Mathematik");

    const dimensions = {
        width : 900,
        height: 400
    }

    const margins = {
        top: 10,
        bottom: 20,
        left: 50,
        right: 30,
    }

    const svgDimensions = {
        width : dimensions.width - margins.left - margins.right,
        height : dimensions.height - margins.top - margins.bottom
    }

    var chosenData;
    if (number == 1){
      chosenData = dataRaw;
    }
    if (number == 2){
      chosenData = dataRawWinfo;
    }
    if (number == 3){
      chosenData = dataRawWiMa;
    }
    const data =  [
        {
        "group": "alle",
        "2019": d3.mean(chosenData.filter(d => d.Year === "2019"), d => d.Grade),
        "2020": d3.mean(chosenData.filter(d => d.Year === "2020"), d => d.Grade),
        "2021": d3.mean(chosenData.filter(d => d.Year === "2021"), d => d.Grade),
        },{
        "group": "Bachelor Visualisierung",
        "2019": d3.mean(chosenData.filter(d => d.Year === "2019" && d.BM === "Bachelor" && d.Course === "Vis"), d => d.Grade),
        "2020": d3.mean(chosenData.filter(d => d.Year === "2020" && d.Course === "Vis" && d.BM === "Bachelor"), d => d.Grade),
        "2021": d3.mean(chosenData.filter(d => d.Year === "2021" && d.Course === "Vis" && d.BM === "Bachelor"), d => d.Grade),
        },{
        "group": "Master Visualisierung",
        "2019": d3.mean(chosenData.filter(d => d.Year === "2019" && d.BM === "Bachelor" && d.Course === "Vis"), d => d.Grade),
        "2020": d3.mean(chosenData.filter(d => d.Year === "2020" && d.Course === "Vis" && d.BM === "Master"), d => d.Grade),
        "2021": d3.mean(chosenData.filter(d => d.Year === "2021" && d.Course === "Vis" && d.BM === "Master"), d => d.Grade),
        },{
        "group": "Bachelor Visual Analytics",
        "2019": d3.mean(chosenData.filter(d => d.Year === "2019" && d.BM === "Bachelor" && d.Course === "VA"), d => d.Grade),
        "2020": d3.mean(chosenData.filter(d => d.Year === "2020" && d.Course === "VA" && d.BM === "Bachelor"), d => d.Grade),
        "2021": d3.mean(chosenData.filter(d => d.Year === "2021" && d.Course === "VA" && d.BM === "Bachelor"), d => d.Grade),
        },{
        "group": "Master Visual Analytics",
        "2019": d3.mean(chosenData.filter(d => d.Year === "2019" && d.BM === "Bachelor" && d.Course === "VA"), d => d.Grade),
        "2020": d3.mean(chosenData.filter(d => d.Year === "2020" && d.Course === "VA" && d.BM === "Master"), d => d.Grade),
        "2021": d3.mean(chosenData.filter(d => d.Year === "2021" && d.Course === "VA" && d.BM === "Master"), d => d.Grade),
        }
      ]

    
    var groups = ["alle", "Bachelor Visualisierung", "Master Visualisierung", "Bachelor Visual Analytics", "Master Visual Analytics"]//, "Master Visualisierung", "Bachelor Visual Analytics", "Master Visual Analytics"];
    var subgroups = ["2019", "2020", "2021"];

  // List of groups = species here = value of the first column called group -> I show them on the X axis

  // Add X axis

  var svg = d3.select("#chartSvg")
    .append("svg")
    .attr("width", svgDimensions.width + margins.left + margins.right)
    .attr("height", svgDimensions.height + margins.top + margins.bottom)
    .append("g")
    .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

  var x = d3.scaleBand()
      .domain(groups)
      .range([0, svgDimensions.width])
      .padding([0.2]);

  svg.append("g")
    .attr("transform", "translate(0," + svgDimensions.height + ")")
    .call(d3.axisBottom(x).tickSize(0));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 5])
    .range([svgDimensions.height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Another scale for subgroup position?
  var xSubgroup = d3.scaleBand()
    .domain(subgroups)
    .range([0, x.bandwidth()])
    .padding([0.05])

  // color palette = one color per subgroup
  var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#e41a1c','#377eb8','#4daf4a'])

  // Show the bars
  svg.append("g")
    .selectAll("g")
    // Enter in data = loop group per group
    .data(data)
    .enter()
    .append("g")
      .attr("transform", function(d) { return "translate(" + x(d.group) + ",0)"; })
    .selectAll("rect")
    .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect")
      .attr("x", function(d) { return xSubgroup(d.key); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", xSubgroup.bandwidth())
      .attr("height", function(d) { return svgDimensions.height - y(d.value); })
      .attr("fill", function(d) { return color(d.key); });

    svg.append("circle").attr("cx", 60).attr("cy", 5).attr("r", 6).style("fill", '#e41a1c');
    svg.append("circle").attr("cx", 60).attr("cy", 30).attr("r", 6).style("fill", '#377eb8');
    svg.append("circle").attr("cx", 60).attr("cy", 55).attr("r", 6).style("fill", '#4daf4a');
    svg.append("text").attr("x", 80).attr("y", 10).text("2019");
    svg.append("text").attr("x", 80).attr("y", 35).text("2020");
    svg.append("text").attr("x", 80).attr("y", 60).text("2021");

}

function draw1() {
  d3.selectAll("svg").remove();
  drawChart(1);
}

function draw2() {
  d3.selectAll("svg").remove();
  drawChart(2);
}

function draw3() {
  d3.selectAll("svg").remove();
  drawChart(3)
}
var el1 = document.getElementById("Button_1")
if (el1){
  document.getElementById("Button_1").addEventListener("click", draw1);
}
var el2 = document.getElementById("Button_2")
if (el2){
  document.getElementById("Button_2").addEventListener("click", draw2)
}
var el3 = document.getElementById("Button_3")
if (el3){
  document.getElementById("Button_3").addEventListener("click", draw3);
}

drawChart(1);
