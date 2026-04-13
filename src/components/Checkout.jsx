import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import clienteAxios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { X, CheckCircle } from "lucide-react";

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [carrito, setCarrito] = useState(
    JSON.parse(localStorage.getItem("carrito")) || [],
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
        const nuevaCantidad =
          accion === "sumar" ? item.cantidad + 1 : item.cantidad - 1;
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
  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0,
  );

  const enviarPedido = async (e) => {
    e.preventDefault();

    const horaNum = parseInt(hora.split(":")[0]);
    if (horaNum < 7 || horaNum >= 14) {
      alert(
        "🕒 El horario de entrega es de 7:00 AM a 2:00 PM. Por favor ajusta la hora.",
      );
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

  if (carrito.length === 0 && !mostrarTicket) {
    return (
      <div className="min-h-screen bg-[#FDF6E3] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <p className="font-black italic text-[#8B6914] uppercase">
            El carrito está vacío
          </p>
          <button
            onClick={() => navigate("/menu")}
            className="mt-4 bg-[#8B4513] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#6B3410]"
          >
            Ver Menú
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF6E3] pb-24 p-4 font-sans">
      {/* VISTA 1: CARRITO */}
      {!mostrarFormulario && !mostrarTicket && (
        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl p-6 border border-[#E8D5B7]">
          <h2 className="text-2xl font-black uppercase italic mb-6 border-b-4 border-[#8B4513] inline-block text-[#5D3A1A]">
            Tu Carrito
          </h2>

          <div className="space-y-4 mb-8">
            {carrito.map((item) => (
              <div
                key={item._id}
                className="bg-[#F5E6D3] p-4 rounded-3xl flex flex-col gap-2"
              >
                <div className="flex justify-between font-black text-sm uppercase text-[#5D3A1A]">
                  <span>{item.nombre}</span>
                  <button
                    onClick={() => eliminarDelCarrito(item._id)}
                    className="text-red-400 text-xs hover:text-red-600"
                  >
                    Quitar
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center bg-white rounded-xl px-3 py-1 gap-4 border border-[#E8D5B7]">
                    <button
                      onClick={() => actualizarCantidad(item._id, "restar")}
                      className="font-black text-[#8B4513] text-lg"
                    >
                      −
                    </button>
                    <span className="font-black text-sm text-[#5D3A1A]">
                      {item.cantidad}
                    </span>
                    <button
                      onClick={() => actualizarCantidad(item._id, "sumar")}
                      className="font-black text-[#8B4513] text-lg"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-black text-[#5D3A1A]">
                    ${item.cantidad * item.precio}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#5D3A1A] text-white p-4 rounded-2xl flex justify-between font-black mb-6">
            <span>TOTAL:</span>
            <span>${total}</span>
          </div>

          <button
            disabled={faltanLeños}
            onClick={() => setMostrarFormulario(true)}
            className={`w-full py-4 rounded-2xl font-black uppercase text-xs transition-all ${
              faltanLeños
                ? "bg-[#E8D5B7] text-[#8B6914]"
                : "bg-[#8B4513] text-white shadow-lg hover:bg-[#6B3410]"
            }`}
          >
            {faltanLeños ? `Faltan ${3 - totalUnidades} leños` : "Pedir"}
          </button>
        </div>
      )}

      {/* VISTA 2: FORMULARIO */}
      {mostrarFormulario && !mostrarTicket && (
        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl p-6 border border-[#E8D5B7]">
          <h2 className="text-xl font-black mb-6 italic uppercase text-[#8B4513] text-center">
            Agenda tu Entrega
          </h2>

          <form onSubmit={enviarPedido} className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase text-[#8B6914] ml-2">
                ¿Qué día quieres tus leños?
              </label>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                className="w-full bg-[#F5E6D3] p-4 rounded-2xl text-sm font-bold border-none focus:ring-2 focus:ring-[#8B4513] text-[#5D3A1A]"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-[#8B6914] ml-2">
                ¿A qué hora? (7 AM - 2 PM)
              </label>
              <input
                type="time"
                className="w-full bg-[#F5E6D3] p-4 rounded-2xl text-sm font-bold border-none focus:ring-2 focus:ring-[#8B4513] text-[#5D3A1A]"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                required
              />
            </div>

            <hr className="border-[#E8D5B7] my-2" />

            <input
              className="w-full bg-[#F5E6D3] p-4 rounded-2xl text-sm font-bold border-none focus:ring-2 focus:ring-[#8B4513] text-[#5D3A1A]"
              placeholder="Calle y Número"
              value={datosEnvio.calle}
              onChange={(e) =>
                setDatosEnvio({ ...datosEnvio, calle: e.target.value })
              }
              required
            />

            <input
              className="w-full bg-[#F5E6D3] p-4 rounded-2xl text-sm font-bold border-none focus:ring-2 focus:ring-[#8B4513] text-[#5D3A1A]"
              placeholder="Colonia"
              value={datosEnvio.colonia}
              onChange={(e) =>
                setDatosEnvio({ ...datosEnvio, colonia: e.target.value })
              }
              required
            />

            <input
              className="w-full bg-[#F5E6D3] p-4 rounded-2xl text-sm font-bold border-none focus:ring-2 focus:ring-[#8B4513] text-[#5D3A1A]"
              placeholder="Referencia (ej: casa azul, portón negro)"
              value={datosEnvio.referencia}
              onChange={(e) =>
                setDatosEnvio({ ...datosEnvio, referencia: e.target.value })
              }
            />

            <input
              className="w-full bg-[#F5E6D3] p-4 rounded-2xl text-sm font-bold border-none focus:ring-2 focus:ring-[#8B4513] text-[#5D3A1A]"
              placeholder="Teléfono"
              value={datosEnvio.telefono}
              onChange={(e) =>
                setDatosEnvio({ ...datosEnvio, telefono: e.target.value })
              }
              required
            />

            {/* Resumen del pedido */}
            <div className="bg-[#5D3A1A] text-white p-4 rounded-2xl">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#E8D5B7]">Productos:</span>
                <span>{totalUnidades} leños</span>
              </div>
              <div className="flex justify-between font-black text-lg">
                <span>TOTAL:</span>
                <span>${total}.00</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#5D3A1A] text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all mt-4 hover:bg-[#8B4513]"
            >
              FINALIZAR PEDIDO 🪵
            </button>

            <button
              type="button"
              onClick={() => setMostrarFormulario(false)}
              className="w-full text-[#8B6914] font-bold text-[10px] uppercase pt-2 hover:text-[#5D3A1A]"
            >
              ← Volver al carrito
            </button>
          </form>
        </div>
      )}

      {/* MODAL DE TICKET */}
      {mostrarTicket && ticketData && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative animate-in zoom-in duration-300">
            <button
              onClick={() => {
                setMostrarTicket(false);
                navigate("/mis-pedidos");
              }}
              className="absolute top-4 right-4 text-[#8B6914] hover:text-[#5D3A1A]"
            >
              <X size={20} />
            </button>

            <div className="text-center border-b-2 border-dashed border-[#E8D5B7] pb-4 mb-4">
              <h2 className="text-2xl font-black text-[#5D3A1A]">
                🪵 LEÑOS RELLENOS
              </h2>
              <p className="text-xs text-[#8B6914] uppercase tracking-widest">
                Ticket de Pedido
              </p>
            </div>

            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle size={32} className="text-green-500" />
              </div>
            </div>

            <p className="text-center text-green-600 font-bold mb-4">
              ¡Pedido recibido con éxito!
            </p>

            <div className="bg-[#8B4513] text-white text-center py-4 rounded-2xl mb-4">
              <p className="text-xs uppercase tracking-widest opacity-80">
                Tu Folio
              </p>
              <p className="text-3xl font-black">{ticketData.folio}</p>
            </div>

            <div className="space-y-2 border-b border-dashed border-[#E8D5B7] pb-4 mb-4">
              <p className="text-[10px] text-[#8B6914] uppercase font-bold">
                Detalle:
              </p>
              {ticketData.productos.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-[#5D3A1A]">
                    {item.nombre} x{item.cantidad}
                  </span>
                  <span className="font-bold text-[#8B4513]">
                    ${item.precio * item.cantidad}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mb-4">
              <span className="text-[#8B6914] font-bold">TOTAL:</span>
              <span className="text-2xl font-black text-[#5D3A1A]">
                ${ticketData.total}.00
              </span>
            </div>

            <div className="bg-[#F5E6D3] p-3 rounded-xl text-center mb-4">
              <p className="text-xs text-[#8B6914] uppercase">
                Entrega programada
              </p>
              <p className="font-bold text-[#5D3A1A]">
                {new Date(ticketData.fecha).toLocaleDateString("es-MX", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}{" "}
                a las {ticketData.hora}
              </p>
            </div>

            <div className="bg-[#FFFDF7] p-3 rounded-xl mb-4 border border-[#E8D5B7]">
              <p className="text-xs text-[#8B6914] uppercase mb-1">
                Dirección de entrega
              </p>
              <p className="text-sm font-medium text-[#5D3A1A]">
                {ticketData.direccion.calle}, {ticketData.direccion.colonia}
              </p>
              {ticketData.direccion.referencia && (
                <p className="text-xs text-[#8B6914] italic">
                  Ref: {ticketData.direccion.referencia}
                </p>
              )}
            </div>

            <div className="text-center text-xs text-[#8B6914] mb-4">
              <p>¡Gracias por tu pedido!</p>
              <p>Te notificaremos por WhatsApp cuando esté confirmado.</p>
            </div>

            <button
              onClick={() => {
                setMostrarTicket(false);
                navigate("/mis-pedidos");
              }}
              className="w-full bg-[#5D3A1A] text-white py-4 rounded-2xl font-black uppercase text-xs hover:bg-[#8B4513] transition-all"
            >
              Ver Mis Pedidos
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
