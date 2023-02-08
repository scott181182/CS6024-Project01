interface BarConfig extends ChartConfig<string, number> {
    xOrder?: string[];
    xSort?: (a: string, b: string) => number;
}
declare class BarChart {
    private data;
    private barConfig;
    private drawConfig;
    private svg;
    private ctx;
    private xScale;
    private yScale;
    private xAxis;
    private yAxis;
    constructor(data: [string, number][], barConfig: BarConfig, drawConfig: DrawConfig);
    render(): void;
}
//# sourceMappingURL=BarChart.d.ts.map