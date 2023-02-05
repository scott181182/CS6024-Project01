interface ScatterConfig extends ChartConfig {
    xScale?: "linear" | "log";
    yScale?: "linear" | "log";
}
declare class ScatterPlot {
    protected data: [number, number][];
    protected scatterConfig: ScatterConfig;
    protected drawConfig: DrawConfig;
    protected svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
    protected ctx: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
    protected xScale: d3.ScaleContinuousNumeric<number, number, never>;
    protected yScale: d3.ScaleContinuousNumeric<number, number, never>;
    protected xAxis: d3.Axis<d3.NumberValue>;
    protected yAxis: d3.Axis<d3.NumberValue>;
    constructor(data: [number, number][], scatterConfig: ScatterConfig, drawConfig: DrawConfig);
    render(): void;
}
declare const EARTH_MASS = 5.97;
declare const EARTH_DIAMETER = 12756;
declare const SOL_PLANETS: {
    name: string;
    mass: number;
    radius: number;
    color: string;
}[];
declare class PlanetScatterPlot extends ScatterPlot {
    render(): void;
}
//# sourceMappingURL=ScatterPlot.d.ts.map