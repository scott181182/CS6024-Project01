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
interface BarConfig extends ChartConfig {
    xOrder?: string[];
    xSort?: (a: string, b: string) => number;
}
interface ScatterConfig extends ChartConfig {
}
declare function parseRecord(row: d3.DSVRowString<string>): PlanetInfo;
declare function drawChart(data: PlanetInfo[]): void;
declare const SPEC_SEQUENCE: string[];
declare function spectypeFromPlanet(info: PlanetInfo): string;
declare function drawAggregateBarChart(data: PlanetInfo[], keyFn: (info: PlanetInfo) => string, barConfig: BarConfig, drawConfig: DrawConfig): void;
declare function drawBarChart(data: [string, number][], barConfig: BarConfig, drawConfig: DrawConfig): void;
declare function drawScatterChart(data: [number, number][], scatterConfig: ScatterConfig, drawConfig: DrawConfig): void;
declare function wrapAxisText(text: d3.Selection<d3.BaseType, unknown, SVGGElement, any>, width: number): void;
//# sourceMappingURL=index.d.ts.map