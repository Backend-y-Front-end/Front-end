import { Trash2 } from "lucide-react";
import clienteAxios from "../../api/axios";

const CatalogoStock = ({ productos = [], refresh }) => {
  const BACKEND_URL = "https://backend-production-0532.up.railway.app";

  const handleEliminar = async (id, nombre) => {
    const confirmar = window.confirm(`¿Seguro que quieres borrar "${nombre}"?`);
    if (!confirmar) return;

    try {
      await clienteAxios.delete(`/api/products/${id}`);
      alert("¡Leño eliminado con éxito! 🪵🔥");
      if (refresh) refresh();
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Ocurrió un error al intentar eliminar.");
    }
  };

  return (
    <div className="bg-[#1e293b] p-8 rounded-3xl border border-slate-800 shadow-2xl h-full text-white">
      <h2 className="text-xl font-black uppercase italic mb-6 text-center">
        Resumen de <span className="text-cyan-400">Stock</span>
      </h2>

      <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
        {productos.length === 0 ? (
          <p className="text-center text-slate-500 italic">
            No hay productos en inventario
          </p>
        ) : (
          productos.map((item) => (
            <div
              key={item._id}
              className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800 flex items-center justify-between group hover:border-cyan-500/50 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-slate-800 rounded-xl overflow-hidden border border-slate-700 flex-shrink-0">
                  {item.imagen ? (
                    <img
                      src={`${BACKEND_URL}/uploads/${item.imagen}`}
                      alt={item.nombre}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center font-black text-cyan-400">${item.nombre.charAt(0)}</div>`;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-black text-cyan-400">
                      {item.nombre?.charAt(0) || "L"}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold uppercase text-sm text-white mb-1">
                    {item.nombre}
                  </h3>
                  <div className="flex gap-2">
                    <p className="text-[9px] text-slate-500 uppercase font-black px-2 py-0.5 bg-slate-900 rounded-md">
                      {item.categoria}
                    </p>
                    <p className="text-[9px] text-cyan-400 uppercase font-black px-2 py-0.5 bg-cyan-500/10 rounded-md">
                      ${item.precio}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="block font-mono text-cyan-400 font-black text-sm">
                    {item.stock} pz
                  </span>
                </div>
                <button
                  onClick={() => handleEliminar(item._id, item.nombre)}
                  className="text-slate-600 hover:text-red-500 p-2 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CatalogoStock;
