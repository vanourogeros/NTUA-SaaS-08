import { useState } from "react";
import { useSession } from "next-auth/react";
import { authFetch } from "lib/generalUtils";

export default function TopUp() {
    const { data: session, status } = useSession();
    const [tokens, setTokens] = useState(1);
    const [feedback, setFeedback] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    if (status === "loading") return <div>Loading...</div>;

    async function purchaseTokens() {
        setIsLoading(true);

        if (!/^[0-9]+$/.test(tokens)) {
            setFeedback("Enter a valid positive number!!");
            setIsLoading(false);
            return;
        } else {
            setFeedback("");
        }

        if (tokens == 0) {
            setIsLoading(false);
            return;
        }

        const response = await authFetch(
            session,
            process.env.NEXT_PUBLIC_ADD_TOKENS_URL?.replace(
                ":userId",
                session?.userId || "12345"
            ).replace(":newTokens", tokens),
            {
                method: "POST",
            }
        );

        if (response.ok) {
            setFeedback("Tokens purchased successfully!");
        } else {
            setFeedback("Failed to purchase tokens");
        }

        setIsLoading(false);
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h1 className="block text-gray-700 text-sm font-bold mb-2">
                    Purchase Tokens (eidiki prosfora: -100% se 1 (ena) token gia apofoitous
                    Ionideiou)
                </h1>
                <h3 className="block text-red-700 text-sm font-bold mb-2">
                    patwntas auto to koumpi dhlwnete ypeuthina me nomikes euthines antistoixes
                    ypeuthinis dhlwshs (ar8ro 8 N. 1599 / 1986) oti eiste pragmati apofoitos
                    Ionideiou
                </h3>
                <br />
                <div>
                    <input
                        type="number"
                        onChange={(e) => setTokens(e.target.value)}
                        placeholder="How many tokens?"
                    />
                </div>
                <br />
                <div hidden={feedback == null}>{feedback}</div>
                <br />
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                    onClick={purchaseTokens}
                    disabled={isLoading}
                >
                    {isLoading ? "Purchasing..." : "Purchase Token"}
                </button>
            </div>
        </div>
    );
}
