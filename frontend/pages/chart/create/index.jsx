import Link from "next/link";
import { useRouter } from "next/router";

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

    const router = useRouter();

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
                <button
                    style={{ marginBottom: "10px" }}
                    className="button"
                    onClick={() => router.push(`/chart/create/${chartType}`)}
                    key={i}
                >
                    {chartNames[i]}
                </button>
            ))}
        </div>
    );
}
