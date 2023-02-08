interface LineConfig extends ChartConfig<d3.NumberValue, d3.NumberValue> {
    xScale?: "linear" | "log";
    yScale?: "linear" | "log";
}
declare class LineChart {
    protected data: [number, number][];
    protected lineConfig: LineConfig;
    protected drawConfig: DrawConfig;
    protected svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
    protected ctx: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
    protected xScale: d3.ScaleContinuousNumeric<number, number, never>;
    protected yScale: d3.ScaleContinuousNumeric<number, number, never>;
    protected xAxis: d3.Axis<d3.NumberValue>;
    protected yAxis: d3.Axis<d3.NumberValue>;
    constructor(data: [number, number][], lineConfig: LineConfig, drawConfig: DrawConfig);
    render(): void;
}
//# sourceMappingURL=LineChart.d.ts.map