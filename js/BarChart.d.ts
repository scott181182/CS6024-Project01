interface CommonBarConfig {
    labelOrder?: string[];
    labelSort?: (a: string, b: string) => number;
    sort?: (a: BarData, b: BarData) => number;
    colorScheme?: readonly string[];
}
interface BarConfig extends CommonBarConfig, XYChartConfig<BarData, string, number> {
}
interface HorizontalBarConfig extends CommonBarConfig, XYChartConfig<BarData, number, string> {
}
interface BarData {
    label: string;
    value: number;
    tooltip?: string;
    color?: string;
}
declare abstract class AbstractBarChart<T, XKey extends keyof BarData, YKey extends keyof BarData, Config extends CommonBarConfig & XYChartConfig<BarData, BarData[XKey], BarData[YKey]>> extends AbstractXYChart<T, BarData, XKey, YKey, Config> {
    protected cScale?: d3.ScaleOrdinal<string, string>;
    setData(sourceData: T[]): void;
    protected abstract initAxes(): void;
    constructor(rawData: T[], dataMapper: DataMapperFn<T, BarData>, barConfig: Config, drawConfig: DrawConfig);
}
declare class BarChart<T> extends AbstractBarChart<T, "label", "value", BarConfig> {
    protected xScale: d3.ScaleBand<string>;
    protected yScale: d3.ScaleLinear<number, number, never>;
    protected xAxis: d3.Axis<string>;
    protected yAxis: d3.Axis<number>;
    protected cScale?: d3.ScaleOrdinal<string, string>;
    protected initAxes(): void;
    render(): void;
}
declare class HorizontalBarChart<T> extends AbstractBarChart<T, "value", "label", HorizontalBarConfig> {
    protected xScale: d3.ScaleLinear<number, number, never>;
    protected yScale: d3.ScaleBand<string>;
    protected xAxis: d3.Axis<number>;
    protected yAxis: d3.Axis<string>;
    protected cScale?: d3.ScaleOrdinal<string, string>;
    protected initAxes(): void;
    render(): void;
}
//# sourceMappingURL=BarChart.d.ts.map