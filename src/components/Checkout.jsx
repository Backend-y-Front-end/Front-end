import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import clienteAxios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { X, CheckCircle, ArrowLeft, Minus, Plus, Trash2, MapPin, Clock } from "lucide-react";

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [carrito, setCarrito] = useState(
    JSON.parse(localStorage.getItem("carrito")) || []
  );
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarTicket, setMostrarTicket] = useState(false);
  const [ticketData, setTicketData] = useState(null);

  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [hora, setHora] = useState("09:00");

  const [datosEnvio, setDatosEnvio] = useState({
    nombre: user?.nombre || "",
    telefono: user?.telefono || "",
    calle: "",
    colonia: "",
    referencia: "",
    tipoEntrega: "Hoy",
  });

  const actualizarCantidad = (id, accion) => {
    const nuevoCarrito = carrito.map((item) => {
      if (item._id === id) {
        const nuevaCantidad = accion === "sumar" ? item.cantidad + 1 : item.cantidad - 1;
        return { ...item, cantidad: nuevaCantidad > 0 ? nuevaCantidad : 1 };
      }
      return item;
    });
    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
  };

  const eliminarDelCarrito = (id) => {
    const nuevoCarrito = carrito.filter((i) => i._id !== id);
    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
  };

  const totalUnidades = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const faltanLeños = totalUnidades < 3;
  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  const enviarPedido = async (e) => {
    e.preventDefault();

    const horaNum = parseInt(hora.split(":")[0]);
    if (horaNum < 7 || horaNum >= 14) {
      alert("🕒 El horario de entrega es de 7:00 AM a 2:00 PM.");
      return;
    }

    const pedido = {
      nombre: datosEnvio.nombre,
      telefono: datosEnvio.telefono,
      productos: carrito.map((item) => ({
        productoId: item._id,
        nombre: item.nombre,
        cantidad: item.cantidad,
        precioUnitario: item.precio,
        subtotal: item.precio * item.cantidad,
      })),
      total: total,
      fechaEntrega: `${fecha}T${hora}:00`,
      tipoEntrega: datosEnvio.tipoEntrega,
      direccion: {
        calle: datosEnvio.calle,
        colonia: datosEnvio.colonia,
        referencia: datosEnvio.referencia,
      },
      nota: `Pedido para el ${fecha} a las ${hora}`,
    };

    try {
      const res = await clienteAxios.post("/api/orders", pedido);
      setTicketData({
        folio: res.data.pedido.folio,
        productos: carrito,
        total: total,
        fecha: fecha,
        hora: hora,
        direccion: datosEnvio,
      });
      setMostrarTicket(true);
      localStorage.removeItem("carrito");
      setCarrito([]);
    } catch (error) {
      alert(error.response?.data?.message || "Error al procesar pedido");
    }
  };

  const inputStyle = {
    background: 'var(--bg-input)',
    border: '2px solid var(--border)',
    color: 'var(--text-primary)'
  };

  if (carrito.length === 0 && !mostrarTicket) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: 'var(--bg-primary)' }}
      >
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            El carrito está vacío
          </h2>
          <button
            onClick={() => navigate("/menu")}
            className="px-6 py-3 rounded-xl font-bold text-white"
            style={{ background: 'var(--gradient-fire)' }}
          >
            Ver Menú
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen py-8 px-4"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="max-w-lg mx-auto">
        {/* VISTA 1: CARRITO */}
        {!mostrarFormulario && !mostrarTicket && (
          <div 
            className="rounded-2xl overflow-hidden animate-fadeIn"
            style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow-lg)' }}
          >
            <div 
              className="p-6"
              style={{ background: 'var(--gradient-wood)' }}
            >
              <h2 className="text-xl font-bold text-white">Tu Carrito</h2>
            </div>

            <div className="p-6 space-y-4">
              {carrito.map((item) => (
                <div 
                  key={item._id}
                  className="p-4 rounded-xl"
                  style={{ background: 'var(--bg-secondary)' }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                      {item.nombre}
                    </span>
                    <button
                      onClick={() => eliminarDelCarrito(item._id)}
                      className="p-1"
                      style={{ color: 'var(--error)' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => actualizarCantidad(item._id, "restar")}
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: 'var(--bg-card)', color: 'var(--accent)' }}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() => actualizarCantidad(item._id, "sumar")}
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: 'var(--bg-card)', color: 'var(--accent)' }}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <span className="font-bold text-lg" style={{ color: 'var(--accent)' }}>
                      ${item.cantidad * item.precio}
                    </span>
                  </div>
                </div>
              ))}

              <div 
                className="flex justify-between items-center pt-4"
                style={{ borderTop: '2px solid var(--border)' }}
              >
                <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>TOTAL:</span>
                <span className="text-3xl font-black" style={{ color: 'var(--accent)' }}>${total}</span>
              </div>

              <button
                onClick={() => setMostrarFormulario(true)}
                disabled={faltanLeños}
                className="w-full py-4 rounded-xl font-bold text-white transition-all mt-4"
                style={{ 
                  background: faltanLeños ? 'var(--text-muted)' : 'var(--gradient-fire)',
                  opacity: faltanLeños ? 0.5 : 1
                }}
              >
                {faltanLeños ? `Faltan ${3 - totalUnidades} leños` : "Continuar"}
              </button>
            </div>
          </div>
        )}

        {/* VISTA 2: FORMULARIO */}
        {mostrarFormulario && !mostrarTicket && (
          <form 
            onSubmit={enviarPedido}
            className="rounded-2xl overflow-hidden animate-fadeIn"
            style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow-lg)' }}
          >
            <div 
              className="p-6"
              style={{ background: 'var(--gradient-wood)' }}
            >
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Clock size={24} />
                Agenda tu Entrega
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl outline-none"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Hora (7am-2pm)
                  </label>
                  <input
                    type="time"
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl outline-none"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div 
                className="pt-4"
                style={{ borderTop: '1px solid var(--border)' }}
              >
                <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <MapPin size={20} style={{ color: 'var(--accent)' }} />
                  Dirección de entrega
                </h3>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Calle y número"
                    value={datosEnvio.calle}
                    onChange={(e) => setDatosEnvio({ ...datosEnvio, calle: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl outline-none"
                    style={inputStyle}
                  />
                  <input
                    type="text"
                    placeholder="Colonia"
                    value={datosEnvio.colonia}
                    onChange={(e) => setDatosEnvio({ ...datosEnvio, colonia: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl outline-none"
                    style={inputStyle}
                  />
                  <input
                    type="text"
                    placeholder="Referencia (opcional)"
                    value={datosEnvio.referencia}
                    onChange={(e) => setDatosEnvio({ ...datosEnvio, referencia: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl outline-none"
                    style={inputStyle}
                  />
                  <input
                    type="tel"
                    placeholder="Teléfono de contacto"
                    value={datosEnvio.telefono}
                    onChange={(e) => setDatosEnvio({ ...datosEnvio, telefono: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl outline-none"
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Resumen */}
              <div 
                className="p-4 rounded-xl mt-4"
                style={{ background: 'var(--bg-secondary)' }}
              >
                <div className="flex justify-between mb-2">
                  <span style={{ color: 'var(--text-muted)' }}>Productos:</span>
                  <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{totalUnidades} leños</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold" style={{ color: 'var(--text-primary)' }}>TOTAL:</span>
                  <span className="text-xl font-black" style={{ color: 'var(--accent)' }}>${total}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl font-bold text-white transition-all"
                style={{ background: 'var(--gradient-fire)' }}
              >
                FINALIZAR PEDIDO 
              </button>

              <button
                type="button"
                onClick={() => setMostrarFormulario(false)}
                className="w-full py-3 font-bold flex items-center justify-center gap-2"
                style={{ color: 'var(--text-muted)' }}
              >
                <ArrowLeft size={18} />
                Volver al carrito
              </button>
            </div>
          </form>
        )}

        {/* MODAL TICKET */}
        {mostrarTicket && ticketData && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)' }}
          >
            <div 
              className="w-full max-w-md rounded-2xl overflow-hidden animate-fadeIn"
              style={{ background: 'var(--bg-card)', maxHeight: '90vh', overflowY: 'auto' }}
            >
              <div 
                className="p-6 text-center"
                style={{ background: 'var(--gradient-fire)' }}
              >
                <CheckCircle size={48} className="mx-auto mb-3 text-white" />
                <h2 className="text-xl font-bold text-white">¡Pedido Recibido!</h2>
              </div>

              <div className="p-6">
                <div 
                  className="text-center p-4 rounded-xl mb-6"
                  style={{ background: 'var(--bg-secondary)' }}
                >
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Tu Folio</p>
                  <p className="text-3xl font-black" style={{ color: 'var(--accent)' }}>
                    {ticketData.folio}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Productos:</h3>
                    {ticketData.productos.map((item, idx) => (
                      <div key={idx} className="flex justify-between py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{item.nombre} x{item.cantidad}</span>
                        <span className="font-bold" style={{ color: 'var(--text-primary)' }}>${item.precio * item.cantidad}</span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-2">
                      <span className="font-bold" style={{ color: 'var(--text-primary)' }}>TOTAL:</span>
                      <span className="font-black text-xl" style={{ color: 'var(--accent)' }}>${ticketData.total}</span>
                    </div>
                  </div>

                  <div 
                    className="p-4 rounded-xl"
                    style={{ background: 'var(--bg-secondary)' }}
                  >
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Entrega programada</p>
                    <p className="font-bold" style={{ color: 'var(--text-primary)' }}>
                      {new Date(ticketData.fecha).toLocaleDateString("es-MX", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })} a las {ticketData.hora}
                    </p>
                  </div>

                  <div 
                    className="p-4 rounded-xl"
                    style={{ background: 'var(--bg-secondary)' }}
                  >
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Dirección</p>
                    <p className="font-bold" style={{ color: 'var(--text-primary)' }}>
                      {ticketData.direccion.calle}, {ticketData.direccion.colonia}
                    </p>
                  </div>
                </div>

                <p 
                  className="text-center text-sm mt-6"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Te notificaremos por WhatsApp cuando esté confirmado.
                </p>

                <button
                  onClick={() => {
                    setMostrarTicket(false);
                    navigate("/mis-pedidos");
                  }}
                  className="w-full py-4 rounded-xl font-bold text-white mt-6"
                  style={{ background: 'var(--gradient-fire)' }}
                >
                  Ver Mis Pedidos
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;