import Image from "next/image";

export default function IndexPage() {
    const buttonTexts = ["Create Chart", "View Your Charts", "Purchase Tokens"];
    const buttonLinks = ["/chart/create", "/charts", "/topup"];

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <h1>Welcome back, {data.user.name}!</h1>
            <Image
                src={data.user.image}
                width={80}
                height={80}
                alt={data.user.name + " photo"}
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
