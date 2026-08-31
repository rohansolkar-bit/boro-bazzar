import { AuthProvider } from "@/context/AuthContext";

export default function userAuthProvider({ children }) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}