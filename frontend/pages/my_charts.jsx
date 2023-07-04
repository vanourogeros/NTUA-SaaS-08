import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const MyChartsPage = () => {
    const { data: session, status } = useSession();
    const [diagrams, setDiagrams] = useState([]);

    useEffect(() => {
        if (session) {
            fetch(`/api/diagrams/${session.user.id}`)
                .then(response => response.json())
                .then(data => setDiagrams(data))
                .catch(error => console.error('Error fetching diagrams:', error));
        }
    }, [session]);

    const handleDownload = (diagram, format) => {
        // TODO: Implement download functionality
        console.log(`Download ${diagram.id} as ${format}`);
    };

    if (status === 'loading') {
        return <p>Loading...</p>;
    }

    if (!session) {
        return (
            <div>
                <p>Please sign in to view your diagrams</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            {diagrams.map(diagram => (
                <div key={diagram.id}>
                    <div dangerouslySetInnerHTML={{ __html: diagram.file }} />
                    <select onChange={event => handleDownload(diagram, event.target.value)}>
                        <option value="">Download As...</option>
                        <option value="svg">SVG</option>
                        <option value="html">HTML</option>
                        <option value="pdf">PDF</option>
                        <option value="png">PNG</option>
                    </select>
                </div>
            ))}
        </div>
    );
};

export default MyChartsPage;
