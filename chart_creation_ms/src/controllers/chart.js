import { codes } from "../app.js";
import { createSVG } from "../lib/svgUtils.js";
import SVG from "../models/svg.js";

export async function postCreate(req, res) {
    const userId = req.get("X-User-ID");
    if (userId == null) {
        return res.status(codes.UNAUTHORIZED).send("Please log in first");
    }

    const chartOptions = req.body.chartOptions;
    if (chartOptions == undefined) {
        return res.status(codes.BAD_REQUEST).send("Chart options missing from the request");
    }

    try {
        const svgData = await createSVG(chartOptions);

        const svg = new SVG({ userId, svg: svgData });
        await svg.save();

        return res.status(codes.OK).json({
            chartId: svg._id,
            chartSvg: svgData,
        });
    } catch (err) {
        return res.status(codes.INTERNAL_SERVER_ERROR).send("Internal Server Error");
    }
}

export async function postCofirm(req, res) {
    const userId = req.get("X-User-ID");
    if (userId == null) {
        return res.status(codes.UNAUTHORIZED).send("Please log in first");
    }

    const chartId = req.params.chartId;
    if (chartId == undefined) {
        return res.status(codes.BAD_REQUEST).send("Chart ID missing from the request");
    }

    const svg = await SVG.findById(chartId);

    console.log(svg);

    return res.send("Yeah");
}
