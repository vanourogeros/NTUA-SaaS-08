import { useState } from "react";
import { useSession } from "next-auth/react";

const PurchaseTokensPage = () => {
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(false);

    const purchaseToken = async () => {
        setIsLoading(true);
        const response = await fetch("/api/purchase-token", {
            method: "POST",
        });

        if (response.ok) {
            alert("Token purchased successfully!");
        } else {
            alert("Failed to purchase token");
        }
        setIsLoading(false);
    };

    if (status === "loading") {
        return <p>Loading...</p>;
    }

    if (!session) {
        return (
            <div>
                <p>Please sign in to purchase a token</p>
            </div>
        );
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
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                    onClick={purchaseToken}
                    disabled={isLoading}
                >
                    {isLoading ? "Purchasing..." : "Purchase Token"}
                </button>
            </div>
        </div>
    );
};

export default PurchaseTokensPage;
