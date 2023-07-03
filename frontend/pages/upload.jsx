import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const FileUploadPage = () => {
    const [file, setFile] = useState();
    const [chartOptions, setChartOptions] = useState();
    const { data: session, status } = useSession();

    const previewChart = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/preview', {
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
                <div className="flex items-center justify-between">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                        Preview
                    </button>
                </div>
            </form>
            {chartOptions && (
                <div>
                    <HighchartsReact highcharts={Highcharts} options={chartOptions} />
                    <button onClick={submitForm} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Confirm and Upload
                    </button>
                </div>
            )}
        </div>
    );
};

export default FileUploadPage;