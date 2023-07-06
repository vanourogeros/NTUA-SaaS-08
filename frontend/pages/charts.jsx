import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import { authFetch } from "lib/generalUtils";
import { jsPDF } from "jspdf";
import { Canvg } from "canvg";
import { createCanvas } from "canvas";

export default function Charts() {
    const { data: session, status } = useSession();
    const [fetchedCharts, setFetchedCharts] = useState(false);
    const [charts, setCharts] = useState(null);
    const [filetype, setFiletype] = useState("svg");

    useEffect(() => {
        authFetch(
            session,
            process.env.NEXT_PUBLIC_CHART_FETCH_URL?.replace(":userId", session?.userId || "12345")
        )
            .then((response) => response.json())
            .then((body) => {
                console.debug("Received response body:", body);
                setCharts(body?.charts?.filter((c) => c));
            })
            .catch((err) => console.error("Error fetching charts:\n", err));
    }, [fetchCharts]);

    function fetchCharts() {
        authFetch(session, "/api/getcharts", {
            headers: { "X-User-ID": session?.userId || "12345" },
        })
            .then((response) => response.json())
            .then((body) => {
                if (body?.error) console.log(body.error);
                else setCharts(body?.charts);
                setFetchedCharts(true);
            });
    }

    if (status === "loading") return <div>Loading...</div>;

    if (!fetchedCharts) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen py-2">
                <button className="button" onClick={fetchCharts}>
                    View Your Charts
                </button>
            </div>
        );
    }

    async function handleDownload(chartId, chartData, format) {
        let blob;
        switch (format) {
            case "svg":
            case "html":
                // For SVG and HTML, we can directly create a blob from the data
                blob = new Blob([chartData], { type: "image/svg+xml;charset=utf-8" });
                break;
            case "png":
                // For PNG, we need to use a canvas and canvg
                const canvas = createCanvas(800, 600);
                const ctx = canvas.getContext("2d");
                const v = await Canvg.fromString(ctx, chartData);
                v.start();
                blob = await new Promise((resolve) => canvas.toBlob(resolve));
                break;
            case "pdf":
                // For PDF, we need to use jsPDF and canvg to convert SVG to canvas
                const pdf = new jsPDF();
                const pdfCanvas = document.createElement("canvas");
                const pdfCtx = pdfCanvas.getContext("2d");
                const pdfV = await Canvg.fromString(pdfCtx, chartData);
                pdfV.start();
                const imgData = pdfCanvas.toDataURL("image/png");
                pdf.addImage(imgData, "PNG", 0, 0);
                blob = pdf.output("blob");
                break;
            default:
                console.error(`Unsupported format: ${format}`);
                return;
        }

        // Create a URL for the Blob
        const url = URL.createObjectURL(blob);

        // Create a new <a> element
        const link = document.createElement("a");

        // Set the href to the Blob URL
        link.href = url;

        // Set the download attribute to specify the filename
        link.download = `${chartId}.${format}`;

        // Append the link to the body
        document.body.appendChild(link);

        // Programmatically click the link to start the download
        link.click();

        // Remove the link from the body
        document.body.removeChild(link);
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            {charts &&
                charts.length > 0 &&
                charts.map(({ id, data, type }) => (
                    <div key={id}>
                        <div dangerouslySetInnerHTML={{ __html: data }} />
                        <select onChange={(e) => setFiletype(e.target.value)}>
                            <option value="svg" defaultValue>
                                SVG
                            </option>
                            <option value="html">HTML</option>
                            <option value="pdf">PDF</option>
                            <option value="png">PNG</option>
                        </select>
                        <button onClick={() => handleDownload(id, data, filetype)}>Download</button>
                    </div>
                ))}
            <div hidden={charts && charts.length > 0}>No charts to show</div>
        </div>
    );
}
