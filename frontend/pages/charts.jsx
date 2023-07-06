import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const MyChartsPage = () => {
    const { data: session, status } = useSession();
    const [diagrams, setDiagrams] = useState([]);

    useEffect(() => {
        console.log("session: " + session);
        if (session) {
            fetch(`/api/my_charts?userId=${session.userId}`) // also works with 'giannis'
                .then((response) => response.json())
                .then((data) => {
                    // Extract diagrams from the nested structure of the response
                    console.debug(data);
                    const extractedDiagrams = data.charts
                        .filter((chart) => chart) // Filter out null values
                        .flatMap((chart) => chart.diagrams); // Flatten the array of arrays
                    setDiagrams(extractedDiagrams);
                })
                .catch((error) => console.error("Error fetching diagrams:", error));
        }
    }, [session]);

    const handleDownload = (diagram, format) => {
        // TODO: Implement download functionality
        console.log(`Download ${diagram._id} as ${format}`);
    };

    if (status === "loading") {
        return <p>Loading...</p>;
    }

    if (!session) {
        return (
            <div>
                <p>Please sign in to view your diagrams</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            {diagrams.map((diagram) => (
                <div key={diagram._id}>
                    <div dangerouslySetInnerHTML={{ __html: diagram.file }} />
                    <select onChange={(event) => handleDownload(diagram, event.target.value)}>
                        <option value="">Download As...</option>
                        <option value="svg">SVG</option>
                        <option value="html">HTML</option>
                        <option value="pdf">PDF</option>
                        <option value="png">PNG</option>
                    </select>
                </div>
            ))}
        </div>
    );
};

export default MyChartsPage;
