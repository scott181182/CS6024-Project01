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
    /** Array of all chart objects, to reference later. */
    const allCharts = [];
    let filtered = false;
    // Add general click listener to un-filter the data range if it's filtered.
    document.addEventListener("click", () => {
        if (filtered) {
            onDataRangeUpdate(data);
            filtered = false;
        }
    });
    const onDataRangeUpdate = (newData) => {
        filtered = true;
        for (const chart of allCharts) {
            chart.setData(newData);
            chart.render();
        }
    };
    const starBarChart = new BarChart(data, aggregateMapper((info) => `${info.sy_snum}`, (label, value) => ({ label, value })), {
        title: "Stars in an Exoplanet's System",
        xAxisLabel: "Stars In System",
        yAxisLabel: yLabel,
        onDataSelect(selected) {
            onDataRangeUpdate(data.filter((d) => d.sy_snum === parseInt(selected.label)));
        },
    }, drawConfig);
    allCharts.push(starBarChart);
    const planetBarChart = new BarChart(data, aggregateMapper((info) => `${info.sy_pnum}`, (label, value) => ({ label, value })), {
        title: "Planets in an Exoplanet's System",
        xAxisLabel: "Planets in System",
        yAxisLabel: yLabel,
        colorScheme: d3.schemeCategory10,
        onDataSelect(selected) {
            onDataRangeUpdate(data.filter((d) => d.sy_pnum === parseInt(selected.label)));
        },
    }, drawConfig);
    allCharts.push(planetBarChart);
    const sequenceBarChart = new HorizontalBarChart(data, aggregateMapper(spectypeFromPlanet, (label, value) => {
        const config = SPECTYPE_CONFIG.find((l) => l.label === label);
        return Object.assign(Object.assign({ label, value }, config), { tooltip: (config === null || config === void 0 ? void 0 : config.tooltip) ? `${config.tooltip}<br>Matching Exoplanets: ${value}` : `Matching Exoplanets: ${value}` });
    }), {
        title: "Stellar Classification of Exoplanet Host Stars",
        xAxisLabel: "Star Sequence",
        yAxisLabel: yLabel,
        labelSort: (a, b) => SPEC_SEQUENCE.indexOf(a) - SPEC_SEQUENCE.indexOf(b),
        onDataSelect(selected) {
            onDataRangeUpdate(data.filter((d) => spectypeFromPlanet(d) === selected.label));
        },
    }, Object.assign(Object.assign({}, drawConfig), { className: "col-12", width: drawConfig.width * 2, margin: { left: 130, top: 50, right: 50, bottom: 50 } }));
    allCharts.push(sequenceBarChart);
    const discoveryYearChart = new LineChart(data, aggregateMapper((info) => `${info.disc_year}`, (x, y) => ({ x: parseInt(x), y })), {
        title: "Exoplanet Discoveries over Time",
        xAxisLabel: "Year",
        xTickFormat: (d) => "'" + `${d}`.substring(2),
        yAxisLabel: "Exoplanets Discovered",
    }, Object.assign(Object.assign({}, drawConfig), { height: 200 }));
    allCharts.push(discoveryYearChart);
    const discoveryTypeChart = new HorizontalBarChart(data, aggregateMapper((info) => info.discoverymethod, (label, value) => ({ label, value, tooltip: `${label}: ${value}` })), {
        title: "Exoplanets Discovered per <a href=\"https://en.wikipedia.org/wiki/Methods_of_detecting_exoplanets\">Discovery Method</a>",
        xAxisLabel: "Exoplanets Discovered",
        yAxisLabel: "Discovery Method",
        colorScheme: d3.schemeSet3,
        sort: (a, b) => b.value - a.value,
        onDataSelect(selected) {
            onDataRangeUpdate(data.filter((d) => d.discoverymethod === selected.label));
        },
    }, Object.assign(Object.assign({}, drawConfig), { height: 200, margin: { left: 220, top: 50, right: 50, bottom: 50 } }));
    allCharts.push(discoveryTypeChart);
    const getPlanetHabitableZoneRelation = (info) => {
        if (info.pl_orbsmax === undefined) {
            return undefined;
        }
        const spectype = spectypeFromPlanet(info);
        if (!spectype) {
            return undefined;
        }
        if (spectype in HABITABLE_ZONES) {
            const zone = HABITABLE_ZONES[spectype];
            if (info.pl_orbsmax < zone.lower) {
                return "Too Close to Sun";
            }
            if (info.pl_orbsmax > zone.upper) {
                return "Too Far Away from Sun";
            }
            return "Habitable Zone";
        }
        return undefined;
    };
    const habitableChart = new PieChart(data, aggregateMapper(getPlanetHabitableZoneRelation, (label, value) => ({ value, label })), {
        title: "Exoplanets in the Habitable Zone",
        colorScheme: d3.schemeCategory10,
        legend: true,
        onDataSelect(selected) {
            onDataRangeUpdate(data.filter((d) => getPlanetHabitableZoneRelation(d) === selected.label));
        },
    }, Object.assign(Object.assign({}, drawConfig), { height: 200, margin: { left: 0, top: 40, right: 50, bottom: 0 } }));
    allCharts.push(habitableChart);
    const distanceChart = new HistogramChart(data, binMapper((d) => d.sy_dist), {
        title: "Exoplanet Distance",
        color: "#fa8",
        xAxisLabel: "Distance from Earth (parsecs)",
        yAxisLabel: "Number of Exoplanets",
        onDataSelect(selected) {
            onDataRangeUpdate(data.filter((d) => d.sy_dist && d.sy_dist >= selected.x0 && d.sy_dist <= selected.x1));
        },
    }, drawConfig);
    allCharts.push(distanceChart);
    const scatter = new PlanetScatterPlot(data, {
        title: "Exoplanet Size vs. Mass",
        xAxisLabel: "Planet Radius (earths)",
        yAxisLabel: "Planet Mass (earths)",
        yScale: "log",
        xScale: "log",
    }, Object.assign(Object.assign({}, drawConfig), { width: 900, height: 300, parent: "#big-row", className: "col-12" }));
    allCharts.push(scatter);
}
// function drawAggregateBarChart(data: ChartData<BarData>, keyFn: (info: PlanetInfo) => string, barConfig: BarConfig, drawConfig: DrawConfig) {
//     const countMap = d3.rollup(data, (a) => a.length, keyFn);
//     const countData = [...countMap.entries()].filter(([k, _]) => !!k)
//         .map(([ x, y ]) => ({ x, y }));
//     const sortFn = barConfig.labelSort ||
//         (barConfig.labelOrder ? ((a: string, b: string) => barConfig.labelOrder!.indexOf(a) - barConfig.labelOrder!.indexOf(b)) :
//             (a: string, b: string) => a.localeCompare(b));
//     countData.sort((a, b) => sortFn(a.x, b.x));
//     return new BarChart(countData, barConfig, drawConfig);
// }
// function drawSpectypeBarChart(data: PlanetInfo[], barConfig: BarConfig, drawConfig: DrawConfig) {
//     const countMap = d3.rollup(data, (a) => a.length, spectypeFromPlanet);
//     const countData = [...countMap.entries()].filter(([k, _]) => !!k)
//         .map(([ x, y ]) => {
//             const config = SPECTYPE_CONFIG.find((l) => l.x === x)!;
//             return {
//                 x,
//                 ...config,
//                 tooltip: config?.tooltip ? `${config.tooltip}<br>Matching Exoplanets: ${y}` : `Matching Exoplanets: ${y}`,
//                 y,
//             };
//         });
//     const sortFn = ((a: string, b: string) => SPEC_SEQUENCE.indexOf(a) - SPEC_SEQUENCE.indexOf(b));
//     countData.sort((a, b) => sortFn(a.x, b.x));
//     console.log(countData);
//     return new HorizontalBarChart(countData, barConfig, drawConfig);
// }
//# sourceMappingURL=index.js.map