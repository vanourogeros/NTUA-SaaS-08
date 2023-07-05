import CreateChart from "../../components/CreateChart.jsx";

export default function CreateBasicColumn() {
    return (
        <CreateChart
            chartType="organization"
            chartName="Organization"
            uploadUrl={process.env.ORGANIZATION_UPLOAD_URL}
        ></CreateChart>
    );
}
