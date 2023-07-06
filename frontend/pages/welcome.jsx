import { signIn } from "next-auth/react";

export default function Welcome() {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <button className="button" onClick={() => signIn("google")}>
                Sign In with Google
            </button>
        </div>
    );
}
