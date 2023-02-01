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
    drawChart(data);
})
    .catch(err => {
    console.error("Error loading the data");
    console.error(err);
});
function drawChart(data) {
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
    const drawConfig = { parent: svg, width: width / 2, height: height / 2 };
    drawStarCountChart(data, drawConfig);
    drawPlanetCountChart(data, Object.assign(Object.assign({}, drawConfig), { x: width / 2 + margin.left }));
}
function drawStarCountChart(data, drawConfig) {
    const starCountMap = d3.rollup(data, (a) => a.length, (d) => `${d.sy_snum} Stars`);
    const starCountData = [...starCountMap.entries()];
    starCountData.sort((a, b) => a[0].localeCompare(b[0]));
    return drawBarChart(starCountData, drawConfig);
}
function drawPlanetCountChart(data, drawConfig) {
    const planetCountMap = d3.rollup(data, (a) => a.length, (d) => `${d.sy_pnum}`);
    const planetCountData = [...planetCountMap.entries()];
    planetCountData.sort((a, b) => a[0].localeCompare(b[0]));
    return drawBarChart(planetCountData, drawConfig);
}
function drawBarChart(data, drawConfig) {
    const xDomain = data.map(([x, _]) => x);
    const yDomain = [0, d3.max(data, ([_, y]) => y)];
    const xScale = d3.scaleBand()
        .domain(xDomain)
        .range([0, drawConfig.width])
        .padding(0.4);
    const yScale = d3.scaleLinear()
        .domain(yDomain)
        .range([drawConfig.height, 0]);
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
    const context = drawConfig.parent.append("g")
        .attr("class", "bar-chart")
        .attr("transform", `translate(${drawConfig.x || 0}, ${drawConfig.y || 0})`);
    context.append("g")
        .call(xAxis)
        .attr("transform", `translate(0, ${drawConfig.height})`);
    context.append("g")
        .call(yAxis);
    context.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", (d) => xScale(d[0]))
        .attr("y", (d) => yScale(d[1]))
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => drawConfig.height - yScale(d[1]));
}
//# sourceMappingURL=index.js.map