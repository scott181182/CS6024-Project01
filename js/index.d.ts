declare function parseRecord(row: d3.DSVRowString<string>): PlanetInfo;
declare const SELECTION_DATA: TableHeaderInfo<PlanetInfo>[];
declare function visualizeData(data: PlanetInfo[]): void;
declare function drawAggregateBarChart(data: PlanetInfo[], keyFn: (info: PlanetInfo) => string, barConfig: BarConfig, drawConfig: DrawConfig): BarChart;
declare function drawSpectypeBarChart(data: PlanetInfo[], barConfig: BarConfig, drawConfig: DrawConfig): HorizontalBarChart;
//# sourceMappingURL=index.d.ts.map