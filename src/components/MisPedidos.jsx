import { useState, useEffect } from "react";
import { Package, Truck, CheckCircle, Clock, XCircle } from "lucide-react";
import clienteAxios from "../api/axios";

const ESTADOS = {
  recibido: {
    label: "Recibido",
    color: "var(--warning)",
    icon: Clock,
    description: "Esperando confirmación ⏳",
  },
  confirmado: {
    label: "Confirmado",
    color: "#3B82F6",
    icon: Package,
    description: "En preparación 📦",
  },
  enCamino: {
    label: "En Camino",
    color: "var(--accent)",
    icon: Truck,
    description: "Tu pedido va en camino 🚴",
  },
  entregado: {
    label: "Entregado",
    color: "var(--success)",
    icon: CheckCircle,
    description: "¡Entregado! ✅",
  },
  cancelado: {
    label: "Cancelado",
    color: "var(--error)",
    icon: XCircle,
    description: "Pedido cancelado ❌",
  },
};

const MisPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMisPedidos = async () => {
      try {
        setLoading(true);
        const res = await clienteAxios.get("/api/orders/historial");
        setPedidos(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error("Error al cargar pedidos:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchMisPedidos();
  }, []);

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--bg-primary)' }}
      >
        <div className="text-center">
          <div className="text-5xl animate-float mb-4">🪵</div>
          <p style={{ color: 'var(--text-muted)' }}>Cargando tus pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen py-8 px-4"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="max-w-2xl mx-auto">
        <h2 
          className="text-2xl font-bold mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          Mis Pedidos
        </h2>

        {pedidos.length === 0 ? (
          <div 
            className="text-center py-16 rounded-2xl"
            style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow)' }}
          >
            <div className="text-6xl mb-4">📦</div>
            <p className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
              No tienes pedidos aún
            </p>
            <p style={{ color: 'var(--text-muted)' }}>
              ¡Haz tu primer pedido de Leños Rellenos!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pedidos.map((p) => {
              const estadoConfig = ESTADOS[p.estado] || ESTADOS.recibido;
              const IconEstado = estadoConfig.icon;
              const estadoIndex = ["recibido", "confirmado", "enCamino", "entregado"].indexOf(p.estado);

              return (
                <div
                  key={p._id}
                  className="rounded-2xl overflow-hidden animate-fadeIn"
                  style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow)' }}
                >
                  <div className="p-5">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Folio</p>
                        <p className="text-xl font-black" style={{ color: 'var(--accent)' }}>
                          {p.folio}
                        </p>
                      </div>
                      <div 
                        className="px-3 py-2 rounded-xl flex items-center gap-2"
                        style={{ background: `${estadoConfig.color}20`, color: estadoConfig.color }}
                      >
                        <IconEstado size={16} />
                        <span className="text-sm font-bold">{estadoConfig.description}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex gap-1 mb-4">
                      {["recibido", "confirmado", "enCamino", "entregado"].map((estado, idx) => (
                        <div
                          key={estado}
                          className="flex-1 h-2 rounded-full transition-all"
                          style={{
                            background: estadoIndex >= idx
                              ? p.estado === "cancelado" ? 'var(--error)' : 'var(--accent)'
                              : 'var(--border)'
                          }}
                        />
                      ))}
                    </div>

                    {/* Productos */}
                    <div 
                      className="p-3 rounded-xl mb-4"
                      style={{ background: 'var(--bg-secondary)' }}
                    >
                      {p.productos.map((prod, idx) => (
                        <div 
                          key={idx} 
                          className="flex justify-between py-1"
                        >
                          <span style={{ color: 'var(--text-secondary)' }}>{prod.nombre}</span>
                          <span className="font-bold" style={{ color: 'var(--text-primary)' }}>x{prod.cantidad}</span>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        {new Date(p.fechaPedido).toLocaleDateString("es-MX", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <span className="text-xl font-black" style={{ color: 'var(--accent)' }}>
                        ${p.total}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MisPedidos;