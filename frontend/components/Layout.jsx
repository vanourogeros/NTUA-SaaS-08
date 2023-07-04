import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "myCharts",
};

/*export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}*/

const Layout = ({ children }) => {
    const router = useRouter();
    const { data, status } = useSession();

    return (
        <div>
            <nav className="flex items-center justify-between p-6 bg-gray-800 text-white">
                <div className="flex items-center space-x-4">
                    {status === "authenticated" ? (
                        <>
                            <span className="cursor-pointer" onClick={() => router.push("/")}>
                                Dashboard
                            </span>
                            <span className="cursor-pointer" onClick={() => router.push("/upload")}>
                                Create Chart
                            </span>
                            <span className="cursor-pointer" onClick={() => router.push("/user")}>
                                User Info
                            </span>
                            <span
                                className="cursor-pointer"
                                onClick={() => router.push("/my_charts")}
                            >
                                My Charts
                            </span>
                            <span
                                className="cursor-pointer"
                                onClick={() => router.push("/purchase_tokens")}
                            >
                                Purchase Tokens
                            </span>
                        </>
                    ) : (
                        <>
                            <span className="cursor-pointer" onClick={() => router.push("/")}>
                                Home
                            </span>
                        </>
                    )}
                </div>
                <div className="flex items-center space-x-4">
                    {status === "authenticated" ? (
                        <>
                            <Image
                                src={data.user.image}
                                width={80}
                                height={80}
                                alt={":("}
                                className="h-12 w-12 rounded-full"
                            />
                            <span className="cursor-pointer" onClick={signOut}>
                                Sign Out
                            </span>
                        </>
                    ) : (
                        <span
                            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-full cursor-pointer hover:bg-red-700"
                            onClick={() => signIn("google")}
                        >
                            <Image
                                src="https://developers.google.com/identity/images/g-logo.png"
                                width={80}
                                height={80}
                                alt="Google logo"
                                className="w-5 h-5 mr-2 rounded-full"
                            />
                            Sign In with Google
                        </span>
                    )}
                </div>
            </nav>
            <aside>{/* Sidebar content goes here */}</aside>
            <main className={inter.className}>{children}</main>
        </div>
    );
};

export default Layout;
