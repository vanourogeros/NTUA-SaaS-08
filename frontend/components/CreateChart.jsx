import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { authFetch } from "../lib/generalUtils.js";
import { parseCSVFile } from "../lib/csvUtils.js";

export default function CreateChart({ chartType, chartName, chartUrlType }) {
    let chartBlueprint, createChartOptions;
    import(`../lib/charts/${chartType}/blueprint.js`).then(
        ({ blueprint }) => (chartBlueprint = blueprint)
    );
    import(`../lib/charts/${chartType}/methods.js`).then(
        ({ create }) => (createChartOptions = create)
    );

    const [file, setFile] = useState(null);
    const [chartVisible, setChartVisible] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [chartOptions, setChartOptions] = useState(null);
    const { data: session } = useSession();
    const router = useRouter();

    async function handleFormSubmit(event) {
        event.preventDefault();

        const reader = new FileReader();
        reader.onload = async () => {
            try {
                const csv = await parseCSVFile(reader.result, chartBlueprint);
                setChartOptions(createChartOptions(csv));
                setFeedback("");
                setChartVisible(true);
            } catch (err) {
                setFeedback(err.message);
                setChartVisible(false);
            }
        };
        reader.readAsText(file);
    }

    async function handleConfirmChart() {
        const response = await authFetch(
            session,
            process.env.NEXT_PUBLIC_CHART_UPLOAD_URL.replace(":chartType", chartUrlType),
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ chartOptions }),
            }
        );

        console.debug(response?.message);

        if (!response.ok) {
            setChartVisible(false);
            setFeedback(response.message);
        } else {
            router.push("/charts");
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <p>Create a '{chartName}' chart</p>
            <div hidden={!chartVisible}>
                <br />
                <HighchartsReact highcharts={Highcharts} options={chartOptions} />
                <div className="flex justify-center mt-4">
                    <button
                        onClick={handleConfirmChart}
                        className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Confirm and Create Chart: 1 🪙
                    </button>
                </div>
                <br />
            </div>
            <form
                className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                onSubmit={handleFormSubmit}
            >
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file">
                        Select CSV File
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="file"
                        name="file"
                        type="file"
                        accept=".csv"
                        onChange={(event) => setFile(event.target.files[0])}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <a
                        href={`/csv_samples/${chartType}.csv`}
                        download
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Download Sample CSV
                    </a>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                        disabled={file == null}
                    >
                        Preview
                    </button>
                </div>
                <div className="flex items-center justify-between">
                    <p>{feedback}</p>
                </div>
            </form>
        </div>
    );
}
