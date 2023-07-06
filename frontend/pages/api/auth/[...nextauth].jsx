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
                token.accessToken = account.id_token;
                token.justLoggedIn = true;
            }

            return token;
        },
        // pass jwt to the user's session
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            session.userId = token.sub;
            return session;
        },
    },
};

export default NextAuth(authOptions);
