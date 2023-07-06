import CreateChart from "components/CreateChart";

export default function CreateBasicColumn() {
    return (
        <CreateChart
            chartType="lineWithAnnotations"
            chartName="Line With Annotations"
            chartUrlType="line_with_annotations"
        ></CreateChart>
    );
}
