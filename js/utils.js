"use strict";
class InclusiveRange {
    constructor(lower, upper) {
        this.lower = lower;
        this.upper = upper;
    }
    contains(n) {
        return n >= this.lower && n <= this.upper;
    }
}
function createSVG(drawConfig) {
    const margin = drawConfig.margin || { top: 0, bottom: 0, left: 0, right: 0 };
    const width = drawConfig.width + margin.left + margin.right;
    const height = drawConfig.height + margin.top + margin.bottom;
    return d3.select(drawConfig.parent).append("svg")
        .attr("class", drawConfig.className || "col-6")
        // .attr("width", width)
        // .attr("height", height)
        .attr("viewBox", `0 0 ${width} ${height}`);
}
function wrapAxisText(text, width) {
    text.each(function () {
        var _a;
        const text = d3.select(this);
        const words = text.text().split(/\s+/).reverse();
        let word;
        let line = [];
        let lineNumber = 0;
        const lineHeight = 1.1;
        const y = text.attr("y");
        const dy = parseFloat(text.attr("dy"));
        let tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if ((((_a = tspan.node()) === null || _a === void 0 ? void 0 : _a.getComputedTextLength()) || 0) > width && line.length > 1) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", `${++lineNumber * lineHeight + dy}em`).text(word);
            }
        }
    });
}
const SPEC_SEQUENCE = ["O", "B", "A", "F", "G", "K", "M", "White Dwarf", "Cool Dwarf", "Subdwarf"];
const SPECTYPE_CONFIG = [
    {
        label: "O",
        color: "#9bb0ff",
        tooltip: "O-class: The hottest stars burn blue at over 25,000 K",
    }, {
        label: "B",
        color: "#aabfff",
        tooltip: "B-class: These blue or blue-white stars burn between 11,000 and 25,000 K",
    }, {
        label: "A",
        color: "#cad7ff",
        tooltip: "A-class: Blue-white stars that burn between 7,500 and 11,000 K",
    }, {
        label: "F",
        color: "#f8f7ff",
        tooltip: "F-class: White or blue-white stars that burn between 6,000 and 7,500 K",
    }, {
        label: "G",
        color: "#fff4ea",
        tooltip: "G-class: Yellow to white stars that burn between 5,000 and 6,000 K",
    }, {
        label: "K",
        color: "#ffd2a1",
        tooltip: "K-class: Orange to red colored stars that burn between 3,500 and 5,000 K",
    }, {
        label: "M",
        color: "#ffcc6f",
        tooltip: "M-class: Red stars that burn up to 3,500 K",
    }, {
        label: "White Dwarf",
        color: "#fff",
        tooltip: "White Dwarfs: Non-main sequence stars that remain after a red giant sheds it outer layers. Can burn very hot.",
    }, {
        label: "Cool Dwarf",
        color: "#ef5858",
        tooltip: "Cool Dwarfs: A special M-class dwarf star that burns under 2,700 K",
    }, {
        label: "Subdwarf",
        color: "#527de8",
        tooltip: "Subdwarfs: A variable class of stars that exist under the main sequence and can burn at many temperatures",
    },
];
function spectypeFromPlanet(info) {
    if (!info.st_spectype) {
        return "Unknown";
    }
    const MAIN_SEQ = ["O", "B", "A", "F", "G", "K", "M"];
    const spectype = info.st_spectype.toUpperCase();
    if (MAIN_SEQ.includes(spectype.charAt(0))) {
        return spectype.charAt(0);
    }
    if (spectype.startsWith("D") || spectype.startsWith("WD")) {
        return "White Dwarf";
    }
    if (spectype.startsWith("L") || spectype.startsWith("T") || spectype.startsWith("Y")) {
        return "Cool Dwarf";
    }
    if (spectype.startsWith("SD")) {
        return "Subdwarf";
    }
    return info.st_spectype;
}
const HABITABLE_ZONES = {
    A: new InclusiveRange(8.5, 12.5),
    F: new InclusiveRange(1.5, 2.2),
    G: new InclusiveRange(0.95, 1.4),
    K: new InclusiveRange(0.38, 0.56),
    M: new InclusiveRange(0.08, 0.12),
};
const tooltipElement = d3.select("#tooltip");
function enableTooltip(sel, ttFn) {
    sel
        .on("mouseover", (ev, d) => {
        const tooltip = ttFn(d);
        if (!tooltip) {
            return;
        }
        tooltipElement
            .style("top", (ev.layerY + 5) + "px")
            .style("left", (ev.layerX + 5) + "px")
            .style("visibility", "visible")
            .html(tooltip);
    })
        .on("mouseout", () => {
        tooltipElement.style("visibility", "hidden");
    });
}
function partition(data, partitionFn) {
    const inList = [];
    const outList = [];
    for (const d of data) {
        if (partitionFn(d)) {
            inList.push(d);
        }
        else {
            outList.push(d);
        }
    }
    return [inList, outList];
}
//# sourceMappingURL=utils.js.map