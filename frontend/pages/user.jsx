import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const UserPage = () => {
    const { data: session } = useSession();
    const [userData, setUserData] = useState({ diagrams: 0, credits: 0 });

    useEffect(() => {
        // Fetch user data when component mounts
        console.debug(session?.user.id)
        fetch(`/api/userData?userId=${session?.userId}`)
            .then((response) => response.json())
            .then((data) => setUserData(data));
    }, [session]);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                backgroundColor: "#f0f0f0",
                color: "#333",
                fontFamily: "Arial, sans-serif",
            }}
        >
            <h1 style={{ marginBottom: "1rem" }}>{session?.user.name}&apos;s User Page</h1>
            <div
                style={{
                    backgroundColor: "#fff",
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                    padding: "2rem",
                    borderRadius: "1rem",
                    textAlign: "center",
                    width: "80%",
                    maxWidth: "400px",
                }}
            >
                <p style={{ fontSize: "1.2rem", margin: "1rem 0" }}>
                    Diagrams: {userData.diagrams}
                </p>
                <p style={{ fontSize: "1.2rem", margin: "1rem 0" }}>Credits: {userData.credits}</p>
            </div>
        </div>
    );
};

export default UserPage;
