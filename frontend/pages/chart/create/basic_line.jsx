import CreateChart from "components/CreateChart";

export default function CreateBasicColumn() {
    return (
        <CreateChart
            chartType="basicLine"
            chartName="Basic Line"
            chartUrlType="basic_line"
        ></CreateChart>
    );
}
