

interface ChartConfig {
    hideUnknown?: boolean;
    title?: string;
}

abstract class AbstractChart<T, D, Config extends ChartConfig>
{
    protected data: D[] = [];

    protected svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
    protected ctx: d3.Selection<SVGGElement, unknown, HTMLElement, any>;

    protected margin: Margin;
    protected unknownPoints = 0;

    public setData(sourceData: T[]) {
        const chartData = this.dataMapper(sourceData);
        this.data = chartData.data;
        this.unknownPoints = chartData.unknownCount;
    }



    protected constructor(
        rawData: T[],
        protected dataMapper: DataMapperFn<T, D>,
        protected chartConfig: Config,
        protected drawConfig: DrawConfig,
    ) {
        this.margin = drawConfig.margin || { top: 0, bottom: 0, left: 0, right: 0 };
        this.svg = createSVG(drawConfig);
        this.ctx = this.svg.append("g")
            .attr("class", "chart-area")
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

        this.setData(rawData);

        if(chartConfig.title) {
            this.svg.append("text")
                .attr("text-anchor", "middle")
                .attr("x", this.margin.left + this.drawConfig.width / 2)
                .attr("y", this.margin.top - 10)
                .html(chartConfig.title);
        }
    }

    public renderUnknown() {
        if(!this.chartConfig.hideUnknown && this.unknownPoints) {
            this.ctx.selectAll(".unknown-label").data([this.unknownPoints]).join("text")
                .attr("class", "unknown-label")
                .attr("font-size", "smaller")
                .attr("text-anchor", "end")
                .attr("x", this.drawConfig.width)
                .attr("y", -5)
                .text((d) => `Unknown: ${d}`);
        }
    }

    public abstract render(): void;
}





interface XYChartConfig<X, Y> extends ChartConfig {
    xAxisLabel: string;
    xTickFormat?: (d: X) => string;
    yAxisLabel: string;
    yTickFormat?: (d: Y) => string;
}

abstract class AbstractXYChart<
    T, D,
    XKey extends keyof D,
    YKey extends keyof D,
    Config extends XYChartConfig<D[XKey], D[YKey]>
> extends AbstractChart<T, D, Config> {
    protected abstract xAxis: d3.Axis<D[XKey]>;
    protected abstract yAxis: d3.Axis<D[YKey]>;

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
}





type DataMapperFn<T, D> = (data: T[]) => ChartData<D>;
interface ChartData<D> {
    data: D[];
    unknownCount: number;
}

function elementMapper<T, D>(mapFn: (d: T) => D | undefined): DataMapperFn<T, D> {
    return (sourceData) => {
        const data: D[] = [];
        let unknownCount = 0;
        for(const t of sourceData) {
            const d = mapFn(t);
            if(d !== undefined) { data.push(d); }
            else { unknownCount++; }
        }
        return { data, unknownCount };
    }
}
function binMapper<T, D>(bucketFn: (d: T) => string | undefined, mapFn: (bucket: string, count: number) => D): DataMapperFn<T, D> {
    return (sourceData) => {
        const dict: Record<string, number> = {};
        let unknownCount = 0;
        for(const t of sourceData) {
            const key = bucketFn(t);
            if(!key) {
                unknownCount++;
                continue;
            }
            if(key in dict) { dict[key]++; }
            else { dict[key] = 1 }

        }
        const data = Object.entries(dict).map(([bucket, count]) => mapFn(bucket, count));
        return { data, unknownCount };
    }
}
