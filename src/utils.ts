


function createSVG(parent: string, width: number, height: number) {
    return d3.select(parent).append("svg")
        .attr("class", "col-6")
        // .attr("width", width)
        // .attr("height", height)
        .attr("viewBox", `0 0 ${width} ${height}`);
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
