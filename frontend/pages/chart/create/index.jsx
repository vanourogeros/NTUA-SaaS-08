import Link from "next/link";

export default function CreateIndex() {
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
                <Link
                    href={`/chart/create/${chartType}`}
                    style={{ marginBottom: "10px" }}
                    className="button"
                >
                    {chartNames[i]}
                </Link>
            ))}
        </div>
    );
}
