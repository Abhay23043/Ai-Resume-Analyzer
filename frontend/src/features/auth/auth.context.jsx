import { createContext, useState, useEffect } from "react";
import { getMe } from "./services/auth.api";
//state layer
export const AuthContext = createContext()


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

      useEffect(() => {

        const checkAuth = async () => {

            try {

                const response = await getMe()

                setUser(response.user)

            } catch (err) {

                console.log(
                    "User not authenticated"
                )

                setUser(null)

            } finally {

                setLoading(false)

            }

        }


        checkAuth()

    }, [])




    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }} >
            {children}
        </AuthContext.Provider>
    )
}