import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        // get jwt from account
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token;
            }

            return token;
        },
        // pass jwt to the user's session
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            return session;
        },
    },
};

export default NextAuth(authOptions);
