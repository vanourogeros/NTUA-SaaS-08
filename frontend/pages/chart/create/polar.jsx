import CreateChart from "../../components/CreateChart.jsx";

export default function CreateBasicColumn() {
    return (
        <CreateChart
            chartType="polar"
            chartName="Polar"
            uploadUrl={process.env.POLAR_UPLOAD_URL}
        ></CreateChart>
    );
}