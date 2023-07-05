import CreateChart from "../../components/CreateChart.jsx";

export default function CreateBasicColumn() {
    return (
        <CreateChart
            chartType="basicLine"
            chartName="Basic Line"
            uploadUrl={process.env.BASIC_LINE_UPLOAD_URL}
        ></CreateChart>
    );
}
