import CreateChart from "components/CreateChart";

export default function CreateBasicColumn() {
    return (
        <CreateChart
            chartType="dependencyWheel"
            chartName="Dependency Wheel"
            chartUrlType="dependency_wheel"
        ></CreateChart>
    );
}
