


interface HistogramConfig extends XYChartConfig<number, number> {
    color?: string;
    bins?: number;
}

class HistogramChart<T> extends AbstractChart<T, number, HistogramConfig>
{
    protected xScale: d3.ScaleLinear<number, number, never>;
    protected yScale: d3.ScaleLinear<number, number, never>;
    protected xAxis: d3.Axis<number>;
    protected yAxis: d3.Axis<number>;

    protected bin: d3.HistogramGeneratorNumber<number, number>;
    protected buckets: d3.Bin<number, number>[];

    public setData(sourceData: T[]) {
        super.setData(sourceData);

        this.bin = d3.bin();
        if(this.chartConfig.bins) {
            this.bin = this.bin.thresholds(this.chartConfig.bins);
        }

        this.buckets = this.bin(this.data);
    }



    public constructor(
        rawData: T[],
        dataMapper: DataMapperFn<T, number>,
        histogramConfig: HistogramConfig,
        drawConfig: DrawConfig,
    ) {
        super(rawData, dataMapper, histogramConfig, drawConfig);

        this.bin = d3.bin();
        if(this.chartConfig.bins) {
            this.bin = this.bin.thresholds(this.chartConfig.bins);
        }
        this.buckets = this.bin(this.data);

        const xDomain = this.bin.domain()(this.data) as [number, number];

        this.xScale = d3.scaleLinear()
            .domain(xDomain)
            .range([0, drawConfig.width]);
        this.yScale = d3.scaleLinear()
            .domain([0, d3.max(this.buckets, (b) => b.length)!])
            .range([drawConfig.height, 0]);

        this.xAxis = d3.axisBottom<number>(this.xScale);
        this.yAxis = d3.axisLeft<number>(this.yScale);

        this.renderAxes();
        this.render();
    }

    protected renderAxes(xWrapWidth?: number) {
        const xAxisSel = this.ctx.append("g")
            .call(this.xAxis)
                .attr("transform", `translate(0, ${this.drawConfig.height})`);
        if(xWrapWidth !== undefined) {
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

    public render() {
        const barSel = this.ctx.selectAll(".bar").data(this.buckets).join("rect")
            .attr("class", "bar data-element")
            .attr("x", (d) => this.xScale(d.x0!)!)
            .attr("y", (d) => this.yScale(d.length))
            .attr("width", (d) => this.xScale(d.x1! - d.x0!)!)
            .attr("height", (d) => this.drawConfig.height - this.yScale(d.length))
            .attr("fill", (d) => this.chartConfig.color || "#000");
        enableTooltip(barSel, (d) => `${d.length}`);
        this.renderUnknown();
    }
}
