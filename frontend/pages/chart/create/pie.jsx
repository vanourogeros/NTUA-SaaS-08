import CreateChart from "../../components/CreateChart.jsx";

export default function CreateBasicColumn() {
    return (
        <CreateChart
            chartType="pie"
            chartName="Pie"
            uploadUrl={process.env.PIE_UPLOAD_URL}
        ></CreateChart>
    );
}
