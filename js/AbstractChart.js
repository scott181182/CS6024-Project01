"use strict";
class AbstractChart {
    setData(sourceData) {
        const chartData = this.dataMapper(sourceData);
        this.data = chartData.data;
        this.unknownPoints = chartData.unknownCount;
    }
    constructor(rawData, dataMapper, chartConfig, drawConfig) {
        this.dataMapper = dataMapper;
        this.chartConfig = chartConfig;
        this.drawConfig = drawConfig;
        this.data = [];
        this.unknownPoints = 0;
        this.margin = drawConfig.margin || { top: 0, bottom: 0, left: 0, right: 0 };
        this.svg = createSVG(drawConfig);
        this.ctx = this.svg.append("g")
            .attr("class", "chart-area")
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);
        this.setData(rawData);
        if (chartConfig.title) {
            this.svg.append("text")
                .attr("text-anchor", "middle")
                .attr("x", this.margin.left + this.drawConfig.width / 2)
                .attr("y", this.margin.top - 10)
                .html(chartConfig.title);
        }
    }
    renderUnknown() {
        if (!this.chartConfig.hideUnknown && this.unknownPoints) {
            this.ctx.selectAll(".unknown-label").data([this.unknownPoints]).join("text")
                .attr("class", "unknown-label")
                .attr("font-size", "smaller")
                .attr("text-anchor", "end")
                .attr("x", this.drawConfig.width)
                .attr("y", -5)
                .text((d) => `Unknown: ${d}`);
        }
    }
}
class AbstractXYChart extends AbstractChart {
    renderAxes(xWrapWidth) {
        const xAxisSel = this.ctx.append("g")
            .call(this.xAxis)
            .attr("transform", `translate(0, ${this.drawConfig.height})`);
        if (xWrapWidth !== undefined) {
            xAxisSel.selectAll(".tick text")
                .call(wrapAxisText, xWrapWidth);
        }
        this.svg.append("text")
            .attr("class", "x-label")
            .attr("text-anchor", "middle")
            .attr("x", this.margin.left + this.drawConfig.width / 2)
            .attr("y", this.margin.top + this.drawConfig.height + this.margin.bottom - 6)
            .text(this.chartConfig.xAxisLabel);
        this.ctx.append("g")
            .call(this.yAxis);
        this.svg.append("text")
            .attr("class", "y-label")
            .attr("text-anchor", "middle")
            .attr("x", 0 - this.margin.top - this.drawConfig.height / 2)
            .attr("y", 50)
            .attr("transform", "rotate(-90)")
            .text(this.chartConfig.yAxisLabel);
    }
}
function elementMapper(mapFn) {
    return (sourceData) => {
        const data = [];
        let unknownCount = 0;
        for (const t of sourceData) {
            const d = mapFn(t);
            if (d !== undefined) {
                data.push(d);
            }
            else {
                unknownCount++;
            }
        }
        return { data, unknownCount };
    };
}
function binMapper(bucketFn, mapFn) {
    return (sourceData) => {
        const dict = {};
        let unknownCount = 0;
        for (const t of sourceData) {
            const key = bucketFn(t);
            if (!key) {
                unknownCount++;
                continue;
            }
            if (key in dict) {
                dict[key]++;
            }
            else {
                dict[key] = 1;
            }
        }
        const data = Object.entries(dict).map(([bucket, count]) => mapFn(bucket, count));
        return { data, unknownCount };
    };
}
//# sourceMappingURL=AbstractChart.js.map