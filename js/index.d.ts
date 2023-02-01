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
interface DrawConfig {
    parent: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
    width: number;
    height: number;
    x?: number;
    y?: number;
}
declare function parseRecord(row: d3.DSVRowString<string>): PlanetInfo;
declare function drawChart(data: PlanetInfo[]): void;
declare function drawStarCountChart(data: PlanetInfo[], drawConfig: DrawConfig): void;
declare function drawPlanetCountChart(data: PlanetInfo[], drawConfig: DrawConfig): void;
declare function drawBarChart(data: [string, number][], drawConfig: DrawConfig): void;
//# sourceMappingURL=index.d.ts.map