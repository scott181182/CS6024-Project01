


interface ScatterConfig extends XYChartConfig<number, number> {
    xScale?: "linear" | "log";
    yScale?: "linear" | "log";
}

interface ScatterData extends Point2D {
    r?: number;
    color?: string;
    tooltip?: string;
}

class ScatterPlot extends AbstractXYChart<ScatterData, "x", "y", ScatterConfig>
{
    protected xScale: d3.ScaleContinuousNumeric<number, number, never>;
    protected yScale: d3.ScaleContinuousNumeric<number, number, never>;
    protected xAxis: d3.Axis<number>;
    protected yAxis: d3.Axis<number>;



    public constructor(
        chartData: ChartData<ScatterData>,
        scatterConfig: ScatterConfig,
        drawConfig: DrawConfig,
    ) {
        super(chartData, scatterConfig, drawConfig);

        const xDomain = d3.extent(this.data, ({ x }) => x) as  [number, number];
        const yDomain = d3.extent(this.data, ({ y }) => y) as  [number, number];

        this.xScale = this.chartConfig.xScale === "log" ?
            d3.scaleLog(xDomain, [0, drawConfig.width]) :
            d3.scaleLinear(xDomain, [0, drawConfig.width]);
        this.yScale = this.chartConfig.xScale === "log" ?
            d3.scaleLog(yDomain, [drawConfig.height, 0]) :
            d3.scaleLinear(yDomain, [drawConfig.height, 0]);

        this.xAxis = d3.axisBottom<number>(this.xScale);
        this.yAxis = d3.axisLeft<number>(this.yScale);

        this.renderAxes();
        // this.ctx.append("g")
        //     .call(this.xAxis)
        //     .attr("transform", `translate(0, ${drawConfig.height})`);
        // this.svg.append("text")
        //     .attr("class", "x-label")
        //     .attr("text-anchor", "middle")
        //     .attr("x", this.margin.left + drawConfig.width / 2)
        //     .attr("y", this.margin.top + drawConfig.height + this.margin.bottom - 6)
        //     .text(this.chartConfig.xAxisLabel);
        // this.ctx.append("g")
        //     .call(this.yAxis);
        // this.svg.append("text")
        //     .attr("class", "y-label")
        //     .attr("text-anchor", "middle")
        //     .attr("x", 0 - this.margin.top - drawConfig.height / 2)
        //     .attr("y", 50)
        //     .attr("transform", "rotate(-90)")
        //     .text(this.chartConfig.yAxisLabel);

        this.render();
    }

    public render() {
        const pointSel = this.ctx.selectAll(".scatter-point")
            .data(this.data).join("circle")
                .attr("class", "scatter-point data-element")
                .attr("cx", (d) => this.xScale(d.x)!)
                .attr("cy", (d) => this.yScale(d.y))
                .attr("r", (d) => d.r || 2)
                .attr("fill", (d) => d.color || "#000");

        enableTooltip(pointSel, (d) => d.tooltip);
        this.renderUnknown();
    }
}



const EARTH_MASS = 5.97 // 10^24 kg
const EARTH_DIAMETER = 12756 // km
const SOL_PLANETS: ScatterData[] = [
    {
        tooltip: "Mercury",
        y: 0.330 / EARTH_MASS,
        x: 4879 / EARTH_DIAMETER,
        color: "#726658",
        r: 4,
    },
    {
        tooltip: "Venus",
        y: 4.87 / EARTH_MASS,
        x: 12104 / EARTH_DIAMETER,
        color: "#efecdd",
        r: 4,
    },
    {
        tooltip: "Earth",
        y: 1,
        x: 1,
        color: "#a49fb3",
        r: 4,
    },
    {
        tooltip: "Mars",
        y: 0.642 / EARTH_MASS,
        x: 6792 / EARTH_DIAMETER,
        color: "#896545",
        r: 4,
    },
    {
        tooltip: "Jupiter",
        y: 1898 / EARTH_MASS,
        x: 142984 / EARTH_DIAMETER,
        color: "#c3beab",
        r: 4,
    },
    {
        tooltip: "Saturn",
        y: 568 / EARTH_MASS,
        x: 120536 / EARTH_DIAMETER,
        color: "#c9b38e",
        r: 4,
    },
    {
        tooltip: "Uranus",
        y: 86.8 / EARTH_MASS,
        x: 51118 / EARTH_DIAMETER,
        color: "#a8c0c2",
        r: 4,
    },
    {
        tooltip: "Neptune",
        y: 102 / EARTH_MASS,
        x: 49528 / EARTH_DIAMETER,
        color: "#91afba",
        r: 4,
    },
];
class PlanetScatterPlot extends ScatterPlot
{
    public constructor(
        chartData: ChartData<ScatterData>,
        scatterConfig: ScatterConfig,
        drawConfig: DrawConfig,
    ) {
        super({
            data: [ ...chartData.data, ...SOL_PLANETS ],
            unknownCount: chartData.unknownCount
        }, scatterConfig, drawConfig);
    }
}
