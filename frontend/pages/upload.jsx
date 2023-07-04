import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const chartTypes = [
    'basicColumn',
    'basicLine',
    'dependencyWheel',
    'lineWithAnnotations',
    'networkGraph',
    'organization',
    'pie',
    'polar',
    'wordCloud',
];

const chartTypesNames = [ // for presentation purposes
    ' Basic Column',
    ' Basic Line',
    ' Dependency Wheel',
    ' Line With Annotations',
    ' Network Graph',
    ' Organization Chart',
    ' Pie Chart',
    ' Polar',
    ' Word Cloud',
];

// Create a mapping between chart types and their names
const chartTypeToName = chartTypes.reduce((acc, type, index) => {
    acc[type] = chartTypesNames[index];
    return acc;
}, {});

const FileUploadPage = () => {
    const [file, setFile] = useState();
    const [chartOptions, setChartOptions] = useState();
    const [chartType, setChartType] = useState(chartTypes[0]); // default to the first chart type
    const { data: session, status } = useSession();

    const previewChart = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`/api/preview?chart_type=${chartType}`, {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const options = await response.json();
            setChartOptions(options);
        } else {
            console.error('Failed to generate chart preview');
        }
    };

    const submitForm = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            console.log('File uploaded successfully');
        } else {
            console.error('File upload failed');
        }
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    if (status === 'loading') {
        return <p>Loading...</p>;
    }

    if (!session) {
        return (
            <div>
                <p>Please sign in to upload a file</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={previewChart}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file">
                        Select CSV File
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                           id="file" type="file" accept=".csv" onChange={handleFileChange} />
                </div>
                <div className="mb-4">
                    <span className="block text-black text-sm font-bold mb-2">Select Chart Type</span>
                    {chartTypes.map(type => (
                        <div key={type}>
                            <label className="text-black">
                                <input type="radio" name="chartType" value={type} checked={chartType === type} onChange={() => setChartType(type)} />
                                {chartTypeToName[type]}
                            </label>
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-between">
                    <a href={`/csv_samples/${chartType}/sample.csv`} download className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Download Sample CSV
                    </a>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                        Preview
                    </button>
                </div>
            </form>
            {chartOptions && (
                <div>
                    <div className="flex justify-center mt-4">
                        <button onClick={submitForm} className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Confirm and Create Diagram: 1 🪙
                        </button>
                    </div>
                    <br></br>
                    <HighchartsReact highcharts={Highcharts} options={chartOptions} />
                </div>
            )}
        </div>
    );
};

export default FileUploadPage;