


interface BarConfig extends XYChartConfig<string, number> {
    labelOrder?: string[];
    labelSort?: (a: string, b: string) => number;
    sort?: (a: BarData, b: BarData) => number;
    colorScheme?: readonly string[]
}
interface HorizontalBarConfig extends XYChartConfig<number, string> {
    labelOrder?: string[];
    labelSort?: (a: string, b: string) => number;
    sort?: (a: BarData, b: BarData) => number;
    colorScheme?: readonly string[]
}

interface BarData {
    label: string;
    value: number;
    tooltip?: string;
    color?: string;
}

class BarChart extends AbstractXYChart<BarData, "label", "value", BarConfig>
{
    protected xScale: d3.ScaleBand<string>;
    protected yScale: d3.ScaleLinear<number, number, never>;
    protected xAxis: d3.Axis<string>;
    protected yAxis: d3.Axis<number>;

    protected cScale?: d3.ScaleOrdinal<string, string>;



    public constructor(
        chartData: ChartData<BarData>,
        barConfig: BarConfig,
        drawConfig: DrawConfig,
    ) {
        super(chartData, barConfig, drawConfig);

        const xDomain = this.data.map(({ label }) => label);
        const yDomain = [0, d3.max(this.data, ({ value }) => value)!] as const;

        this.xScale = d3.scaleBand()
            .domain(xDomain)
            .range([0, drawConfig.width])
            .padding(0.4);
        this.yScale = d3.scaleLinear()
            .domain(yDomain)
            .range([drawConfig.height, 0]);
        if(this.chartConfig.colorScheme) {
            this.cScale = d3.scaleOrdinal(xDomain, this.chartConfig.colorScheme)
        }

        this.xAxis = d3.axisBottom(this.xScale);
        this.yAxis = d3.axisLeft<number>(this.yScale);

        this.renderAxes(this.xScale.bandwidth());
        this.render();
    }

    protected setData(chartData: ChartData<BarData>): void {
        super.setData(chartData);

        const sortFn = this.chartConfig.sort ||
            (this.chartConfig.labelSort ? (a: BarData, b: BarData) => this.chartConfig.labelSort!(a.label, b.label) :
            (this.chartConfig.labelOrder ? ((a: BarData, b: BarData) => this.chartConfig.labelOrder!.indexOf(a.label) - this.chartConfig.labelOrder!.indexOf(b.label)) :
                (a: BarData, b: BarData) => a.label.localeCompare(b.label)));
        this.data.sort(sortFn);
    }

    public render() {
        const barSel = this.ctx.selectAll(".bar").data(this.data).join("rect")
            .attr("class", "bar data-element")
            .attr("x", (d) => this.xScale(d.label)!)
            .attr("y", (d) => this.yScale(d.value))
            .attr("width", this.xScale.bandwidth())
            .attr("height", (d) => this.drawConfig.height - this.yScale(d.value))
            .attr("fill", (d) => d.color || this.cScale?.(d.label) || "#000");
        enableTooltip(barSel, (d) => d.tooltip);
    }
}


class HorizontalBarChart extends AbstractXYChart<BarData, "value", "label", HorizontalBarConfig>
{
    protected xScale: d3.ScaleLinear<number, number, never>;
    protected yScale: d3.ScaleBand<string>;
    protected xAxis: d3.Axis<number>;
    protected yAxis: d3.Axis<string>;

    protected cScale?: d3.ScaleOrdinal<string, string>;



    public constructor(
        chartData: ChartData<BarData>,
        barConfig: HorizontalBarConfig,
        drawConfig: DrawConfig,
    ) {
        super(chartData, barConfig, drawConfig);

        const xDomain = [0, d3.max(this.data, ({ value }) => value)!] as const;
        const yDomain = this.data.map(({ label }) => label)

        this.xScale = d3.scaleLinear()
            .domain(xDomain)
            .range([0, drawConfig.width]);
        this.yScale = d3.scaleBand()
            .domain(yDomain)
            .range([0, drawConfig.height])
            .padding(0.4);
        if(this.chartConfig.colorScheme) {
            this.cScale = d3.scaleOrdinal(yDomain, this.chartConfig.colorScheme)
        }

        this.xAxis = d3.axisBottom<number>(this.xScale);
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

    protected setData(chartData: ChartData<BarData>): void {
        super.setData(chartData);

        const sortFn = this.chartConfig.sort ||
            (this.chartConfig.labelSort ? (a: BarData, b: BarData) => this.chartConfig.labelSort!(a.label, b.label) :
            (this.chartConfig.labelOrder ? ((a: BarData, b: BarData) => this.chartConfig.labelOrder!.indexOf(a.label) - this.chartConfig.labelOrder!.indexOf(b.label)) :
                (a: BarData, b: BarData) => a.label.localeCompare(b.label)));
        this.data.sort(sortFn);
    }

    public render() {
        const barSel = this.ctx.selectAll(".bar").data(this.data).join("rect")
            .attr("class", "bar data-element")
            .attr("y", (d) => this.yScale(d.label)!)
            .attr("x", 0)
            .attr("height", this.yScale.bandwidth())
            .attr("width", (d) => this.xScale(d.value))
            .attr("fill", (d) => d.color || this.cScale?.(d.label) || "#000");
        enableTooltip(barSel, (d) => d.tooltip);

        this.renderUnknown();
    }
}
