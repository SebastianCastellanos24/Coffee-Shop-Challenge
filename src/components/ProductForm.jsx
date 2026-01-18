import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function ProductForm({
  onSaved,
  product = null,
  onCancel
}) {
  const isEdit = Boolean(product);

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    image: null
  });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        price: product.price,
        stock: product.stock,
        image: null
      });
    }
  }, [product]);

  async function uploadImage(file) {
    if (!file) return product?.image_url || null;

    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(fileName, file);

    if (error) throw error;

    return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/product-images/${data.path}`;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const imageUrl = await uploadImage(form.image);

    if (isEdit) {
      await supabase
        .from("products")
        .update({
          name: form.name,
          price: Number(form.price),
          stock: Number(form.stock),
          ...(imageUrl && { image_url: imageUrl })
        })
        .eq("id", product.id);
    } else {
      await supabase.from("products").insert({
        name: form.name,
        price: Number(form.price),
        stock: Number(form.stock),
        image_url: imageUrl
      });
    }

    setForm({ name: "", price: "", stock: "", image: null });
    onSaved();
    onCancel?.();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        className="border w-full rounded px-3 py-2"
        placeholder="Nombre"
        required
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
      />

      <input
        type="number"
        className="border w-full rounded px-3 py-2"
        placeholder="Precio"
        required
        value={form.price}
        onChange={e => setForm({ ...form, price: e.target.value })}
      />

      <input
        type="number"
        className="border w-full rounded px-3 py-2"
        placeholder="Stock"
        required
        value={form.stock}
        onChange={e => setForm({ ...form, stock: e.target.value })}
      />

      <input
        type="file"
        className="bg-[#4b2e1f] py-2 px-3 text-white text-xs"
        accept="image/*"
        onChange={e =>
          setForm({ ...form, image: e.target.files[0] })
        }
      />

      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm"
          >
            Cancelar
          </button>
        )}

        <button
          className="bg-[#4b2e1f] text-white px-4 py-2 rounded"
        >
          {isEdit ? "Guardar cambios" : "Crear producto"}
        </button>
      </div>
    </form>
  );
}
