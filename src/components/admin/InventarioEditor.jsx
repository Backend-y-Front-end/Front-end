import { useState, useEffect } from "react";
import clienteAxios from "../../api/axios";

const InventarioEditor = ({ refresh }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    stock: "",
    descripcion: "",
    categoria: "Dulce", // Valor por defecto
  });

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Por favor selecciona una imagen");

    setLoading(true);
    const data = new FormData();
    data.append("imagen", file);
    data.append("nombre", formData.nombre);
    data.append("precio", formData.precio);
    data.append("stock", formData.stock);
    data.append("descripcion", formData.descripcion);
    data.append("categoria", formData.categoria);

    try {
      await clienteAxios.post("/api/products", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("¡Leño guardado con éxito! 🪵🔥");
      setFormData({
        nombre: "",
        precio: "",
        stock: "",
        descripcion: "",
        categoria: "Dulce",
      });
      setFile(null);
      if (refresh) refresh();
    } catch (error) {
      console.error("Error al subir:", error);
      alert("Error al guardar el producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-[#1e293b] p-8 rounded-3xl border border-slate-800 shadow-2xl text-white">
      <h2 className="text-xl font-black uppercase italic mb-8 text-center text-cyan-400">
        NUEVO PRODUCTO
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          className="w-full bg-[#0f172a] border border-slate-800 p-4 rounded-2xl outline-none focus:border-cyan-500"
          placeholder="Nombre del Leño"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            className="bg-[#0f172a] border border-slate-800 p-4 rounded-2xl outline-none focus:border-cyan-500"
            placeholder="Precio"
            value={formData.precio}
            onChange={(e) =>
              setFormData({ ...formData, precio: e.target.value })
            }
            required
          />
          <input
            type="number"
            className="bg-[#0f172a] border border-slate-800 p-4 rounded-2xl outline-none focus:border-cyan-500"
            placeholder="Stock"
            value={formData.stock}
            onChange={(e) =>
              setFormData({ ...formData, stock: e.target.value })
            }
            required
          />
        </div>

        {/* --- NUEVO: SELECTOR DE CATEGORÍA --- */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-black uppercase text-slate-500 ml-2">
            Categoría
          </label>
          <select
            className="w-full bg-[#0f172a] border border-slate-800 p-4 rounded-2xl outline-none focus:border-cyan-500 appearance-none cursor-pointer"
            value={formData.categoria}
            onChange={(e) =>
              setFormData({ ...formData, categoria: e.target.value })
            }
          >
            <option value="Dulce">Dulce 🍯</option>
            <option value="Salado">Salado 🥓</option>
            <option value="Especial">Especial ✨</option>
            <option value="Bebida">Bebida 🥤</option>
          </select>
        </div>

        <textarea
          className="w-full bg-[#0f172a] border border-slate-800 p-4 rounded-2xl h-24 outline-none focus:border-cyan-500 resize-none"
          placeholder="Descripción..."
          value={formData.descripcion}
          onChange={(e) =>
            setFormData({ ...formData, descripcion: e.target.value })
          }
        />

        <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 text-center">
          <input
            type="file"
            accept="image/*"
            id="file-upload"
            className="hidden"
            onChange={(e) => {
              if (e.target.files[0]) setFile(e.target.files[0]);
            }}
          />
          <label
            htmlFor="file-upload"
            className="bg-slate-800 hover:bg-slate-700 px-6 py-2 rounded-full cursor-pointer text-sm font-bold border border-slate-700 transition-all"
          >
            {file ? "Cambiar Imagen" : "Seleccionar Foto"}
          </label>

          <div className="mt-4 flex justify-center">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-40 h-40 object-cover rounded-2xl border-2 border-cyan-500 shadow-lg"
              />
            ) : (
              <div className="w-40 h-40 rounded-2xl border-2 border-dashed border-slate-800 flex items-center justify-center text-slate-700">
                <span>📸 Sin foto</span>
              </div>
            )}
          </div>
        </div>

        <button
          disabled={loading}
          className="w-full bg-cyan-600 hover:bg-cyan-700 py-4 rounded-2xl font-black uppercase tracking-widest transition-all"
        >
          {loading ? "GUARDANDO..." : "GUARDAR PRODUCTO"}
        </button>
      </form>
    </div>
  );
};

export default InventarioEditor;
