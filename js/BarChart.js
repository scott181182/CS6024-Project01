"use strict";
class BarChart {
    constructor(data, barConfig, drawConfig) {
        this.data = data;
        this.barConfig = barConfig;
        this.drawConfig = drawConfig;
        const margin = drawConfig.margin || { top: 0, bottom: 0, left: 0, right: 0 };
        this.svg = createSVG(drawConfig);
        this.ctx = this.svg.append("g")
            .attr("class", "bar-chart")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);
        const xDomain = data.map(({ label }) => label);
        const yDomain = [0, d3.max(data, ({ value }) => value)];
        this.xScale = d3.scaleBand()
            .domain(xDomain)
            .range([0, drawConfig.width])
            .padding(0.4);
        this.yScale = d3.scaleLinear()
            .domain(yDomain)
            .range([drawConfig.height, 0]);
        this.xAxis = d3.axisBottom(this.xScale);
        this.yAxis = d3.axisLeft(this.yScale);
        this.ctx.append("g")
            .call(this.xAxis)
            .attr("transform", `translate(0, ${drawConfig.height})`)
            .selectAll(".tick text")
            .call(wrapAxisText, this.xScale.bandwidth());
        this.svg.append("text")
            .attr("class", "x-label")
            .attr("text-anchor", "middle")
            .attr("x", margin.left + drawConfig.width / 2)
            .attr("y", margin.top + drawConfig.height + margin.bottom - 6)
            .text(this.barConfig.xAxisLabel);
        this.ctx.append("g")
            .call(this.yAxis);
        this.svg.append("text")
            .attr("class", "y-label")
            .attr("text-anchor", "middle")
            .attr("x", 0 - margin.top - drawConfig.height / 2)
            .attr("y", 50)
            .attr("transform", "rotate(-90)")
            .text(this.barConfig.yAxisLabel);
        this.render();
    }
    render() {
        this.ctx.selectAll(".bar").data(this.data).join("rect")
            .attr("class", "bar data-element")
            .attr("x", (d) => this.xScale(d.label))
            .attr("y", (d) => this.yScale(d.value))
            .attr("width", this.xScale.bandwidth())
            .attr("height", (d) => this.drawConfig.height - this.yScale(d.value))
            .attr("fill", (d) => d.color || "#000");
    }
}
class HorizontalBarChart {
    constructor(data, barConfig, drawConfig) {
        this.data = data;
        this.barConfig = barConfig;
        this.drawConfig = drawConfig;
        const margin = drawConfig.margin || { top: 0, bottom: 0, left: 0, right: 0 };
        this.svg = createSVG(drawConfig);
        this.ctx = this.svg.append("g")
            .attr("class", "bar-chart")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);
        const xDomain = [0, d3.max(data, ({ value }) => value)];
        const yDomain = data.map(({ label }) => label);
        this.xScale = d3.scaleLinear()
            .domain(xDomain)
            .range([0, drawConfig.width]);
        this.yScale = d3.scaleBand()
            .domain(yDomain)
            .range([drawConfig.height, 0])
            .padding(0.4);
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
            .text(this.barConfig.xAxisLabel);
        this.ctx.append("g")
            .call(this.yAxis);
        this.svg.append("text")
            .attr("class", "y-label")
            .attr("text-anchor", "middle")
            .attr("x", 0 - margin.top - drawConfig.height / 2)
            .attr("y", 50)
            .attr("transform", "rotate(-90)")
            .text(this.barConfig.yAxisLabel);
        this.render();
    }
    render() {
        this.ctx.selectAll(".bar").data(this.data).join("rect")
            .attr("class", "bar data-element")
            .attr("y", (d) => this.yScale(d.label))
            .attr("x", 0)
            .attr("height", this.yScale.bandwidth())
            .attr("width", (d) => this.xScale(d.value))
            .attr("fill", (d) => d.color || "#000");
    }
}
//# sourceMappingURL=BarChart.js.map