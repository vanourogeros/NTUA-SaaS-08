import CreateChart from "../../components/CreateChart.jsx";

export default function CreateBasicColumn() {
    return (
        <CreateChart
            chartType="dependencyWheel"
            chartName="Dependency Wheel"
            uploadUrl={process.env.DEPENDENCY_WHEEL_UPLOAD_URL}
        ></CreateChart>
    );
}
