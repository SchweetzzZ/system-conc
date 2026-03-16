import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnAdmin = nextUrl.pathname.startsWith("/admin");
            const isOnDashboard = nextUrl.pathname.startsWith("/home");

            if (isOnAdmin) {
                if (!isLoggedIn) return false;
                const isAdmin = auth?.user?.role?.toUpperCase() === "ADMIN" || auth?.user?.email?.toLowerCase() === "casac2978@gmail.com".toLowerCase();
                return isAdmin;
            }

            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false;
            } else if (isLoggedIn) {
                if (nextUrl.pathname === "/login" || nextUrl.pathname === "/register") {
                    return Response.redirect(new URL("/home", nextUrl));
                }
            }
            return true;
        },
        jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
        session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
    },
    providers: [], // Providers are added in auth.ts as some are not edge-compatible
} satisfies NextAuthConfig;
