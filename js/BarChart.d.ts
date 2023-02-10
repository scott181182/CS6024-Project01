interface BarConfig extends ChartConfig<string, number> {
    xOrder?: string[];
    xSort?: (a: string, b: string) => number;
}
interface BarData {
    label: string;
    value: number;
    tooltip?: string;
    color?: string;
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
    constructor(data: BarData[], barConfig: BarConfig, drawConfig: DrawConfig);
    render(): void;
}
//# sourceMappingURL=BarChart.d.ts.map