


interface CommonBarConfig {
    labelOrder?: string[];
    labelSort?: (a: string, b: string) => number;
    sort?: (a: BarData, b: BarData) => number;
    colorScheme?: readonly string[];
}
interface BarConfig extends CommonBarConfig, XYChartConfig<BarData, string, number> {  }
interface HorizontalBarConfig extends CommonBarConfig, XYChartConfig<BarData, number, string> {  }

interface BarData {
    label: string;
    value: number;
    tooltip?: string;
    color?: string;
}

abstract class AbstractBarChart<
    T,
    XKey extends keyof BarData,
    YKey extends keyof BarData,
    Config extends CommonBarConfig & XYChartConfig<BarData, BarData[XKey], BarData[YKey]>
> extends AbstractXYChart<T, BarData, XKey, YKey, Config>
{
    protected cScale?: d3.ScaleOrdinal<string, string>;



    public setData(sourceData: T[]): void {
        super.setData(sourceData);

        const sortFn = this.chartConfig.sort ||
            (this.chartConfig.labelSort ? (a: BarData, b: BarData) => this.chartConfig.labelSort!(a.label, b.label) :
            (this.chartConfig.labelOrder ? ((a: BarData, b: BarData) => this.chartConfig.labelOrder!.indexOf(a.label) - this.chartConfig.labelOrder!.indexOf(b.label)) :
                (a: BarData, b: BarData) => a.label.localeCompare(b.label)));
        this.data.sort(sortFn);

        this.initAxes();
    }

    protected abstract initAxes(): void;

    public constructor(
        rawData: T[],
        dataMapper: DataMapperFn<T, BarData>,
        barConfig: Config,
        drawConfig: DrawConfig,
    ) {
        super(rawData, dataMapper, barConfig, drawConfig);

        this.render();
    }

}



class BarChart<T> extends AbstractBarChart<T, "label", "value", BarConfig>
{
    protected xScale!: d3.ScaleBand<string>;
    protected yScale!: d3.ScaleLinear<number, number, never>;
    protected xAxis!: d3.Axis<string>;
    protected yAxis!: d3.Axis<number>;

    protected cScale?: d3.ScaleOrdinal<string, string>;



    protected initAxes(): void {
        const xDomain = this.data.map(({ label }) => label);
        const yDomain = [0, d3.max(this.data, ({ value }) => value)!] as const;

        this.xScale = d3.scaleBand()
            .domain(xDomain)
            .range([0, this.drawConfig.width])
            .padding(0.4);
        this.yScale = d3.scaleLinear()
            .domain(yDomain)
            .range([this.drawConfig.height, 0]);
        if(this.chartConfig.colorScheme) {
            this.cScale = d3.scaleOrdinal(xDomain, this.chartConfig.colorScheme)
        }

        this.xAxis = d3.axisBottom(this.xScale);
        this.yAxis = d3.axisLeft<number>(this.yScale);

        this.renderAxes(this.xScale.bandwidth());
    }

    public render() {
        const barSel = this.ctx.selectAll(".bar").data(this.data).join("rect")
            .attr("class", "bar data-element")
            .attr("x", (d) => this.xScale(d.label)!)
            .attr("y", (d) => this.yScale(d.value))
            .attr("width", this.xScale.bandwidth())
            .attr("height", (d) => this.drawConfig.height - this.yScale(d.value))
            .attr("fill", (d) => d.color || this.cScale?.(d.label) || "#000")
            .on("click", (ev: MouseEvent, d) => {
                ev.stopPropagation();
                this.chartConfig.onDataSelect?.(d);
            });
        enableTooltip(barSel, (d) => d.tooltip);
    }
}


class HorizontalBarChart<T> extends AbstractBarChart<T, "value", "label", HorizontalBarConfig>
{
    protected xScale!: d3.ScaleLinear<number, number, never>;
    protected yScale!: d3.ScaleBand<string>;
    protected xAxis!: d3.Axis<number>;
    protected yAxis!: d3.Axis<string>;

    protected cScale?: d3.ScaleOrdinal<string, string>;



    protected initAxes(): void {
        const xDomain = [0, d3.max(this.data, ({ value }) => value)!] as const;
        const yDomain = this.data.map(({ label }) => label)

        this.xScale = d3.scaleLinear()
            .domain(xDomain)
            .range([0, this.drawConfig.width]);
        this.yScale = d3.scaleBand()
            .domain(yDomain)
            .range([0, this.drawConfig.height])
            .padding(0.4);
        if(this.chartConfig.colorScheme) {
            this.cScale = d3.scaleOrdinal(yDomain, this.chartConfig.colorScheme)
        }

        this.xAxis = d3.axisBottom<number>(this.xScale);
        this.yAxis = d3.axisLeft(this.yScale);

        this.renderAxes();
    }

    public render() {
        const barSel = this.ctx.selectAll(".bar").data(this.data).join("rect")
            .attr("class", "bar data-element")
            .attr("y", (d) => this.yScale(d.label)!)
            .attr("x", 0)
            .attr("height", this.yScale.bandwidth())
            .attr("width", (d) => this.xScale(d.value))
            .attr("fill", (d) => d.color || this.cScale?.(d.label) || "#000")
            .on("click", (ev: MouseEvent, d) => {
                ev.stopPropagation();
                this.chartConfig.onDataSelect?.(d);
            });
        enableTooltip(barSel, (d) => d.tooltip);

        this.renderUnknown();
    }
}
