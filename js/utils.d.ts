declare class InclusiveRange {
    readonly lower: number;
    readonly upper: number;
    constructor(lower: number, upper: number);
    contains(n: number): boolean;
}
declare function createSVG(drawConfig: DrawConfig): d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
declare function wrapAxisText(text: d3.Selection<d3.BaseType, unknown, SVGGElement, any>, width: number): void;
declare const SPEC_SEQUENCE: string[];
declare const SPECTYPE_CONFIG: Partial<BarData>[];
declare function spectypeFromPlanet(info: PlanetInfo): string | undefined;
declare const HABITABLE_ZONES: {
    A: InclusiveRange;
    F: InclusiveRange;
    G: InclusiveRange;
    K: InclusiveRange;
    M: InclusiveRange;
};
declare const tooltipElement: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
declare function enableTooltip<Datum, PDatum>(sel: d3.Selection<d3.BaseType, Datum, d3.BaseType, PDatum>, ttFn: (d: Datum) => string | undefined): void;
declare function partition<T>(data: T[], partitionFn: (d: T) => boolean): [T[], T[]];
//# sourceMappingURL=utils.d.ts.map