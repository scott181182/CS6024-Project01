interface ScatterConfig extends ChartConfig<number, number> {
    xScale?: "linear" | "log";
    yScale?: "linear" | "log";
}
interface ScatterDataPoint {
    x: number;
    y: number;
    r?: number;
    color?: string;
    tooltip?: string;
}
declare class ScatterPlot {
    protected data: ScatterDataPoint[];
    protected scatterConfig: ScatterConfig;
    protected drawConfig: DrawConfig;
    protected svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
    protected ctx: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
    protected xScale: d3.ScaleContinuousNumeric<number, number, never>;
    protected yScale: d3.ScaleContinuousNumeric<number, number, never>;
    protected xAxis: d3.Axis<d3.NumberValue>;
    protected yAxis: d3.Axis<d3.NumberValue>;
    protected tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
    constructor(data: ScatterDataPoint[], scatterConfig: ScatterConfig, drawConfig: DrawConfig);
    render(): void;
}
declare const EARTH_MASS = 5.97;
declare const EARTH_DIAMETER = 12756;
declare const SOL_PLANETS: ScatterDataPoint[];
declare class PlanetScatterPlot extends ScatterPlot {
    constructor(data: ScatterDataPoint[], scatterConfig: ScatterConfig, drawConfig: DrawConfig);
}
//# sourceMappingURL=ScatterPlot.d.ts.map