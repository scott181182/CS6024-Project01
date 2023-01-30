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

interface DrawConfig {
    parent: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
    width: number,
    height: number,
}

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

        drawChart(data);
    })
    .catch(err => {
        console.error("Error loading the data");
        console.error(err);
    });

function drawChart(data: PlanetInfo[]) {
    // Margin object with properties for the four directions
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    // Width and height as the inner dimensions of the chart area
    const width = 1000 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    // Define 'svg' as a child-element (g) from the drawing area and include spaces
    // Add <svg> element (drawing space)
    const svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const drawConfig: DrawConfig = { parent: svg, width, height };
    drawStarCountChart(data, drawConfig);
}



function drawStarCountChart(data: PlanetInfo[], drawConfig: DrawConfig) {
    const starCountGroups = d3.rollup(data, (a) => a.length, (d) => `${d.sy_snum} Stars`);
    const xDomain = d3.sort(starCountGroups.keys())

    const xScale = d3.scaleBand()
        .domain(xDomain)
        .range([0, drawConfig.width])
        .padding(0.4);
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(starCountGroups.values())!])
        .range([drawConfig.height, 0]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    drawConfig.parent.append("g")
        .call(xAxis)
        .attr("transform", `translate(0, ${drawConfig.height})`);
    drawConfig.parent.append("g")
        .call(yAxis);

    drawConfig.parent.selectAll(".bar")
        .data(starCountGroups)
        .enter().append("rect")
            .attr("class", "bar")
            .attr("x", (d) => xScale(d[0])!)
            .attr("y", (d) => yScale(d[1]))
            .attr("width", xScale.bandwidth())
            .attr("height", (d) => drawConfig.height - yScale(d[1]));
}
