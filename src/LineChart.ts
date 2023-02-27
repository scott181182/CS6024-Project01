


interface LineConfig extends XYChartConfig<number, number> {
    xScale?: "linear" | "log";
    yScale?: "linear" | "log";
}

class LineChart extends AbstractXYChart<Point2D, "x", "y", LineConfig>
{
    protected xScale: d3.ScaleContinuousNumeric<number, number, never>;
    protected yScale: d3.ScaleContinuousNumeric<number, number, never>;
    protected xAxis: d3.Axis<number>;
    protected yAxis: d3.Axis<number>;



    public constructor(
        chartData: ChartData<Point2D>,
        lineConfig: LineConfig,
        drawConfig: DrawConfig,
    ) {
        super(chartData, lineConfig, drawConfig);

        const xDomain = d3.extent(this.data, ({ x }) => x) as  [number, number];
        const yDomain = d3.extent(this.data, ({ y }) => y) as  [number, number];

        this.xScale = lineConfig.xScale === "log" ?
            d3.scaleLog(xDomain, [0, drawConfig.width]) :
            d3.scaleLinear(xDomain, [0, drawConfig.width]);
        this.yScale = lineConfig.xScale === "log" ?
            d3.scaleLog(yDomain, [drawConfig.height, 0]) :
            d3.scaleLinear(yDomain, [drawConfig.height, 0]);

        this.xAxis = d3.axisBottom<number>(this.xScale);
        if(this.chartConfig.xTickFormat) {
            this.xAxis.tickFormat(this.chartConfig.xTickFormat);
        }
        this.yAxis = d3.axisLeft<number>(this.yScale);
        if(this.chartConfig.yTickFormat) {
            this.yAxis.tickFormat(this.chartConfig.yTickFormat);
        }

        this.renderAxes();

        // this.ctx.append("g")
        //     .call(this.xAxis)
        //     .attr("transform", `translate(0, ${drawConfig.height})`);
        // this.svg.append("text")
        //     .attr("class", "x-label")
        //     .attr("text-anchor", "middle")
        //     .attr("x", margin.left + drawConfig.width / 2)
        //     .attr("y", margin.top + drawConfig.height + margin.bottom - 6)
        //     .text(this.lineConfig.xAxisLabel);
        // this.ctx.append("g")
        //     .call(this.yAxis);
        // this.svg.append("text")
        //     .attr("class", "y-label")
        //     .attr("text-anchor", "middle")
        //     .attr("x", 0 - margin.top - drawConfig.height / 2)
        //     .attr("y", 50)
        //     .attr("transform", "rotate(-90)")
        //     .text(this.lineConfig.yAxisLabel);

        this.ctx.append("polyline")
            .attr("class", "line-plot-line");
        this.render();
    }

    public render() {
        this.ctx.select(".line-plot-line")
            .attr("points", this.data.map(({ x, y }) => `${this.xScale(x)},${this.yScale(y)}`).join(" "))
            .attr("stroke", "#000")
            .attr("fill", "none");
    }
}
