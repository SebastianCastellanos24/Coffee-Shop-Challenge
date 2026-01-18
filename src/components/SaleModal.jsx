import { useState } from "react";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";

export default function SaleModal({ product, onClose }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const total = product.price * quantity;

  const formatCOP = value =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0
    }).format(value);

  const handleConfirm = async () => {
    if (!firstName || !lastName || !email) {
      toast.error("Completa todos los campos");
      return;
    }

    if (quantity < 1 || quantity > product.stock) {
      toast.error("Cantidad inválida");
      return;
    }

    setLoading(true);

    const { error } = await supabase.rpc("create_sale", {
      p_first_name: firstName,
      p_last_name: lastName,
      p_email: email,
      p_products: [
        {
          product_id: product.id,
          quantity
        }
      ]
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Compra realizada con éxito");
    onClose();
  };

  const isDisabled =
    loading ||
    product.stock === 0 ||
    !firstName ||
    !lastName ||
    !email;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-1 text-[#4b2e1f]">
          Comprar {product.name}
        </h2>

        <p className="text-sm text-gray-600 mb-3">
          Stock disponible:{" "}
          <span className="font-semibold">{product.stock}</span>
        </p>

        {product.stock === 0 && (
          <p className="text-red-500 text-sm mb-4">
            Producto sin stock
          </p>
        )}

        <input
          placeholder="Nombre"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          className="border p-2 w-full mb-2 rounded"
        />

        <input
          placeholder="Apellido"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          className="border p-2 w-full mb-2 rounded"
        />

        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border p-2 w-full mb-2 rounded"
        />

        <input
          type="number"
          min={1}
          max={product.stock}
          value={quantity}
          onChange={e => setQuantity(Number(e.target.value))}
          className="border p-2 w-full mb-3 rounded"
          disabled={product.stock === 0}
        />

        {/* Total */}
        <div className="bg-[#f8f5f2] rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-600">Total a pagar</p>
          <p className="text-xl font-bold text-[#4b2e1f]">
            {formatCOP(total)}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleConfirm}
            disabled={isDisabled}
            className={`flex-1 px-4 py-2 rounded text-white transition
              ${isDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#4b2e1f] hover:bg-[#3a2418]"
              }
            `}
          >
            {loading ? "Procesando..." : "Confirmar compra"}
          </button>

          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
          >
            Cancelar
          </button>
        </div>

      </div>
    </div>
  );
}