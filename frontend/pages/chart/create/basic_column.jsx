import CreateChart from "../../components/CreateChart.jsx";

export default function CreateBasicColumn() {
    return (
        <CreateChart
            chartType="basicColumn"
            chartName="Basic Column"
            uploadUrl={process.env.BASIC_COLUMN_UPLOAD_URL}
        ></CreateChart>
    );
}
