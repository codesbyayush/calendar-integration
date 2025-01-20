import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [Google({
        authorization: {
            params: {
                scope: "openid profile email https://www.googleapis.com/auth/calendar.readonly",
                prompt: "consent",
                access_type: "offline",
                response_type: "code",
            },
        }
    }
    )],
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                return {
                    ...token,
                    access_token: account.access_token,
                    expires_at: account.expires_at,
                    refresh_token: account.refresh_token || token.refresh_token,
                }
            } else if (Date.now() < Number(token.expires_at) * 1000) {
                return token
            } else {
                if (!token.refresh_token) {
                    throw new TypeError("Missing or invalid refresh_token");
                }
     
                try {
                    const response = await fetch("https://oauth2.googleapis.com/token", {
                        method: "POST",
                        body: new URLSearchParams({
                            client_id: process.env.AUTH_GOOGLE_ID!,
                            client_secret: process.env.AUTH_GOOGLE_SECRET!,
                            grant_type: "refresh_token",
                            refresh_token: token.refresh_token! as unknown as string,
                        }),
                    })
     
                    const tokensOrError = await response.json()
     
                    if (!response.ok) throw tokensOrError
     
                    const newTokens = tokensOrError as {
                        access_token: string
                        expires_in: number
                        refresh_token?: string
                    }
     
                    return {
                        ...token,
                        access_token: newTokens.access_token,
                        expires_at: Math.floor(Date.now() / 1000 + newTokens.expires_in),
                        refresh_token: newTokens.refresh_token
                            ? newTokens.refresh_token
                            : token.refresh_token,
                    }
                } catch (error) {
                    console.error("Error refreshing access_token", error)
                    token.error = "RefreshTokenError"
                    return token
                }
            }
        },
        session: async ({ session, token }) => {
            session.accessToken = token.access_token as string;
            return session;
        },
    },
    
})