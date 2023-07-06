import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { authFetch } from "lib/generalUtils";

export default function Charts() {
    const { data: session, status } = useSession();
    const [charts, setCharts] = useState(null);

    useEffect(() => {
        console.debug("session: " + session);
        if (session) {
            authFetch(`/api/charts/${session?.userId || "12345"}`)
                .then((response) => {
                    if (response.status != 404) {
                        return response.json();
                    }
                })
                .then((data) => {
                    console.debug("Receiver chart data:", data);
                    setCharts(data?.charts.filter((chart) => chart).map((chart) => chart.data));
                })
                .catch((err) => console.error("Error fetching charts:\n", err));
            //fetch(`/api/my_charts?userId=${session?.userId}`) // also works with 'giannis'
            //    .then((response) => response.json())
            //    .then((data) => {
            //        // Extract data from the nested structure of the response
            //        console.debug(data);
            //        const extractedData = data.charts
            //            .filter((chart) => chart) // Filter out null values
            //            .map((chart) => chart.data); // Extract the 'data' property from each chart
            //        setCharts(extractedData);
            //    })
            //    .catch((error) => console.error("Error fetching charts:", error));
        }
    }, [session]);

    const handleDownload = (chart, format) => {
        // TODO: Implement download functionality
        console.debug(`Download ${chart._id} as ${format}`);
    };

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
                charts.map((chartData, i) => (
                    <div key={i}>
                        <div dangerouslySetInnerHTML={{ __html: chartData }} />
                        <select onChange={(event) => handleDownload(chartData, event.target.value)}>
                            <option value="" disabled>
                                Download As...
                            </option>
                            <option value="svg">SVG</option>
                            <option value="html">HTML</option>
                            <option value="pdf">PDF</option>
                            <option value="png">PNG</option>
                        </select>
                    </div>
                ))}
            <div hidden={charts && charts.length > 0}>No charts to show</div>
        </div>
    );
}
