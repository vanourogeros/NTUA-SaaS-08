import { useSession } from "next-auth/react";

const chartTypes = [
    "basic_column",
    "basic_line",
    "dependency_wheel",
    "line_with_annotations",
    "network_graph",
    "organization",
    "pie",
    "polar",
    "word_cloud",
];

const chartNames = [
    "Basic Column",
    "Basic Line",
    "Dependency Wheel",
    "Line With Annotations",
    "Network Graph",
    "Organization Chart",
    "Pie Chart",
    "Polar",
    "Word Cloud",
];

export default function CreateIndex() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <p>Loading...</p>;
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {chartTypes.map((chartType, i) => (
                <a
                    href={`/create/${chartType}`}
                    style={{ marginBottom: "10px" }}
                    className="button"
                >
                    {chartNames[i]}
                </a>
            ))}
        </div>
    );
}
