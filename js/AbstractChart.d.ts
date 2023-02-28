interface ChartConfig<D> {
    hideUnknown?: boolean;
    title?: string;
    onDataSelect?: (data: D) => void;
}
declare abstract class AbstractChart<T, D, Config extends ChartConfig<D>> {
    protected dataMapper: DataMapperFn<T, D>;
    protected chartConfig: Config;
    protected drawConfig: DrawConfig;
    protected data: D[];
    protected svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
    protected ctx: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
    protected margin: Margin;
    protected unknownPoints: number;
    setData(sourceData: T[]): void;
    protected constructor(rawData: T[], dataMapper: DataMapperFn<T, D>, chartConfig: Config, drawConfig: DrawConfig);
    renderUnknown(): void;
    abstract render(): void;
}
interface XYChartConfig<D, X, Y> extends ChartConfig<D> {
    xAxisLabel: string;
    xTickFormat?: (d: X) => string;
    yAxisLabel: string;
    yTickFormat?: (d: Y) => string;
}
declare abstract class AbstractXYChart<T, D, XKey extends keyof D, YKey extends keyof D, Config extends XYChartConfig<D, D[XKey], D[YKey]>> extends AbstractChart<T, D, Config> {
    protected abstract xAxis: d3.Axis<D[XKey]>;
    protected abstract yAxis: d3.Axis<D[YKey]>;
    protected renderAxes(xWrapWidth?: number): void;
}
type DataMapperFn<T, D> = (data: T[]) => ChartData<D>;
interface ChartData<D> {
    data: D[];
    unknownCount: number;
}
declare function elementMapper<T, D>(mapFn: (d: T) => D | undefined): DataMapperFn<T, D>;
declare function aggregateMapper<T, D>(bucketFn: (d: T) => string | undefined, mapFn: (bucket: string, count: number) => D): DataMapperFn<T, D>;
declare function binMapper<T>(mapFn: (d: T) => number | undefined, binConfig?: {
    bins?: number;
}): DataMapperFn<T, d3.Bin<number, number>>;
//# sourceMappingURL=AbstractChart.d.ts.map