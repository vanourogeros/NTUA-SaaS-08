import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";

export default function IndexPage() {
    const router = useRouter();
    const { data, status } = useSession();
    if (status === "loading") return <h1> loading... please wait</h1>;
    if (status === "authenticated") {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <h1> hi {data.user.name}</h1>
                <Image
                    src={data.user.image}
                    width={80}
                    height={80}
                    alt={data.user.name + " photo"}
                    style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                    }}
                />

                <button
                    style={{ marginBottom: "10px" }}
                    className="button"
                    onClick={() => {
                        router.push("/upload");
                    }}
                >
                    Create Chart
                </button>
                <button
                    style={{ marginBottom: "10px" }}
                    className="button"
                    onClick={() => {
                        router.push("/charts");
                    }}
                >
                    Charts
                </button>
                <button
                    style={{ marginBottom: "10px" }}
                    className="button"
                    onClick={() => {
                        router.push("/user");
                    }}
                >
                    User Info
                </button>
                <button
                    style={{ marginBottom: "10px" }}
                    className="button"
                    onClick={() => {
                        router.push("/purchase_tokens");
                    }}
                >
                    Purchase Tokens
                </button>
                <button
                    style={{ marginBottom: "10px" }}
                    className="button"
                    onClick={() => {
                        router.push("/my_charts");
                    }}
                >
                    My Charts
                </button>
                <button style={{ marginBottom: "10px" }} className="button" onClick={signOut}>
                    Sign Out
                </button>
            </div>
        );
    }
    return (
        <div>
            <button className="button" onClick={() => signIn("google")}>
                sign in with gooogle
            </button>
        </div>
    );
}
