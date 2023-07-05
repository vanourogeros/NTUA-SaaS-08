import CreateChart from "../../components/CreateChart.jsx";

export default function CreateBasicColumn() {
    return (
        <CreateChart
            chartType="lineWithAnnotations"
            chartName="Line With Annotations"
            uploadUrl={process.env.LINE_WITH_ANNOTATIONS_UPLOAD_URL}
        ></CreateChart>
    );
}
