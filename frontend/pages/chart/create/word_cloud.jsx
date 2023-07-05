import CreateChart from "../../components/CreateChart.jsx";

export default function CreateBasicColumn() {
    return (
        <CreateChart
            chartType="wordCloud"
            chartName="Word Cloud"
            uploadUrl={process.env.WORD_CLOUD_UPLOAD_URL}
        ></CreateChart>
    );
}
