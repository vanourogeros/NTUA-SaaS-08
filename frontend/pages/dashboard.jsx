import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { authFetch } from "lib/generalUtils";

export default function Dashboard() {
    const { data: session, status } = useSession();
    const [userData, setUserData] = useState(null);
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return;
        if (!session) {
            console.debug("Session does not exist");
            return;
        }

        authFetch(
            session,
            `${process.env.NEXT_PUBLIC_GET_USER_INFO_URL?.replace(
                ":userId",
                session?.userId || "12345"
            )}`
        )
            .then((response) => response.json())
            .then((body) => {
                console.log(body);
                setUserData(body);
            })
            .catch((err) => console.error("Error fetching user data:\n", err));
    }, [session]);

    if (status === "loading") return <div>Loading...</div>;
    if (userData == null) {
        authFetch(session, process.env.NEXT_PUBLIC_USER_CREATION_URL, {
            method: "POST",
        })
            .then((response) => {
                if (response.status === 201) {
                    return router.reload(window.location.pathname);
                } else {
                    console.debug("could not create user");
                }
            })
            .catch((err) => console.debug("Error creating user", err));
    }

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
                    {userData &&
                        `Total Charts: ${
                            userData?.totalCharts != null
                                ? userData?.totalCharts
                                : "<error>"
                        }`}
                    <br />
                    {userData &&
                        `Total Tokens: ${
                            userData?.totalTokens != null
                                ? userData?.totalTokens
                                : "<error>"
                        }`}
                    <br />
                    {userData &&
                        `Last Sign In: ${
                            userData?.lastSignIn != null
                                ? userData?.lastSignIn
                                : "<error>"
                        }`}
                </p>
            </div>
        </div>
    );
}
