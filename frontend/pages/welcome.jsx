import { useSession, signIn } from "next-auth/react";

export default function IndexPage() {
    const { status } = useSession();

    if (status === "loading") return <h1>Loading...</h1>;

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <button className="button " onClick={() => signIn("google")}>
                Sign In with Google
            </button>
        </div>
    );
}
