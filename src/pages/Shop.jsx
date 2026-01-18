import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import SaleModal from "../components/SaleModal";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const formatCOP = (value) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0
    }).format(value);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setProducts(data || []);
  }

  return (
    <div className="bg-[#f8f5f2] p-8 mb-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center text-[#4b2e1f] mb-10">
          Realiza tú compra aquí
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map(p => (
            <div
              key={p.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden"
            >
              <div className="h-48 w-full overflow-hidden">
                <img
                  src={p.image_url}
                  alt={p.name}
                  className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-4 flex flex-col gap-2">
                <h2 className="font-semibold text-lg text-[#4b2e1f] text-center uppercase">
                  {p.name}
                </h2>

                <p className="text-[#7a5c45] font-medium">
                  Precio
                </p>

                <p className="text-xl font-bold text-[#4b2e1f]">
                  {formatCOP(p.price)}
                </p>

                <div className="flex justify-between items-center mt-2">
                  <span
                    className={`${p.stock < 5 ? "text-red-500 font-semibold" : "text-green-600 font-semibold"
                      }`}
                  >
                    Stock: {p.stock}
                  </span>

                  <button
                    onClick={() => setSelectedProduct(p)}
                    className="bg-[#4b2e1f] text-white px-4 py-2 rounded-full text-sm
                         hover:bg-[#3a2418] transition"
                  >
                    Comprar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedProduct && (
        <SaleModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
