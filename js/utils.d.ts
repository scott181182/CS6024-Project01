declare function createSVG(drawConfig: DrawConfig): d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
declare function wrapAxisText(text: d3.Selection<d3.BaseType, unknown, SVGGElement, any>, width: number): void;
declare const SPEC_SEQUENCE: string[];
declare const SPECTYPE_CONFIG: Partial<BarData>[];
declare function spectypeFromPlanet(info: PlanetInfo): string;
declare const tooltipElement: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
declare function enableTooltip<Datum, PDatum>(sel: d3.Selection<d3.BaseType, Datum, d3.BaseType, PDatum>, ttFn: (d: Datum) => string | undefined): void;
//# sourceMappingURL=utils.d.ts.map