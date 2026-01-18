import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function LoginModal({ onClose, onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      setError(error.message);
    } else {
      onSuccess();
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-black"
        >
          ✕
        </button>

        <h3 className="text-lg font-bold text-[#4b2e1f] mb-4 text-center">
          Acceso administrador
        </h3>

        {error && (
          <p className="bg-red-100 text-red-600 text-sm p-2 rounded mb-2">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-3">
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Correo"
            type="email"
            required
            onChange={e => setEmail(e.target.value)}
          />

          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Contraseña"
            type="password"
            required
            onChange={e => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-[#4b2e1f] text-white py-2 rounded-full hover:bg-[#3a2418] transition"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
