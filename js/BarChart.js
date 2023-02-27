"use strict";
class BarChart extends AbstractXYChart {
    constructor(chartData, barConfig, drawConfig) {
        super(chartData, barConfig, drawConfig);
        const xDomain = this.data.map(({ label }) => label);
        const yDomain = [0, d3.max(this.data, ({ value }) => value)];
        this.xScale = d3.scaleBand()
            .domain(xDomain)
            .range([0, drawConfig.width])
            .padding(0.4);
        this.yScale = d3.scaleLinear()
            .domain(yDomain)
            .range([drawConfig.height, 0]);
        if (this.chartConfig.colorScheme) {
            this.cScale = d3.scaleOrdinal(xDomain, this.chartConfig.colorScheme);
        }
        this.xAxis = d3.axisBottom(this.xScale);
        this.yAxis = d3.axisLeft(this.yScale);
        this.renderAxes(this.xScale.bandwidth());
        this.render();
    }
    setData(chartData) {
        super.setData(chartData);
        const sortFn = this.chartConfig.sort ||
            (this.chartConfig.labelSort ? (a, b) => this.chartConfig.labelSort(a.label, b.label) :
                (this.chartConfig.labelOrder ? ((a, b) => this.chartConfig.labelOrder.indexOf(a.label) - this.chartConfig.labelOrder.indexOf(b.label)) :
                    (a, b) => a.label.localeCompare(b.label)));
        this.data.sort(sortFn);
    }
    render() {
        const barSel = this.ctx.selectAll(".bar").data(this.data).join("rect")
            .attr("class", "bar data-element")
            .attr("x", (d) => this.xScale(d.label))
            .attr("y", (d) => this.yScale(d.value))
            .attr("width", this.xScale.bandwidth())
            .attr("height", (d) => this.drawConfig.height - this.yScale(d.value))
            .attr("fill", (d) => { var _a; return d.color || ((_a = this.cScale) === null || _a === void 0 ? void 0 : _a.call(this, d.label)) || "#000"; });
        enableTooltip(barSel, (d) => d.tooltip);
    }
}
class HorizontalBarChart extends AbstractXYChart {
    constructor(chartData, barConfig, drawConfig) {
        super(chartData, barConfig, drawConfig);
        const xDomain = [0, d3.max(this.data, ({ value }) => value)];
        const yDomain = this.data.map(({ label }) => label);
        this.xScale = d3.scaleLinear()
            .domain(xDomain)
            .range([0, drawConfig.width]);
        this.yScale = d3.scaleBand()
            .domain(yDomain)
            .range([0, drawConfig.height])
            .padding(0.4);
        if (this.chartConfig.colorScheme) {
            this.cScale = d3.scaleOrdinal(yDomain, this.chartConfig.colorScheme);
        }
        this.xAxis = d3.axisBottom(this.xScale);
        this.yAxis = d3.axisLeft(this.yScale);
        this.renderAxes();
        // this.ctx.append("g")
        //     .call(this.xAxis)
        //         .attr("transform", `translate(0, ${drawConfig.height})`)
        // this.svg.append("text")
        //     .attr("class", "x-label")
        //     .attr("text-anchor", "middle")
        //     .attr("x", this.margin.left + drawConfig.width / 2)
        //     .attr("y", this.margin.top + drawConfig.height + this.margin.bottom - 6)
        //     .text(this.chartConfig.xAxisLabel);
        // this.ctx.append("g")
        //     .call(this.yAxis)
        // this.svg.append("text")
        //     .attr("class", "y-label")
        //     .attr("text-anchor", "middle")
        //     .attr("x", 0 - this.margin.top - drawConfig.height / 2)
        //     .attr("y", 50)
        //     .attr("transform", "rotate(-90)")
        //     .text(this.chartConfig.yAxisLabel);
        this.render();
    }
    setData(chartData) {
        super.setData(chartData);
        const sortFn = this.chartConfig.sort ||
            (this.chartConfig.labelSort ? (a, b) => this.chartConfig.labelSort(a.label, b.label) :
                (this.chartConfig.labelOrder ? ((a, b) => this.chartConfig.labelOrder.indexOf(a.label) - this.chartConfig.labelOrder.indexOf(b.label)) :
                    (a, b) => a.label.localeCompare(b.label)));
        this.data.sort(sortFn);
    }
    render() {
        const barSel = this.ctx.selectAll(".bar").data(this.data).join("rect")
            .attr("class", "bar data-element")
            .attr("y", (d) => this.yScale(d.label))
            .attr("x", 0)
            .attr("height", this.yScale.bandwidth())
            .attr("width", (d) => this.xScale(d.value))
            .attr("fill", (d) => { var _a; return d.color || ((_a = this.cScale) === null || _a === void 0 ? void 0 : _a.call(this, d.label)) || "#000"; });
        enableTooltip(barSel, (d) => d.tooltip);
        this.renderUnknown();
    }
}
//# sourceMappingURL=BarChart.js.map