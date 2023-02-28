interface HistogramConfig extends XYChartConfig<number, number> {
    color?: string;
    bins?: number;
}
declare class HistogramChart<T> extends AbstractChart<T, number, HistogramConfig> {
    protected xScale: d3.ScaleLinear<number, number, never>;
    protected yScale: d3.ScaleLinear<number, number, never>;
    protected xAxis: d3.Axis<number>;
    protected yAxis: d3.Axis<number>;
    protected bin: d3.HistogramGeneratorNumber<number, number>;
    protected buckets: d3.Bin<number, number>[];
    setData(sourceData: T[]): void;
    constructor(rawData: T[], dataMapper: DataMapperFn<T, number>, histogramConfig: HistogramConfig, drawConfig: DrawConfig);
    protected renderAxes(xWrapWidth?: number): void;
    render(): void;
}
//# sourceMappingURL=Histogram.d.ts.map