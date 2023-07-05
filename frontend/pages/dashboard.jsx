import Image from "next/image";

const buttonTexts = ["Create Chart", "Charts", "User Info", "Purchase Tokens", "My Charts"];
const buttonLinks = ["/create", "/charts", "/user", "/topup", "/my_charts"];

export default function IndexPage() {
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
                <a href={buttonLinks[i]} style={{ marginBottom: "10px" }} className="button">
                    {text}
                </a>
            ))}
            <button style={{ marginBottom: "10px" }} className="button" onClick={signOut}>
                Sign Out
            </button>
        </div>
    );
}
