"use strict";
function parseRecord(row) {
    return {
        pl_name: row.pl_name || undefined,
        hostname: row.hostname,
        sys_name: row.sys_name,
        sy_snum: parseInt(row.sy_snum),
        sy_pnum: parseInt(row.sy_pnum),
        discoverymethod: row.discoverymethod,
        disc_year: parseInt(row.disc_year),
        pl_orbsmax: row.pl_orbsmax ? parseFloat(row.pl_orbsmax) : undefined,
        pl_rade: row.pl_rade ? parseFloat(row.pl_rade) : undefined,
        pl_bmasse: row.pl_bmasse ? parseFloat(row.pl_bmasse) : undefined,
        pl_orbeccen: row.pl_orbeccen ? parseFloat(row.pl_orbeccen) : undefined,
        st_spectype: row.st_spectype || undefined,
        st_rad: row.st_rad ? parseFloat(row.st_rad) : undefined,
        st_mass: row.st_mass ? parseFloat(row.st_mass) : undefined,
        sy_dist: row.sy_dist ? parseFloat(row.sy_dist) : undefined,
        disc_facility: row.disc_facility,
    };
}
d3.csv("data/exoplanets-1.csv")
    .then(rawData => {
    console.log("Data loading complete");
    const data = rawData.map(parseRecord);
    console.log(data);
    visualizeData(data);
})
    .catch(err => {
    console.error("Error loading the data");
    console.error(err);
});
const SELECTION_DATA = [
    { key: "sys_name", title: "System Name" },
    { key: "hostname", title: "Host Name" },
    { key: "sy_snum", title: "# of Stars" },
    { key: "sy_pnum", title: "# of Planets" },
    { key: "sy_dist", title: "Distance (parsecs)" },
];
function visualizeData(data) {
    const table = new Table([
        { key: "pl_name", title: "Planet Name" },
        { key: "sys_name", title: "System Name" },
        { key: "discoverymethod", title: "Discovery Method" },
        { key: "disc_facility", title: "Discovery Facility" },
        { key: "disc_year", title: "Discovery Year" },
    ], data, "#table-section", {
        onHover(data) {
            const cardBody = d3.select("#selection-card > .card-body");
            cardBody.select(".card-title").text(data.pl_name || "Unknown Planet Name");
            cardBody.select(".card-text").html(SELECTION_DATA.map(({ key, title }) => `
                        <dt class="col-6">${title}</dt>
                        <dd class="col-6">${data[key] || "unknown"}</dd>
                    `).join("\n"));
        },
    });
    // Margin object with properties for the four directions
    const margin = { top: 50, right: 50, bottom: 50, left: 100 };
    const drawConfig = {
        parent: "#chart-row",
        width: 450,
        height: 150,
        margin
    };
    const yLabel = "# of Exoplanets";
    const starBarChart = drawAggregateBarChart(data, (d) => `${d.sy_snum}`, { xAxisLabel: "Stars In System", yAxisLabel: yLabel }, drawConfig);
    const planetBarChart = drawAggregateBarChart(data, (d) => `${d.sy_pnum}`, { xAxisLabel: "Planets in System", yAxisLabel: yLabel }, drawConfig);
    const sequenceBarChart = drawAggregateBarChart(data, spectypeFromPlanet, { xAxisLabel: "Star Sequence", yAxisLabel: yLabel, xOrder: SPEC_SEQUENCE }, drawConfig);
    const discoveryYearMap = d3.rollup(data, (group) => group.length, (info) => info.disc_year);
    const discoveryYearData = [...discoveryYearMap.entries()].sort((a, b) => a[0] - b[0]);
    const discoveryYearChart = new LineChart(discoveryYearData, {
        xAxisLabel: "Year",
        xTickFormat: (d) => "'" + `${d}`.substring(2),
        yAxisLabel: "Exoplanets Discovered"
    }, drawConfig);
    const radiusMassMap = data
        .map((d) => ({ x: d.pl_rade, y: d.pl_bmasse, tooltip: d.pl_name }))
        .filter(({ x, y }) => x !== undefined && y !== undefined);
    const scatter = new PlanetScatterPlot(radiusMassMap, {
        xAxisLabel: "Planet Radius (earths)",
        yAxisLabel: "Planet Mass (earths)",
        yScale: "log",
        xScale: "log",
    }, Object.assign(Object.assign({}, drawConfig), { parent: "#big-row", className: "col-12" }));
}
function drawAggregateBarChart(data, keyFn, barConfig, drawConfig) {
    const countMap = d3.rollup(data, (a) => a.length, keyFn);
    const countData = [...countMap.entries()].filter(([k, _]) => !!k);
    const sortFn = barConfig.xSort ||
        (barConfig.xOrder ? ((a, b) => barConfig.xOrder.indexOf(a) - barConfig.xOrder.indexOf(b)) :
            (a, b) => a.localeCompare(b));
    countData.sort((a, b) => sortFn(a[0], b[0]));
    return new BarChart(countData, barConfig, drawConfig);
}
//# sourceMappingURL=index.js.map