import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function IndexPage() {
    const buttonTexts = ["Create Chart", "View Your Charts", "Purchase Tokens"];
    const buttonLinks = ["/chart/create", "/charts", "/topup"];
    const { data: session } = useSession();

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <h1>Welcome back, {session?.user.name}!</h1>
            <Image
                src={session?.user.image}
                width={80}
                height={80}
                alt={"google profile pic"}
                style={{
                    borderRadius: "50%",
                    clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                }}
            />
            {buttonTexts.map((text, i) => (
                <Link href={buttonLinks[i]} style={{ marginBottom: "10px" }} className="button">
                    {text}
                </Link>
            ))}
            <button style={{ marginBottom: "10px" }} className="button" onClick={signOut}>
                Sign Out
            </button>
        </div>
    );
}
