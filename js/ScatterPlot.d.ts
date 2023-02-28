interface ScatterConfig extends XYChartConfig<ScatterData, number, number> {
    xScale?: "linear" | "log";
    yScale?: "linear" | "log";
}
interface ScatterData extends Point2D {
    r?: number;
    color?: string;
    className?: string;
    tooltip?: string;
}
declare class ScatterPlot<T> extends AbstractXYChart<T, ScatterData, "x", "y", ScatterConfig> {
    protected xScale: d3.ScaleContinuousNumeric<number, number, never>;
    protected yScale: d3.ScaleContinuousNumeric<number, number, never>;
    protected xAxis: d3.Axis<number>;
    protected yAxis: d3.Axis<number>;
    constructor(rawData: T[], dataMapper: DataMapperFn<T, ScatterData>, scatterConfig: ScatterConfig, drawConfig: DrawConfig);
    render(): void;
}
declare const EARTH_MASS = 5.97;
declare const EARTH_DIAMETER = 12756;
declare const SOL_PLANETS: ScatterData[];
declare class PlanetScatterPlot extends ScatterPlot<PlanetInfo> {
    setData(sourceData: PlanetInfo[]): void;
    constructor(planets: PlanetInfo[], scatterConfig: ScatterConfig, drawConfig: DrawConfig);
}
//# sourceMappingURL=ScatterPlot.d.ts.map