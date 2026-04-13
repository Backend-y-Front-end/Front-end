import { useState, useEffect } from "react";
import { Upload, Plus, Loader2, Image } from "lucide-react";
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
    categoria: "Dulce",
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
  
  // Verificar autenticación antes de enviar
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  
  if (!token) {
    alert("❌ No estás autenticado. Por favor inicia sesión.");
    return;
  }
  
  if (userStr) {
    const user = JSON.parse(userStr);
    if (user.rol !== "admin") {
      alert("❌ No tienes permisos de administrador.");
      return;
    }
  }

  if (!file) return alert("Selecciona una imagen");

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
    alert("¡Producto guardado! 🪵🔥");
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
    if (error.response?.status === 401) {
      alert("❌ Sesión expirada. Por favor inicia sesión de nuevo.");
    } else if (error.response?.status === 403) {
      alert("❌ No tienes permisos de administrador.");
    } else {
      alert("Error al guardar: " + (error.response?.data?.message || error.message));
    }
  } finally {
    setLoading(false);
  }
};

  const inputStyle = {
    background: 'var(--bg-input)',
    border: '2px solid var(--border)',
    color: 'var(--text-primary)'
  };

  const categorias = [
    { value: "Dulce", emoji: "🍯" },
    { value: "Salado", emoji: "🥓" },
    { value: "Especial", emoji: "✨" },
    { value: "Bebida", emoji: "🥤" },
  ];

  return (
    <div 
      className="max-w-2xl mx-auto rounded-2xl overflow-hidden"
      style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow-lg)' }}
    >
      <div 
        className="p-6"
        style={{ background: 'var(--gradient-wood)' }}
      >
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Plus size={24} />
          Nuevo Producto
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Imagen Upload */}
        <div>
          <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>
            Imagen del producto
          </label>
          <label 
            className="flex flex-col items-center justify-center w-full h-48 rounded-xl cursor-pointer transition-all hover:scale-[1.01] overflow-hidden"
            style={{ 
              background: preview ? 'transparent' : 'var(--bg-secondary)',
              border: '2px dashed var(--border)'
            }}
          >
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-4">
                <Image size={40} style={{ color: 'var(--text-muted)' }} className="mx-auto mb-2" />
                <p className="font-medium" style={{ color: 'var(--text-muted)' }}>
                  Haz clic para subir imagen
                </p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  JPG, PNG (max. 5MB)
                </p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
            />
          </label>
        </div>

        {/* Nombre */}
        <div>
          <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>
            Nombre del producto
          </label>
          <input
            type="text"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            required
            placeholder="Ej: Leño de Nutella"
            className="w-full px-4 py-3 rounded-xl outline-none"
            style={inputStyle}
          />
        </div>

        {/* Precio y Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>
              Precio ($)
            </label>
            <input
              type="number"
              value={formData.precio}
              onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
              required
              placeholder="35"
              className="w-full px-4 py-3 rounded-xl outline-none"
              style={inputStyle}
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>
              Stock inicial
            </label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              required
              placeholder="50"
              className="w-full px-4 py-3 rounded-xl outline-none"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>
            Categoría
          </label>
          <div className="grid grid-cols-4 gap-2">
            {categorias.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setFormData({ ...formData, categoria: cat.value })}
                className="p-3 rounded-xl text-center transition-all"
                style={{ 
                  background: formData.categoria === cat.value ? 'var(--accent)' : 'var(--bg-secondary)',
                  color: formData.categoria === cat.value ? 'white' : 'var(--text-primary)'
                }}
              >
                <div className="text-2xl">{cat.emoji}</div>
                <div className="text-xs font-bold mt-1">{cat.value}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>
            Descripción (opcional)
          </label>
          <textarea
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            placeholder="Delicioso leño relleno de..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl outline-none resize-none"
            style={inputStyle}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
          style={{ background: 'var(--gradient-fire)' }}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <Upload size={20} />
              Guardar Producto
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default InventarioEditor;