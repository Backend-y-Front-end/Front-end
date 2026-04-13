import { Trash2, Package, AlertTriangle } from "lucide-react";
import clienteAxios from "../../api/axios";

const CatalogoStock = ({ productos = [], refresh }) => {
  const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || "http://localhost:4000";

  const handleEliminar = async (id, nombre) => {
    if (!window.confirm(`¿Eliminar "${nombre}"?`)) return;

    try {
      await clienteAxios.delete(`/api/products/${id}`);
      alert("Producto eliminado 🗑️");
      if (refresh) refresh();
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Error al eliminar");
    }
  };

  return (
    <div className="space-y-6 pb-24 md:pb-0">
      <div className="flex justify-between items-center">
        <h2 
          className="text-xl font-bold"
          style={{ color: 'var(--text-primary)' }}
        >
          Inventario ({productos.length} productos)
        </h2>
      </div>

      {productos.length === 0 ? (
        <div 
          className="text-center py-16 rounded-2xl"
          style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow)' }}
        >
          <Package size={48} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
          <p className="font-bold" style={{ color: 'var(--text-primary)' }}>
            No hay productos en inventario
          </p>
          <p style={{ color: 'var(--text-muted)' }}>
            Agrega tu primer producto
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {productos.map((item) => (
            <div
              key={item._id}
              className="rounded-2xl overflow-hidden transition-all hover:scale-[1.02]"
              style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow)' }}
            >
              {/* Imagen */}
              <div 
                className="h-40 relative"
                style={{ background: 'var(--bg-secondary)' }}
              >
                {item.imagenUrl ? (
                  <img
                    src={`${BACKEND_URL}${item.imagenUrl}`}
                    alt={item.nombre}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-5xl">{item.nombre?.charAt(0) || "🪵"}</span>
                  </div>
                )}
                
                {/* Badge categoría */}
                {item.categoria && (
                  <span 
                    className="absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-bold"
                    style={{ background: 'var(--accent)', color: 'white' }}
                  >
                    {item.categoria}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 
                      className="font-bold"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {item.nombre}
                    </h3>
                    <p 
                      className="text-xl font-black"
                      style={{ color: 'var(--accent)' }}
                    >
                      ${item.precio}
                    </p>
                  </div>
                  
                  {/* Stock */}
                  <div 
                    className="px-3 py-1 rounded-xl text-center"
                    style={{ 
                      background: item.stock <= 10 ? 'var(--error)20' : 'var(--bg-secondary)',
                      color: item.stock <= 10 ? 'var(--error)' : 'var(--text-primary)'
                    }}
                  >
                    <div className="text-lg font-black">{item.stock}</div>
                    <div className="text-[10px] font-bold uppercase">stock</div>
                  </div>
                </div>

                {/* Warning bajo stock */}
                {item.stock <= 10 && (
                  <div 
                    className="flex items-center gap-2 p-2 rounded-lg mb-3 text-sm"
                    style={{ background: 'var(--warning)20', color: 'var(--warning)' }}
                  >
                    <AlertTriangle size={16} />
                    Stock bajo
                  </div>
                )}

                {/* Botón eliminar */}
                <button
                  onClick={() => handleEliminar(item._id, item.nombre)}
                  className="w-full py-2 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                  style={{ 
                    background: 'var(--bg-secondary)', 
                    color: 'var(--error)'
                  }}
                >
                  <Trash2 size={16} />
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CatalogoStock;