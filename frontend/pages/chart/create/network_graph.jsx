import CreateChart from "components/CreateChart";

export default function CreateBasicColumn() {
    return (
        <CreateChart
            chartType="networkGraph"
            chartName="Network Graph"
            chartUrlType="network_graph"
        ></CreateChart>
    );
}
