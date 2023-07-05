import CreateChart from "../../components/CreateChart.jsx";

export default function CreateBasicColumn() {
    return (
        <CreateChart
            chartType="networkGraph"
            chartName="Network Graph"
            uploadUrl={process.env.NETWORK_GRAPH_UPLOAD_URL}
        ></CreateChart>
    );
}
