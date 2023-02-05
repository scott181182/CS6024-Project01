interface PlanetInfo {
    /** Planet Name. */
    pl_name?: string;
    /** Host Name. */
    hostname: string;
    /** Discovery Method. */
    discoverymethod: string;
    /** Discovery Year. */
    disc_year: number;
    /** Which facility discovered the exoplanet. */
    disc_facility: string;
    /**
     * System Name.
     * Usually Hostname except multi-star systems with planets orbiting different stars.
     */
    sys_name: string;
    /** Number of Stars. */
    sy_snum: number;
    /** Number of Planets */
    sy_pnum: number;
    /** Distance, in parsecs. */
    sy_dist?: number;
    /** Orbital Period, in days. */
    /** Orbital Semi-Major Axis, in AU. */
    pl_orbsmax?: number;
    /** Planet Radius, in Earth Radius. */
    pl_rade?: number;
    /** Planet Mass, in Earth Mass. */
    pl_bmasse?: number;
    /** Orbital Eccentricity. */
    pl_orbeccen?: number;
    /** Spectral Type. */
    st_spectype?: string;
    /** Stellar Radius, in solar radius. */
    st_rad?: number;
    /** Stellar Mass, in solar mass. */
    st_mass?: number;
}
interface Margin {
    top: number;
    bottom: number;
    left: number;
    right: number;
}
interface DrawConfig {
    parent: string;
    width: number;
    height: number;
    margin?: Margin;
}
interface ChartConfig {
    xAxisLabel: string;
    yAxisLabel: string;
}
declare function parseRecord(row: d3.DSVRowString<string>): PlanetInfo;
declare const SELECTION_DATA: TableHeaderInfo<PlanetInfo>[];
declare function visualizeData(data: PlanetInfo[]): void;
declare function drawAggregateBarChart(data: PlanetInfo[], keyFn: (info: PlanetInfo) => string, barConfig: BarConfig, drawConfig: DrawConfig): BarChart;
//# sourceMappingURL=index.d.ts.map