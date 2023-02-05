"use strict";
class ScatterPlot {
    constructor(data, scatterConfig, drawConfig) {
        this.data = data;
        this.scatterConfig = scatterConfig;
        this.drawConfig = drawConfig;
        const margin = drawConfig.margin || { top: 0, bottom: 0, left: 0, right: 0 };
        const totalWidth = drawConfig.width + margin.left + margin.right;
        const totalHeight = drawConfig.height + margin.top + margin.bottom;
        this.svg = createSVG(drawConfig.parent, totalWidth, totalHeight).append("svg");
        this.ctx = this.svg.append("g")
            .attr("class", "scatter-plot")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);
        const xDomain = d3.extent(data, ([x, _]) => x);
        const yDomain = d3.extent(data, ([_, y]) => y);
        this.xScale = scatterConfig.xScale === "log" ?
            d3.scaleLog(xDomain, [0, drawConfig.width]) :
            d3.scaleLinear(xDomain, [0, drawConfig.width]);
        this.yScale = scatterConfig.xScale === "log" ?
            d3.scaleLog(yDomain, [drawConfig.height, 0]) :
            d3.scaleLinear(yDomain, [drawConfig.height, 0]);
        this.xAxis = d3.axisBottom(this.xScale);
        this.yAxis = d3.axisLeft(this.yScale);
        this.ctx.append("g")
            .call(this.xAxis)
            .attr("transform", `translate(0, ${drawConfig.height})`);
        this.svg.append("text")
            .attr("class", "x-label")
            .attr("text-anchor", "middle")
            .attr("x", margin.left + drawConfig.width / 2)
            .attr("y", margin.top + drawConfig.height + margin.bottom - 6)
            .text(this.scatterConfig.xAxisLabel);
        this.ctx.append("g")
            .call(this.yAxis);
        this.svg.append("text")
            .attr("class", "y-label")
            .attr("text-anchor", "middle")
            .attr("x", 0 - margin.top - drawConfig.height / 2)
            .attr("y", 50)
            .attr("transform", "rotate(-90)")
            .text(this.scatterConfig.yAxisLabel);
        this.render();
    }
    render() {
        this.ctx.selectAll(".scatter-point")
            .data(this.data).join("circle")
            .attr("class", "scatter-point")
            .attr("cx", (d) => this.xScale(d[0]))
            .attr("cy", (d) => this.yScale(d[1]))
            .attr("r", 2);
    }
}
const EARTH_MASS = 5.97; // 10^24 kg
const EARTH_DIAMETER = 12756; // km
const SOL_PLANETS = [
    {
        name: "Mercury",
        mass: 0.330 / EARTH_MASS,
        radius: 4879 / EARTH_DIAMETER,
        color: "#726658"
    },
    {
        name: "Venus",
        mass: 4.87 / EARTH_MASS,
        radius: 12104 / EARTH_DIAMETER,
        color: "#efecdd"
    },
    {
        name: "Earth",
        mass: 1,
        radius: 1,
        color: "#a49fb3"
    },
    {
        name: "Mars",
        mass: 0.642 / EARTH_MASS,
        radius: 6792 / EARTH_DIAMETER,
        color: "#896545"
    },
    {
        name: "Jupiter",
        mass: 1898 / EARTH_MASS,
        radius: 142984 / EARTH_DIAMETER,
        color: "#c3beab"
    },
    {
        name: "Saturn",
        mass: 568 / EARTH_MASS,
        radius: 120536 / EARTH_DIAMETER,
        color: "#c9b38e"
    },
    {
        name: "Uranus",
        mass: 86.8 / EARTH_MASS,
        radius: 51118 / EARTH_DIAMETER,
        color: "#a8c0c2"
    },
    {
        name: "Neptune",
        mass: 102 / EARTH_MASS,
        radius: 49528 / EARTH_DIAMETER,
        color: "#91afba"
    },
];
class PlanetScatterPlot extends ScatterPlot {
    render() {
        super.render();
        this.ctx.selectAll("sol-scatter-points")
            .data(SOL_PLANETS).join("circle")
            .attr("class", "scatter-point")
            .attr("cx", (d) => this.xScale(d.radius))
            .attr("cy", (d) => this.yScale(d.mass))
            .attr("r", 4)
            .attr("fill", (d) => d.color);
    }
}
//# sourceMappingURL=ScatterPlot.js.map