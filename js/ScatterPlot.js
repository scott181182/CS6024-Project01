"use strict";
class ScatterPlot extends AbstractXYChart {
    constructor(rawData, dataMapper, scatterConfig, drawConfig) {
        super(rawData, dataMapper, scatterConfig, drawConfig);
        const xDomain = d3.extent(this.data, ({ x }) => x);
        const yDomain = d3.extent(this.data, ({ y }) => y);
        this.xScale = this.chartConfig.xScale === "log" ?
            d3.scaleLog(xDomain, [0, drawConfig.width]) :
            d3.scaleLinear(xDomain, [0, drawConfig.width]);
        this.yScale = this.chartConfig.xScale === "log" ?
            d3.scaleLog(yDomain, [drawConfig.height, 0]) :
            d3.scaleLinear(yDomain, [drawConfig.height, 0]);
        this.xAxis = d3.axisBottom(this.xScale);
        this.yAxis = d3.axisLeft(this.yScale);
        this.renderAxes();
        this.render();
    }
    render() {
        const pointSel = this.ctx.selectAll(".scatter-point")
            .data(this.data).join("circle")
            .attr("class", (d) => `scatter-point data-element ${d.className}`)
            .attr("cx", (d) => this.xScale(d.x))
            .attr("cy", (d) => this.yScale(d.y))
            .attr("r", (d) => d.r || 2)
            .attr("fill", (d) => d.color || "#000");
        enableTooltip(pointSel, (d) => d.tooltip);
        this.renderUnknown();
    }
}
const EARTH_MASS = 5.97; // 10^24 kg
const EARTH_DIAMETER = 12756; // km
const SOL_PLANETS = [
    {
        tooltip: "Mercury",
        y: 0.330 / EARTH_MASS,
        x: 4879 / EARTH_DIAMETER,
        color: "#ffc74a",
        r: 4,
        className: "sol-planet",
    },
    {
        tooltip: "Venus",
        y: 4.87 / EARTH_MASS,
        x: 12104 / EARTH_DIAMETER,
        color: "#ff7a18",
        r: 4,
        className: "sol-planet",
    },
    {
        tooltip: "Earth",
        y: 1,
        x: 1,
        color: "#23ff89",
        r: 4,
        className: "sol-planet",
    },
    {
        tooltip: "Mars",
        y: 0.642 / EARTH_MASS,
        x: 6792 / EARTH_DIAMETER,
        color: "#db2520",
        r: 4,
        className: "sol-planet",
    },
    {
        tooltip: "Jupiter",
        y: 1898 / EARTH_MASS,
        x: 142984 / EARTH_DIAMETER,
        color: "#e4a47d",
        r: 4,
        className: "sol-planet",
    },
    {
        tooltip: "Saturn",
        y: 568 / EARTH_MASS,
        x: 120536 / EARTH_DIAMETER,
        color: "#fea050",
        r: 4,
        className: "sol-planet",
    },
    {
        tooltip: "Uranus",
        y: 86.8 / EARTH_MASS,
        x: 51118 / EARTH_DIAMETER,
        color: "#38b9fe",
        r: 4,
        className: "sol-planet",
    },
    {
        tooltip: "Neptune",
        y: 102 / EARTH_MASS,
        x: 49528 / EARTH_DIAMETER,
        color: "#6c9fcb",
        r: 4,
        className: "sol-planet",
    },
];
class PlanetScatterPlot extends ScatterPlot {
    setData(sourceData) {
        super.setData(sourceData);
        this.data.push(...SOL_PLANETS);
    }
    constructor(planets, scatterConfig, drawConfig) {
        super(planets, elementMapper((d) => (d.pl_rade !== undefined && d.pl_bmasse !== undefined ? {
            x: d.pl_rade,
            y: d.pl_bmasse,
            tooltip: d.pl_name
        } : undefined)), scatterConfig, drawConfig);
    }
}
//# sourceMappingURL=ScatterPlot.js.map