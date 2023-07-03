import { useState } from "react";
import { useSession } from "next-auth/react";

const FileUploadPage = () => {
    const [file, setFile] = useState();
    const { data: session, status } = useSession();

    const submitForm = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            console.log("File uploaded successfully");
        } else {
            console.error("File upload failed");
        }
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    if (status === "loading") {
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
            <form
                className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                onSubmit={submitForm}
            >
                <div className="mb-4">
                    <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="file"
                    >
                        Select CSV File
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="file"
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Upload
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FileUploadPage;
