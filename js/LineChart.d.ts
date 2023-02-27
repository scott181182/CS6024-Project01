interface LineConfig extends XYChartConfig<number, number> {
    xScale?: "linear" | "log";
    yScale?: "linear" | "log";
}
declare class LineChart extends AbstractXYChart<Point2D, "x", "y", LineConfig> {
    protected xScale: d3.ScaleContinuousNumeric<number, number, never>;
    protected yScale: d3.ScaleContinuousNumeric<number, number, never>;
    protected xAxis: d3.Axis<number>;
    protected yAxis: d3.Axis<number>;
    constructor(chartData: ChartData<Point2D>, lineConfig: LineConfig, drawConfig: DrawConfig);
    render(): void;
}
//# sourceMappingURL=LineChart.d.ts.map