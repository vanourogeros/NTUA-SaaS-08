import CreateChart from "components/CreateChart";

export default function CreateBasicColumn() {
    return (
        <CreateChart
            chartType="wordCloud"
            chartName="Word Cloud"
            chartUrlType="word_cloud"
        ></CreateChart>
    );
}
