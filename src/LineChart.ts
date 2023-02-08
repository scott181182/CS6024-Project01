


interface LineConfig extends ChartConfig<d3.NumberValue, d3.NumberValue> {
    xScale?: "linear" | "log";
    yScale?: "linear" | "log";
}

class LineChart
{
    protected svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
    protected ctx: d3.Selection<SVGGElement, unknown, HTMLElement, any>;

    protected xScale: d3.ScaleContinuousNumeric<number, number, never>;
    protected yScale: d3.ScaleContinuousNumeric<number, number, never>;
    protected xAxis: d3.Axis<d3.NumberValue>;
    protected yAxis: d3.Axis<d3.NumberValue>;



    public constructor(
        protected data: [number, number][],
        protected lineConfig: LineConfig,
        protected drawConfig: DrawConfig,
    ) {
        const margin = drawConfig.margin || { top: 0, bottom: 0, left: 0, right: 0 };
        const totalWidth = drawConfig.width + margin.left + margin.right;
        const totalHeight = drawConfig.height + margin.top + margin.bottom;

        this.svg = createSVG(drawConfig.parent, totalWidth, totalHeight).append("svg");
        this.ctx = this.svg.append("g")
            .attr("class", "line-chart")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        const xDomain = d3.extent(data, ([ x, _ ]) => x) as  [number, number];
        const yDomain = d3.extent(data, ([ _, y ]) => y) as  [number, number];

        this.xScale = lineConfig.xScale === "log" ?
            d3.scaleLog(xDomain, [0, drawConfig.width]) :
            d3.scaleLinear(xDomain, [0, drawConfig.width]);
        this.yScale = lineConfig.xScale === "log" ?
            d3.scaleLog(yDomain, [drawConfig.height, 0]) :
            d3.scaleLinear(yDomain, [drawConfig.height, 0]);

        this.xAxis = d3.axisBottom(this.xScale);
        if(this.lineConfig.xTickFormat) {
            this.xAxis.tickFormat(this.lineConfig.xTickFormat);
        }
        this.yAxis = d3.axisLeft(this.yScale);
        if(this.lineConfig.yTickFormat) {
            this.yAxis.tickFormat(this.lineConfig.yTickFormat);
        }


        this.ctx.append("g")
            .call(this.xAxis)
            .attr("transform", `translate(0, ${drawConfig.height})`);
        this.svg.append("text")
            .attr("class", "x-label")
            .attr("text-anchor", "middle")
            .attr("x", margin.left + drawConfig.width / 2)
            .attr("y", margin.top + drawConfig.height + margin.bottom - 6)
            .text(this.lineConfig.xAxisLabel);
        this.ctx.append("g")
            .call(this.yAxis);
        this.svg.append("text")
            .attr("class", "y-label")
            .attr("text-anchor", "middle")
            .attr("x", 0 - margin.top - drawConfig.height / 2)
            .attr("y", 50)
            .attr("transform", "rotate(-90)")
            .text(this.lineConfig.yAxisLabel);

        this.ctx.append("polyline")
            .attr("class", "line-plot-line");
        this.render();
    }

    public render() {
        this.ctx.select(".line-plot-line")
            .attr("points", this.data.map(([x, y]) => `${this.xScale(x)},${this.yScale(y)}`).join(" "))
            .attr("stroke", "#000")
            .attr("fill", "none");
    }
}
