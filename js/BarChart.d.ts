interface BarConfig extends XYChartConfig<string, number> {
    labelOrder?: string[];
    labelSort?: (a: string, b: string) => number;
    sort?: (a: BarData, b: BarData) => number;
    colorScheme?: readonly string[];
}
interface HorizontalBarConfig extends XYChartConfig<number, string> {
    labelOrder?: string[];
    labelSort?: (a: string, b: string) => number;
    sort?: (a: BarData, b: BarData) => number;
    colorScheme?: readonly string[];
}
interface BarData {
    label: string;
    value: number;
    tooltip?: string;
    color?: string;
}
declare class BarChart extends AbstractXYChart<BarData, "label", "value", BarConfig> {
    protected xScale: d3.ScaleBand<string>;
    protected yScale: d3.ScaleLinear<number, number, never>;
    protected xAxis: d3.Axis<string>;
    protected yAxis: d3.Axis<number>;
    protected cScale?: d3.ScaleOrdinal<string, string>;
    constructor(chartData: ChartData<BarData>, barConfig: BarConfig, drawConfig: DrawConfig);
    protected setData(chartData: ChartData<BarData>): void;
    render(): void;
}
declare class HorizontalBarChart extends AbstractXYChart<BarData, "value", "label", HorizontalBarConfig> {
    protected xScale: d3.ScaleLinear<number, number, never>;
    protected yScale: d3.ScaleBand<string>;
    protected xAxis: d3.Axis<number>;
    protected yAxis: d3.Axis<string>;
    protected cScale?: d3.ScaleOrdinal<string, string>;
    constructor(chartData: ChartData<BarData>, barConfig: HorizontalBarConfig, drawConfig: DrawConfig);
    protected setData(chartData: ChartData<BarData>): void;
    render(): void;
}
//# sourceMappingURL=BarChart.d.ts.map