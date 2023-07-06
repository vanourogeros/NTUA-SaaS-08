import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { authFetch } from "lib/generalUtils";

export default function Charts() {
    const { data: session, status } = useSession();
    const [charts, setCharts] = useState(null);
    const [filetype, setFiletype] = useState("svg");

    useEffect(() => {
        console.debug("Session: " + session);
        if (session) {
            authFetch(
                session,
                process.env.NEXT_PUBLIC_CHART_FETCH_URL?.replace(
                    ":userId",
                    session?.userId || "12345"
                )
            )
                .then((response) => {
                    if (response.status != 404) {
                        return response.json();
                    }
                })
                .then((body) => {
                    console.debug("Received response body:", body);
                    setCharts(body?.charts?.filter((c) => c));
                })
                .catch((err) => console.error("Error fetching charts:\n", err));
        }
    }, []);

    async function handleDownload(chartId, chartType, dataType) {
        const response = await authFetch(
            session,
            process.env.NEXT_PUBLIC_GET_CHART_TYPE_URL?.replace(":chartId", chartId)
                .replace(":chartType", chartType)
                .replace(":dataType", dataType)
        );

        if (response.ok) {
            const data = (await response.json()).data;
            const blob = new Blob([data], { type: "application/octet-stream" });
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = `${chartId}.${dataType}`;
            link.click();

            URL.revokeObjectURL(url);
        }
    }

    if (status === "loading") {
        return <p>Loading...</p>;
    }

    if (!session) {
        return (
            <div>
                <p>Please sign in to view your charts</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            {charts &&
                charts.length > 0 &&
                charts.map(({ id, data, type }) => (
                    <div key={id}>
                        <div dangerouslySetInnerHTML={{ __html: data }} />
                        <select onChange={(e) => setFiletype(e.target.value)}>
                            <option value="svg" selected>
                                SVG
                            </option>
                            <option value="html">HTML</option>
                            <option value="pdf">PDF</option>
                            <option value="png">PNG</option>
                        </select>
                        <button onClick={() => handleDownload(id, type, filetype)}>Download</button>
                    </div>
                ))}
            <div hidden={charts && charts.length > 0}>No charts to show</div>
        </div>
    );
}
