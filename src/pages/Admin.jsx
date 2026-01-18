import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import ProductForm from "../components/ProductForm";

export default function Admin() {
  const [session, setSession] = useState(null);
  const [products, setProducts] = useState([]);

  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
    });

    loadProducts();

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function loadProducts() {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    setProducts(data || []);
  }

  // NO LOGUEADO
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f5f2]">
        <div className="bg-white p-6 rounded-2xl shadow-md text-center">
          <h2 className="text-xl font-bold text-[#4b2e1f] mb-2">
            Acceso restringido
          </h2>
          <p className="text-gray-600">
            Debes iniciar sesión para acceder al panel de administración
          </p>
        </div>
      </div>
    );
  }

  // LOGUEADO
  return (
    <div className="min-h-screen bg-[#f8f5f2] p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#4b2e1f]">
            Admin - Productos
          </h1>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h2 className="font-semibold text-[#4b2e1f] mb-4">
            Agregar nuevo producto
          </h2>
          <ProductForm onSaved={loadProducts} />
        </div>

        {/* Products list */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="font-semibold text-[#4b2e1f] mb-4">
            Productos existentes
          </h2>

          <ul className="divide-y">
            {products.map(p => (
              <li
                key={p.id}
                className="py-3 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-[#4b2e1f]">
                    {p.name}
                  </p>
                  <p className="text-sm text-[#7a5c45]">
                    Stock: {p.stock} · ${p.price}
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    className="text-sm text-blue-600 hover:text-blue-800 transition"
                    onClick={() => {
                      setEditingProduct(p);
                      setShowEditModal(true);
                    }}
                  >
                    Editar
                  </button>

                  <button
                    className="text-sm text-red-500 hover:text-red-700 transition"
                    onClick={async () => {
                      await supabase
                        .from("products")
                        .delete()
                        .eq("id", p.id);

                      loadProducts();
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Edit modal */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
              <h2 className="text-lg font-bold mb-4 text-[#4b2e1f]">
                Editar producto
              </h2>

              <ProductForm
                product={editingProduct}
                onSaved={loadProducts}
                onCancel={() => setEditingProduct(null)}
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
