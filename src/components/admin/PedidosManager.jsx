import { useState, useEffect } from "react";
import { Eye, X, Check, Phone, Send, Clock, Truck, Package, CheckCircle, AlertCircle } from "lucide-react";
import clienteAxios from "../../api/axios";

const PedidosManager = () => {
  const [pedidosPendientes, setPedidosPendientes] = useState([]);
  const [pedidosPorEnviar, setPedidosPorEnviar] = useState([]);
  const [pedidosEnviados, setPedidosEnviados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [tab, setTab] = useState("pendientes");

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      const resPending = await clienteAxios.get("/api/admin/pending");
      const todosPendientes = Array.isArray(resPending.data) ? resPending.data : [];

      setPedidosPendientes(todosPendientes.filter(p => p.estado === "recibido"));
      setPedidosPorEnviar(todosPendientes.filter(p => p.estado === "confirmado"));

      try {
        const resEnviados = await clienteAxios.get("/api/admin/enviados");
        setPedidosEnviados(Array.isArray(resEnviados.data) ? resEnviados.data : []);
      } catch {
        setPedidosEnviados([]);
      }
    } catch (err) {
      console.error("Error al conectar:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleValidar = async () => {
    if (!pedidoSeleccionado) return;
    try {
      const res = await clienteAxios.put(`/api/admin/accept/${pedidoSeleccionado._id}`);
      if (res.data.whatsappUrl) window.open(res.data.whatsappUrl, "_blank");
      alert("Pedido validado ✅");
      setPedidoSeleccionado(null);
      fetchPedidos();
    } catch (err) {
      alert("Error al validar");
    }
  };

  const handleEnviar = async (pedido) => {
    if (!window.confirm(`¿Confirmar envío del pedido ${pedido.folio}?`)) return;
    try {
      const res = await clienteAxios.put(`/api/admin/complete/${pedido._id}`);
      if (res.data.whatsappUrl) window.open(res.data.whatsappUrl, "_blank");
      alert("Pedido enviado 🚴");
      fetchPedidos();
    } catch (err) {
      alert("Error al enviar");
    }
  };

  const handleEntregar = async (pedido) => {
    if (!window.confirm(`¿Confirmar entrega del pedido ${pedido.folio}?`)) return;
    try {
      const res = await clienteAxios.put(`/api/admin/deliver/${pedido._id}`);
      if (res.data.whatsappUrl) window.open(res.data.whatsappUrl, "_blank");
      alert("Pedido entregado ✅");
      fetchPedidos();
    } catch (err) {
      alert("Error al entregar");
    }
  };

  const handleRechazar = async (id) => {
    if (!window.confirm("¿Rechazar este pedido?")) return;
    try {
      await clienteAxios.put(`/api/admin/reject/${id}`);
      setPedidoSeleccionado(null);
      fetchPedidos();
      alert("Pedido rechazado");
    } catch (err) {
      alert("Error al rechazar");
    }
  };

  const tabs = [
    { id: "pendientes", label: "Pendientes", count: pedidosPendientes.length, icon: Clock, color: "var(--warning)" },
    { id: "porEnviar", label: "Por Enviar", count: pedidosPorEnviar.length, icon: Package, color: "var(--success)" },
    { id: "porEntregar", label: "En Camino", count: pedidosEnviados.length, icon: Truck, color: "var(--accent)" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="text-5xl animate-float mb-4">📦</div>
          <p style={{ color: 'var(--text-muted)' }}>Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  const PedidoCard = ({ pedido, estado, onAction, actionLabel, actionIcon: ActionIcon, actionColor }) => (
    <div 
      className="p-5 rounded-2xl transition-all hover:scale-[1.01]"
      style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow)' }}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <span 
            className="text-xs font-bold px-2 py-1 rounded-lg"
            style={{ background: `${estado.color}20`, color: estado.color }}
          >
            {estado.label}
          </span>
          <p className="text-lg font-black mt-2" style={{ color: 'var(--accent)' }}>
            {pedido.folio}
          </p>
        </div>
        <p className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>
          ${pedido.total}
        </p>
      </div>

      <div className="mb-4">
        <p className="font-bold" style={{ color: 'var(--text-primary)' }}>
          {pedido.clienteId?.nombre}
        </p>
        {pedido.direccion && (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {pedido.direccion.calle}, {pedido.direccion.colonia}
          </p>
        )}
        {pedido.clienteId?.telefono && (
          <p className="text-sm flex items-center gap-1 mt-1" style={{ color: 'var(--text-muted)' }}>
            <Phone size={12} />
            {pedido.clienteId.telefono}
          </p>
        )}
      </div>

      <button
        onClick={onAction}
        className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
        style={{ background: actionColor }}
      >
        <ActionIcon size={18} />
        {actionLabel}
      </button>
    </div>
  );

  return (
    <div className="space-y-6 pb-24 md:pb-0">
      {/* Tabs */}
      <div 
        className="flex gap-2 p-2 rounded-2xl overflow-x-auto"
        style={{ background: 'var(--bg-card)' }}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all whitespace-nowrap"
            style={{ 
              background: tab === t.id ? t.color : 'transparent',
              color: tab === t.id ? 'white' : 'var(--text-muted)'
            }}
          >
            <t.icon size={18} />
            {t.label}
            <span 
              className="px-2 py-0.5 rounded-full text-xs"
              style={{ 
                background: tab === t.id ? 'rgba(255,255,255,0.3)' : 'var(--bg-secondary)',
                color: tab === t.id ? 'white' : 'var(--text-muted)'
              }}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Pendientes */}
      {tab === "pendientes" && (
        <div className="space-y-4">
          {pedidosPendientes.length === 0 ? (
            <div 
              className="text-center py-12 rounded-2xl"
              style={{ background: 'var(--bg-card)' }}
            >
              <CheckCircle size={48} className="mx-auto mb-3" style={{ color: 'var(--success)' }} />
              <p className="font-bold" style={{ color: 'var(--text-primary)' }}>
                No hay pedidos pendientes
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pedidosPendientes.map((pedido) => (
                <PedidoCard
                  key={pedido._id}
                  pedido={pedido}
                  estado={{ label: "Pendiente", color: "var(--warning)" }}
                  onAction={() => setPedidoSeleccionado(pedido)}
                  actionLabel="Ver Detalles"
                  actionIcon={Eye}
                  actionColor="var(--warning)"
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Por Enviar */}
      {tab === "porEnviar" && (
        <div className="space-y-4">
          {pedidosPorEnviar.length === 0 ? (
            <div 
              className="text-center py-12 rounded-2xl"
              style={{ background: 'var(--bg-card)' }}
            >
              <Package size={48} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
              <p className="font-bold" style={{ color: 'var(--text-primary)' }}>
                No hay pedidos por enviar
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pedidosPorEnviar.map((pedido) => (
                <PedidoCard
                  key={pedido._id}
                  pedido={pedido}
                  estado={{ label: "Validado", color: "var(--success)" }}
                  onAction={() => handleEnviar(pedido)}
                  actionLabel="Marcar Enviado"
                  actionIcon={Send}
                  actionColor="var(--success)"
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Por Entregar */}
      {tab === "porEntregar" && (
        <div className="space-y-4">
          {pedidosEnviados.length === 0 ? (
            <div 
              className="text-center py-12 rounded-2xl"
              style={{ background: 'var(--bg-card)' }}
            >
              <Truck size={48} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
              <p className="font-bold" style={{ color: 'var(--text-primary)' }}>
                No hay pedidos en camino
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pedidosEnviados.map((pedido) => (
                <PedidoCard
                  key={pedido._id}
                  pedido={pedido}
                  estado={{ label: "En Camino", color: "var(--accent)" }}
                  onAction={() => handleEntregar(pedido)}
                  actionLabel="Confirmar Entrega"
                  actionIcon={CheckCircle}
                  actionColor="var(--accent)"
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal Detalle */}
      {pedidoSeleccionado && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)' }}
        >
          <div 
            className="w-full max-w-md rounded-2xl overflow-hidden animate-fadeIn"
            style={{ background: 'var(--bg-card)', maxHeight: '90vh', overflowY: 'auto' }}
          >
            <div 
              className="p-6 flex justify-between items-center"
              style={{ background: 'var(--gradient-wood)' }}
            >
              <h2 className="text-xl font-bold text-white">Detalle del Pedido</h2>
              <button
                onClick={() => setPedidoSeleccionado(null)}
                className="p-2 rounded-full"
                style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div 
                className="text-center p-4 rounded-xl"
                style={{ background: 'var(--bg-secondary)' }}
              >
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Folio</p>
                <p className="text-2xl font-black" style={{ color: 'var(--accent)' }}>
                  {pedidoSeleccionado.folio}
                </p>
              </div>

              <div>
                <p className="text-sm font-bold mb-1" style={{ color: 'var(--text-muted)' }}>Cliente</p>
                <p className="font-bold" style={{ color: 'var(--text-primary)' }}>
                  {pedidoSeleccionado.clienteId?.nombre}
                </p>
                <p className="text-sm flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                  <Phone size={14} />
                  {pedidoSeleccionado.clienteId?.telefono}
                </p>
              </div>

              <div>
                <p className="text-sm font-bold mb-1" style={{ color: 'var(--text-muted)' }}>Dirección</p>
                <p style={{ color: 'var(--text-primary)' }}>
                  {pedidoSeleccionado.direccion?.calle}, {pedidoSeleccionado.direccion?.colonia}
                </p>
                {pedidoSeleccionado.direccion?.referencia && (
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Ref: {pedidoSeleccionado.direccion.referencia}
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm font-bold mb-2" style={{ color: 'var(--text-muted)' }}>Productos</p>
                <div 
                  className="rounded-xl overflow-hidden"
                  style={{ background: 'var(--bg-secondary)' }}
                >
                  {pedidoSeleccionado.productos?.map((p, idx) => (
                    <div 
                      key={idx} 
                      className="flex justify-between p-3"
                      style={{ borderBottom: idx < pedidoSeleccionado.productos.length - 1 ? '1px solid var(--border)' : 'none' }}
                    >
                      <span style={{ color: 'var(--text-primary)' }}>{p.nombre}</span>
                      <div className="text-right">
                        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>x{p.cantidad}</span>
                        <span className="ml-3 font-bold" style={{ color: 'var(--accent)' }}>
                          ${p.subtotal || p.precioUnitario * p.cantidad}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="font-bold" style={{ color: 'var(--text-primary)' }}>Total:</span>
                <span className="text-2xl font-black" style={{ color: 'var(--accent)' }}>
                  ${pedidoSeleccionado.total}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4">
                <button
                  onClick={() => handleRechazar(pedidoSeleccionado._id)}
                  className="py-4 rounded-xl font-bold transition-all"
                  style={{ 
                    background: 'var(--bg-secondary)', 
                    color: 'var(--error)',
                    border: '2px solid var(--error)'
                  }}
                >
                  Rechazar
                </button>
                <button
                  onClick={handleValidar}
                  className="py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2"
                  style={{ background: 'var(--success)' }}
                >
                  <Check size={18} />
                  Validar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PedidosManager;