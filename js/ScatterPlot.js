"use strict";
class ScatterPlot {
    constructor(data, scatterConfig, drawConfig) {
        this.data = data;
        this.scatterConfig = scatterConfig;
        this.drawConfig = drawConfig;
        const margin = drawConfig.margin || { top: 0, bottom: 0, left: 0, right: 0 };
        this.svg = createSVG(drawConfig);
        this.ctx = this.svg.append("g")
            .attr("class", "scatter-plot")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);
        const xDomain = d3.extent(data, ({ x }) => x);
        const yDomain = d3.extent(data, ({ y }) => y);
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
        this.tooltip = d3.select("body").append("div")
            .attr("class", "scatter-tooltip")
            .style("display", "none");
        this.render();
    }
    render() {
        this.ctx.selectAll(".scatter-point")
            .data(this.data).join("circle")
            .attr("class", "scatter-point")
            .attr("cx", (d) => this.xScale(d.x))
            .attr("cy", (d) => this.yScale(d.y))
            .attr("r", (d) => d.r || 2)
            .attr("fill", (d) => d.color || "#000")
            .on("mouseover", (ev, d) => {
            if (!d.tooltip) {
                return;
            }
            this.tooltip
                .style("top", (ev.layerY + 5) + "px")
                .style("left", (ev.layerX + 5) + "px")
                .style("display", "block")
                .text(d.tooltip);
        })
            .on("mouseout", () => {
            this.tooltip.style("display", "none");
        });
    }
}
const EARTH_MASS = 5.97; // 10^24 kg
const EARTH_DIAMETER = 12756; // km
const SOL_PLANETS = [
    {
        tooltip: "Mercury",
        y: 0.330 / EARTH_MASS,
        x: 4879 / EARTH_DIAMETER,
        color: "#726658",
        r: 4,
    },
    {
        tooltip: "Venus",
        y: 4.87 / EARTH_MASS,
        x: 12104 / EARTH_DIAMETER,
        color: "#efecdd",
        r: 4,
    },
    {
        tooltip: "Earth",
        y: 1,
        x: 1,
        color: "#a49fb3",
        r: 4,
    },
    {
        tooltip: "Mars",
        y: 0.642 / EARTH_MASS,
        x: 6792 / EARTH_DIAMETER,
        color: "#896545",
        r: 4,
    },
    {
        tooltip: "Jupiter",
        y: 1898 / EARTH_MASS,
        x: 142984 / EARTH_DIAMETER,
        color: "#c3beab",
        r: 4,
    },
    {
        tooltip: "Saturn",
        y: 568 / EARTH_MASS,
        x: 120536 / EARTH_DIAMETER,
        color: "#c9b38e",
        r: 4,
    },
    {
        tooltip: "Uranus",
        y: 86.8 / EARTH_MASS,
        x: 51118 / EARTH_DIAMETER,
        color: "#a8c0c2",
        r: 4,
    },
    {
        tooltip: "Neptune",
        y: 102 / EARTH_MASS,
        x: 49528 / EARTH_DIAMETER,
        color: "#91afba",
        r: 4,
    },
];
class PlanetScatterPlot extends ScatterPlot {
    constructor(data, scatterConfig, drawConfig) {
        super([...data, ...SOL_PLANETS], scatterConfig, drawConfig);
    }
}
//# sourceMappingURL=ScatterPlot.js.map