import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import LoginModal from "../components/LoginModal";
import { supabase } from "../lib/supabase";

export default function Nav() {
    const [showLogin, setShowLogin] = useState(false);

    const [session, setSession] = useState(null);

    useEffect(() => {
        // Obtener sesión actual
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
        });

        // Escuchar cambios de auth
        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
            }
        );

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    const logout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <>
            <nav className="bg-[#4b2e1f] border-b shadow-lg">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between flex-col md:flex-row gap-6 md:gap-0">

                    {/* Logo / Brand */}
                    <div className="flex items-center gap-2">
                        <p className="text-3xl">☕</p>
                        <Link to="/" className="text-xl font-bold text-white">
                            Coffee Shop
                        </Link>
                    </div>

                    {/* Links */}
                    <div className="flex gap-6 flex-col md:flex-row text-center">
                        <Link
                            to="/"
                            className="text-white font-medium hover:text-[#7a5c45] transition py-2"
                        >
                            Shop
                        </Link>

                        <Link
                            to="/admin"
                            className="text-white font-medium hover:text-[#7a5c45] transition py-2"
                        >
                            Admin
                        </Link>

                        <Link
                            to="/dashboard"
                            className="text-white font-medium hover:text-[#7a5c45] transition py-2"
                        >
                            Dashboard
                        </Link>

                        {session ? (
                            <>
                                <button
                                    className="bg-[#C9B19F] text-white font-medium px-4 py-2 w-full rounded-full hover:bg-[#AB9585] transition"
                                    onClick={logout}
                                >
                                    Cerrar sesión
                                </button>
                            </>) : (
                            <>
                                <button
                                    className="bg-white text-[#7a5c45] font-medium px-4 py-2 w-full rounded-full hover:bg-[#C9B19F] hover:text-white transition"
                                    onClick={() => setShowLogin(true)}
                                >
                                    Iniciar sesión
                                </button>
                            </>)}
                    </div>
                </div>
            </nav>

            {/* Modal */}
            {showLogin && (
                <LoginModal
                    onClose={() => setShowLogin(false)}
                    onSuccess={() => { }}
                />
            )}
        </>
    );
}