import React, { useState, useEffect } from "react";
import { Eye, X, Check, Phone, Send, Clock, Truck } from "lucide-react";
import clienteAxios from "../../api/axios";

const PedidosManager = () => {
  const [pedidosPendientes, setPedidosPendientes] = useState([]);
  const [pedidosPorEnviar, setPedidosPorEnviar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [tab, setTab] = useState("pendientes"); // "pendientes" | "porEnviar"

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      const res = await clienteAxios.get("/api/admin/pending");
      const todos = Array.isArray(res.data) ? res.data : [];
      
      // Separar por estado
      setPedidosPendientes(todos.filter(p => p.estado === "recibido"));
      setPedidosPorEnviar(todos.filter(p => p.estado === "confirmado"));
    } catch (err) {
      console.error("Error al conectar:", err);
    } finally {
      setLoading(false);
    }
  };

  // VALIDAR pedido (Pedidos Pendientes → Por Enviar)
  const handleValidar = async () => {
    if (!pedidoSeleccionado) return;
    try {
      const res = await clienteAxios.put(`/api/admin/accept/${pedidoSeleccionado._id}`);
      if (res.data.whatsappUrl) {
        window.open(res.data.whatsappUrl, "_blank");
      }
      alert("✅ Pedido validado. Se notificó al cliente por WhatsApp.");
      setPedidoSeleccionado(null);
      fetchPedidos();
    } catch (err) {
      console.error("Error al validar:", err);
      alert("No se pudo validar el pedido.");
    }
  };

  // ENVIAR pedido (marcar como enviado/entregado)
  const handleEnviar = async (pedido) => {
    if (!window.confirm(`¿Confirmar envío del pedido ${pedido.folio}?`)) return;
    try {
      const res = await clienteAxios.put(`/api/admin/complete/${pedido._id}`);
      if (res.data.whatsappUrl) {
        window.open(res.data.whatsappUrl, "_blank");
      }
      alert("✅ Pedido enviado. Se notificó al cliente por WhatsApp.");
      fetchPedidos();
    } catch (err) {
      console.error("Error al enviar:", err);
      alert("Error al marcar como enviado.");
    }
  };

  // RECHAZAR pedido
  const handleRechazar = async (id) => {
    if (!window.confirm("¿Estás seguro de rechazar este pedido?")) return;
    try {
      await clienteAxios.put(`/api/admin/reject/${id}`);
      setPedidoSeleccionado(null);
      fetchPedidos();
      alert("Pedido rechazado.");
    } catch (err) {
      alert("No se pudo rechazar el pedido.");
    }
  };

  if (loading) {
    return (
      <div className="p-20 text-center font-black animate-pulse text-cyan-400">
        CARGANDO PEDIDOS...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* TABS */}
      <div className="flex gap-4 bg-[#1e293b] p-2 rounded-2xl">
        <button
          onClick={() => setTab("pendientes")}
          className={`flex-1 py-4 rounded-xl font-black uppercase text-xs flex items-center justify-center gap-2 transition-all ${
            tab === "pendientes"
              ? "bg-yellow-500 text-black"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Clock size={18} />
          Pendientes ({pedidosPendientes.length})
        </button>
        <button
          onClick={() => setTab("porEnviar")}
          className={`flex-1 py-4 rounded-xl font-black uppercase text-xs flex items-center justify-center gap-2 transition-all ${
            tab === "porEnviar"
              ? "bg-green-500 text-black"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Truck size={18} />
          Por Enviar ({pedidosPorEnviar.length})
        </button>
      </div>

      {/* CONTENIDO TABS */}
      {tab === "pendientes" && (
        <div className="space-y-4">
          <div className="bg-[#1e293b] p-4 rounded-2xl border border-slate-800">
            <h3 className="text-lg font-black text-yellow-400 uppercase flex items-center gap-2">
              <Clock size={20} /> Pedidos por Validar
            </h3>
            <p className="text-slate-500 text-xs">Revisa los detalles y valida para confirmar</p>
          </div>

          {pedidosPendientes.length === 0 ? (
            <div className="bg-[#1e293b] p-16 rounded-2xl border-2 border-dashed border-slate-800 text-center">
              <Clock size={48} className="mx-auto text-slate-700 mb-4" />
              <p className="text-slate-500 font-bold uppercase">No hay pedidos pendientes</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {pedidosPendientes.map((pedido) => (
                <div
                  key={pedido._id}
                  className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 flex justify-between items-center"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-yellow-500/20 text-yellow-400 text-[10px] px-2 py-0.5 rounded-full font-black uppercase">
                        Pendiente
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-black">FOLIO: {pedido.folio}</p>
                    <h3 className="font-bold text-white uppercase">{pedido.clienteId?.nombre}</h3>
                    <p className="text-sm font-black text-green-500">${pedido.total}.00</p>
                  </div>
                  <button
                    onClick={() => setPedidoSeleccionado(pedido)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black px-5 py-3 rounded-xl transition-all flex gap-2 items-center text-xs font-black uppercase"
                  >
                    <Eye size={16} /> Ver Detalles
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "porEnviar" && (
        <div className="space-y-4">
          <div className="bg-[#1e293b] p-4 rounded-2xl border border-slate-800">
            <h3 className="text-lg font-black text-green-400 uppercase flex items-center gap-2">
              <Truck size={20} /> Pedidos Listos para Enviar
            </h3>
            <p className="text-slate-500 text-xs">Haz clic en "Enviar" para notificar al cliente</p>
          </div>

          {pedidosPorEnviar.length === 0 ? (
            <div className="bg-[#1e293b] p-16 rounded-2xl border-2 border-dashed border-slate-800 text-center">
              <Truck size={48} className="mx-auto text-slate-700 mb-4" />
              <p className="text-slate-500 font-bold uppercase">No hay pedidos por enviar</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {pedidosPorEnviar.map((pedido) => (
                <div
                  key={pedido._id}
                  className="bg-[#1e293b] p-5 rounded-2xl border border-green-500/30 flex justify-between items-center"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-green-500/20 text-green-400 text-[10px] px-2 py-0.5 rounded-full font-black uppercase">
                        Validado ✓
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-black">FOLIO: {pedido.folio}</p>
                    <h3 className="font-bold text-white uppercase">{pedido.clienteId?.nombre}</h3>
                    <p className="text-xs text-slate-400">
                      📍 {pedido.direccion?.calle}, {pedido.direccion?.colonia}
                    </p>
                    <p className="text-sm font-black text-green-500 mt-1">${pedido.total}.00</p>
                  </div>
                  <button
                    onClick={() => handleEnviar(pedido)}
                    className="bg-green-500 hover:bg-green-600 text-black px-6 py-4 rounded-xl transition-all flex gap-2 items-center text-xs font-black uppercase shadow-lg shadow-green-900/30"
                  >
                    <Send size={18} /> Enviar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL DETALLES (Solo para pendientes) */}
      {pedidoSeleccionado && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e293b] border border-slate-700 w-full max-w-md rounded-3xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setPedidoSeleccionado(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-black uppercase italic mb-4 text-cyan-400 text-center">
              Detalle del Pedido
            </h2>

            {/* FOLIO */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-2xl mb-4 text-center">
              <p className="text-[10px] text-yellow-400 uppercase font-black">Folio</p>
              <p className="text-2xl font-black text-yellow-400">{pedidoSeleccionado.folio}</p>
            </div>

            <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800 mb-4 space-y-3">
              {/* Cliente */}
              <div className="border-b border-slate-800 pb-3">
                <p className="text-[10px] uppercase text-slate-500 font-black">Cliente:</p>
                <p className="text-sm text-white font-bold uppercase">
                  {pedidoSeleccionado.clienteId?.nombre}
                </p>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                  <Phone size={12} className="text-green-500" />
                  {pedidoSeleccionado.clienteId?.telefono}
                </p>
              </div>

              {/* Dirección */}
              <div className="border-b border-slate-800 pb-3">
                <p className="text-[10px] uppercase text-slate-500 font-black">Dirección:</p>
                <p className="text-sm text-slate-300">
                  📍 {pedidoSeleccionado.direccion?.calle}, {pedidoSeleccionado.direccion?.colonia}
                </p>
                {pedidoSeleccionado.direccion?.referencia && (
                  <p className="text-xs text-cyan-400 italic">
                    Ref: {pedidoSeleccionado.direccion.referencia}
                  </p>
                )}
              </div>

              {/* Productos */}
              <div>
                <p className="text-[10px] uppercase text-slate-500 font-black mb-2">Productos:</p>
                {pedidoSeleccionado.productos?.map((p, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-slate-900/50 p-2 rounded-lg mb-1">
                    <span className="text-xs text-white uppercase font-bold">{p.nombre}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-cyan-600/20 text-cyan-500 px-2 py-0.5 rounded font-black">
                        x{p.cantidad}
                      </span>
                      <span className="text-xs text-green-400 font-bold">
                        ${p.subtotal || p.precioUnitario * p.cantidad}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                <span className="text-sm uppercase text-slate-400 font-black">Total:</span>
                <span className="text-xl text-green-500 font-black">${pedidoSeleccionado.total}.00</span>
              </div>
            </div>

            {/* BOTONES */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleRechazar(pedidoSeleccionado._id)}
                className="bg-red-600/10 text-red-500 border border-red-600/20 py-4 rounded-xl font-black uppercase text-[10px] hover:bg-red-600 hover:text-white transition-all"
              >
                Rechazar
              </button>
              <button
                onClick={handleValidar}
                className="bg-green-500 text-black py-4 rounded-xl font-black uppercase text-[10px] hover:bg-green-600 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Check size={16} /> Validar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PedidosManager;