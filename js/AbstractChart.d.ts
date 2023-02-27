declare abstract class AbstractChart<D, Config extends ChartConfig> {
    protected chartConfig: Config;
    protected drawConfig: DrawConfig;
    protected data: D[];
    protected svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
    protected ctx: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
    protected margin: Margin;
    protected unknownPoints: number;
    protected setData(chartData: ChartData<D>): void;
    protected constructor(chartData: ChartData<D>, chartConfig: Config, drawConfig: DrawConfig);
    renderUnknown(): void;
    abstract render(): void;
}
declare abstract class AbstractXYChart<D, XKey extends keyof D, YKey extends keyof D, Config extends XYChartConfig<D[XKey], D[YKey]>> extends AbstractChart<D, Config> {
    protected abstract xAxis: d3.Axis<D[XKey]>;
    protected abstract yAxis: d3.Axis<D[YKey]>;
    protected renderAxes(xWrapWidth?: number): void;
}
interface ChartData<D> {
    data: D[];
    unknownCount: number;
}
declare function dataMapper<T, D>(sourceData: T[], mapFn: (d: T) => D | undefined): ChartData<D>;
declare function binMapper<T, D>(sourceData: T[], bucketFn: (d: T) => string | undefined, mapFn: (bucket: string, count: number) => D): ChartData<D>;
//# sourceMappingURL=AbstractChart.d.ts.map