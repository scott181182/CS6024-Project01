interface PlanetInfo {
    /** Planet Name. */
    pl_name?: string,
    /** Host Name. */
    hostname: string,

    /** Discovery Method. */
    discoverymethod: string,
    /** Discovery Year. */
    disc_year: number,
    /** Which facility discovered the exoplanet. */
    disc_facility: string,

    /**
     * System Name.
     * Usually Hostname except multi-star systems with planets orbiting different stars.
     */
    sys_name: string,
    /** Number of Stars. */
    sy_snum: number,
    /** Number of Planets */
    sy_pnum: number,
    /** Distance, in parsecs. */
    sy_dist?: number,

    /** Orbital Period, in days. */

    /** Orbital Semi-Major Axis, in AU. */
    pl_orbsmax?: number,
    /** Planet Radius, in Earth Radius. */
    pl_rade?: number,
    /** Planet Mass, in Earth Mass. */
    pl_bmasse?: number,
    /** Orbital Eccentricity. */
    pl_orbeccen?: number,

    /** Spectral Type. */
    st_spectype?: string,
    /** Stellar Radius, in solar radius. */
    st_rad?: number,
    /** Stellar Mass, in solar mass. */
    st_mass?: number,
}

interface Margin {
    top: number;
    bottom: number;
    left: number;
    right: number;
}
interface DrawConfig {
    // parent: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
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
interface ScatterConfig extends ChartConfig {  }



function parseRecord(row: d3.DSVRowString<string>): PlanetInfo {
    return {
        pl_name: row.pl_name || undefined,
        hostname: row.hostname!,
        sys_name: row.sys_name!,
        sy_snum: parseInt(row.sy_snum!),
        sy_pnum: parseInt(row.sy_pnum!),
        discoverymethod: row.discoverymethod!,
        disc_year: parseInt(row.disc_year!),
        pl_orbsmax: row.pl_orbsmax ? parseFloat(row.pl_orbsmax) : undefined,
        pl_rade: row.pl_rade ? parseFloat(row.pl_rade) : undefined,
        pl_bmasse: row.pl_bmasse ? parseFloat(row.pl_bmasse) : undefined,
        pl_orbeccen: row.pl_orbeccen ? parseFloat(row.pl_orbeccen) : undefined,
        st_spectype: row.st_spectype || undefined,
        st_rad: row.st_rad ? parseFloat(row.st_rad) : undefined,
        st_mass: row.st_mass ? parseFloat(row.st_mass) : undefined,
        sy_dist: row.sy_dist ? parseFloat(row.sy_dist) : undefined,
        disc_facility: row.disc_facility!,
    }
}



d3.csv("data/exoplanets-1.csv")
    .then(rawData => {
        console.log("Data loading complete");
        const data = rawData.map(parseRecord);
        console.log(data);
        drawChart(data);
    })
    .catch(err => {
        console.error("Error loading the data");
        console.error(err);
    });

function drawChart(data: PlanetInfo[]) {
    // Margin object with properties for the four directions
    const margin = { top: 50, right: 50, bottom: 50, left: 100 };

    const drawConfig: DrawConfig = {
        parent: "#chart-area",
        width: 450,
        height: 300,
        margin
    };
    const yLabel = "# of Exoplanets"
    drawAggregateBarChart(data, (d) => `${d.sy_snum}`, { xAxisLabel: "Stars In System", yAxisLabel: yLabel }, drawConfig);
    drawAggregateBarChart(data, (d) => `${d.sy_pnum}`, { xAxisLabel: "Planets in System", yAxisLabel: yLabel }, drawConfig);
    drawAggregateBarChart(data, spectypeFromPlanet, { xAxisLabel: "Star Sequence", yAxisLabel: yLabel, xOrder: SPEC_SEQUENCE }, drawConfig);

    const radiusMassMap = data
        .map((d) => [ d.pl_rade, d.pl_bmasse ] as const)
        .filter(([ r, m ]) => r !== undefined && m !== undefined) as [number, number][];
    drawScatterChart(radiusMassMap, { xAxisLabel: "Planet Radius (earths)", yAxisLabel: "Planet Mass (earths)" }, drawConfig);
}

const SPEC_SEQUENCE = ["O", "B", "A", "F", "G", "K", "M", "White Dwarf", "Cool Dwarf", "Subdwarf"];
function spectypeFromPlanet(info: PlanetInfo) {
    if (!info.st_spectype) { return ""; }

    const MAIN_SEQ = ["O", "B", "A", "F", "G", "K", "M"];
    const spectype = info.st_spectype.toUpperCase();
    if (MAIN_SEQ.includes(spectype.charAt(0))) { return spectype.charAt(0); }
    if (spectype.startsWith("D") || spectype.startsWith("WD")) { return "White Dwarf"; }
    if (spectype.startsWith("L") || spectype.startsWith("T") || spectype.startsWith("Y")) { return "Cool Dwarf"; }
    if (spectype.startsWith("SD")) { return "Subdwarf"; }

    return info.st_spectype;
}



function drawAggregateBarChart(data: PlanetInfo[], keyFn: (info: PlanetInfo) => string, barConfig: BarConfig, drawConfig: DrawConfig) {
    const countMap = d3.rollup(data, (a) => a.length, keyFn);
    const countData = [...countMap.entries()].filter(([k, _]) => !!k);
    const sortFn = barConfig.xSort ||
        (barConfig.xOrder ? ((a: string, b: string) => barConfig.xOrder!.indexOf(a) - barConfig.xOrder!.indexOf(b)) :
            (a: string, b: string) => a.localeCompare(b));
    countData.sort((a, b) => sortFn(a[0], b[0]));

    return drawBarChart(countData, barConfig, drawConfig);
}

function drawBarChart(data: [string, number][], barConfig: BarConfig, drawConfig: DrawConfig) {
    const margin = drawConfig.margin || { top: 0, bottom: 0, left: 0, right: 0 };
    const totalWidth = drawConfig.width + margin.left + margin.right;
    const totalHeight = drawConfig.height + margin.top + margin.bottom;
    const svg = d3.select(drawConfig.parent).append("svg")
        .attr("width", totalWidth)
        .attr("height", totalHeight)
        .attr("viewBox", `0 0 ${totalWidth} ${totalHeight}`);
    const ctx = svg.append("g")
        .attr("class", "bar-chart")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xDomain = data.map(([x, _]) => x);
    const yDomain = [0, d3.max(data, ([_, y]) => y)!] as const;

    const xScale = d3.scaleBand()
        .domain(xDomain)
        .range([0, drawConfig.width])
        .padding(0.4);
    const yScale = d3.scaleLinear()
        .domain(yDomain)
        .range([drawConfig.height, 0]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    ctx.append("g")
        .call(xAxis)
            .attr("transform", `translate(0, ${drawConfig.height})`)
        .selectAll(".tick text")
            .call(wrapAxisText, xScale.bandwidth());
    svg.append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "middle")
        .attr("x", margin.left + drawConfig.width / 2)
        .attr("y", margin.top + drawConfig.height + margin.bottom - 6)
        .text(barConfig.xAxisLabel);
    ctx.append("g")
        .call(yAxis);
    svg.append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "middle")
        .attr("x", 0 - margin.top - drawConfig.height / 2)
        .attr("y", 50)
        .attr("transform", "rotate(-90)")
        .text(barConfig.yAxisLabel);

    ctx.selectAll(".bar")
        .data(data)
        .join("rect")
        .attr("class", "bar")
        .attr("x", (d) => xScale(d[0])!)
        .attr("y", (d) => yScale(d[1]))
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => drawConfig.height - yScale(d[1]));
}

function drawScatterChart(data: [number, number][], scatterConfig: ScatterConfig, drawConfig: DrawConfig) {
    const margin = drawConfig.margin || { top: 0, bottom: 0, left: 0, right: 0 };
    const totalWidth = drawConfig.width + margin.left + margin.right;
    const totalHeight = drawConfig.height + margin.top + margin.bottom;
    const svg = d3.select(drawConfig.parent).append("svg")
        .attr("width", totalWidth)
        .attr("height", totalHeight)
        .attr("viewBox", `0 0 ${totalWidth} ${totalHeight}`);
    const ctx = svg.append("g")
        .attr("class", "scatter-chart")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xDomain = d3.extent(data, ([ x, _ ]) => x) as  [number, number];
    const yDomain = d3.extent(data, ([ _, y ]) => y) as  [number, number];

    const xScale = d3.scaleLinear()
        .domain(xDomain)
        .range([0, drawConfig.width]);
    const yScale = d3.scaleLinear()
        .domain(yDomain)
        .range([drawConfig.height, 0]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    ctx.append("g")
        .call(xAxis)
        .attr("transform", `translate(0, ${drawConfig.height})`);
    svg.append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "middle")
        .attr("x", margin.left + drawConfig.width / 2)
        .attr("y", margin.top + drawConfig.height + margin.bottom - 6)
        .text(scatterConfig.xAxisLabel);
    ctx.append("g")
        .call(yAxis);
    svg.append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "middle")
        .attr("x", 0 - margin.top - drawConfig.height / 2)
        .attr("y", 50)
        .attr("transform", "rotate(-90)")
        .text(scatterConfig.yAxisLabel);

    ctx.selectAll(".scatter-point")
        .data(data)
        .join("circle")
            .attr("class", "scatter-point")
            .attr("cx", (d) => xScale(d[0])!)
            .attr("cy", (d) => yScale(d[1]))
            .attr("r", 2);
}



function wrapAxisText(text: d3.Selection<d3.BaseType, unknown, SVGGElement, any>, width: number) {
    text.each(function () {
        const text = d3.select(this);
        const words = text.text().split(/\s+/).reverse();
        let word: string | undefined;
        let line: string[] = [];
        let lineNumber = 0;
        const lineHeight = 1.1;
        const y = text.attr("y");
        const dy = parseFloat(text.attr("dy"));
        let tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");

        while (word = words.pop()) {
            line.push(word)
            tspan.text(line.join(" "))
            if ((tspan.node()?.getComputedTextLength() || 0) > width && line.length > 1) {
                line.pop()
                tspan.text(line.join(" "))
                line = [word]
                tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", `${++lineNumber * lineHeight + dy}em`).text(word)
            }
        }
    })
}
