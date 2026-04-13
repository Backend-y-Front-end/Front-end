import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import clienteAxios from "../api/axios";
import { ShoppingCart, Plus, Minus, Trash2, X } from "lucide-react";

const Menu = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [mostrarCarritoMobile, setMostrarCarritoMobile] = useState(false);
  const BACKEND_URL = "https://backend-production-0532.up.railway.app";

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await clienteAxios.get("/api/products");
        setProductos(res.data);
        const initialQtys = {};
        res.data.forEach((p) => (initialQtys[p._id] = 1));
        setCantidades(initialQtys);
      } catch (e) {
        console.error(e);
      }
    };
    fetchProductos();

    const savedCart = JSON.parse(localStorage.getItem("carrito")) || [];
    setCarrito(savedCart);
  }, []);

  const manejarCantidad = (id, accion) => {
    setCantidades((prev) => ({
      ...prev,
      [id]: accion === "mas" ? prev[id] + 1 : Math.max(1, prev[id] - 1),
    }));
  };

  const agregarAlCarrito = (producto) => {
    if (!user) {
      alert("Para agregar productos al carrito, necesitas iniciar sesión 🔐");
      navigate("/login");
      return;
    }

    const cantidadSeleccionada = cantidades[producto._id] || 1;
    let nuevoCarrito = [...carrito];
    const index = nuevoCarrito.findIndex((i) => i._id === producto._id);

    if (index >= 0) {
      nuevoCarrito[index].cantidad += cantidadSeleccionada;
    } else {
      nuevoCarrito.push({ ...producto, cantidad: cantidadSeleccionada });
    }

    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    setCantidades((prev) => ({ ...prev, [producto._id]: 1 }));
  };

  const actualizarCantidadCarrito = (id, accion) => {
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

  const totalCarrito = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const totalPrecio = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const faltanLeños = totalCarrito < 3;

  const handlePedir = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate("/checkout");
  };

  // Componente del Carrito
  const CarritoContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-black text-[#5D3A1A] uppercase flex items-center gap-2">
          <ShoppingCart size={20} /> Tu Carrito
        </h3>
        <span className="bg-[#8B4513] text-white text-xs px-2 py-1 rounded-full font-bold">
          {totalCarrito}
        </span>
      </div>

      {carrito.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
          <span className="text-4xl mb-3">🛒</span>
          <p className="text-[#8B6914] font-medium text-sm">Tu carrito está vacío</p>
          <p className="text-[#A89B8B] text-xs mt-1">Agrega productos del menú</p>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {carrito.map((item) => (
              <div key={item._id} className="bg-[#F5E6D3] p-3 rounded-xl">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-sm text-[#5D3A1A] uppercase flex-1">
                    {item.nombre}
                  </span>
                  <button
                    onClick={() => eliminarDelCarrito(item._id)}
                    className="text-red-400 hover:text-red-600 p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center bg-white rounded-lg px-2 py-1 gap-2 border border-[#E8D5B7]">
                    <button
                      onClick={() => actualizarCantidadCarrito(item._id, "restar")}
                      className="text-[#8B4513] hover:text-[#5D3A1A]"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-bold text-sm text-[#5D3A1A] w-4 text-center">
                      {item.cantidad}
                    </span>
                    <button
                      onClick={() => actualizarCantidadCarrito(item._id, "sumar")}
                      className="text-[#8B4513] hover:text-[#5D3A1A]"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="font-black text-[#8B4513]">
                    ${item.cantidad * item.precio}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t-2 border-[#E8D5B7]">
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold text-[#5D3A1A]">Total:</span>
              <span className="text-2xl font-black text-[#8B4513]">${totalPrecio}</span>
            </div>

            {faltanLeños && (
              <p className="text-center text-[#8B6914] text-xs mb-3 bg-[#FFF8E7] p-2 rounded-lg">
                ⚠️ Mínimo 3 leños para pedir ({3 - totalCarrito} más)
              </p>
            )}

            <button
              onClick={handlePedir}
              disabled={faltanLeños}
              className={`w-full py-4 rounded-xl font-black uppercase text-sm transition-all ${
                faltanLeños
                  ? "bg-[#E8D5B7] text-[#8B6914] cursor-not-allowed"
                  : "bg-[#8B4513] text-white hover:bg-[#6B3410] active:scale-95 shadow-lg"
              }`}
            >
              {faltanLeños ? `Faltan ${3 - totalCarrito} leños` : "🪵 Pedir Ahora"}
            </button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDF6E3]">
      {/* Header */}
      <div className="bg-[#5D3A1A] p-6 text-center shadow-sm">
        <h1 className="text-2xl md:text-3xl font-black italic uppercase text-white">
          Menú <span className="text-[#D4A574]">Leños</span>
        </h1>
        <p className="text-[#E8D5B7] text-sm">El sabor artesanal en tu mesa</p>
      </div>

      <div className="flex">
        {/* Productos */}
        <div className="flex-1 p-4 md:p-6 pb-24 md:pb-6">
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productos.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#E8D5B7] flex flex-col"
              >
                <div className="relative">
                  <img
                    src={`${BACKEND_URL}${item.imagenUrl}`}
                    className="h-40 w-full object-cover"
                    alt={item.nombre}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x300?text=Leño+Relleno";
                    }}
                  />
                  <span className="absolute top-3 right-3 text-[9px] bg-[#8B4513] text-white px-2 py-1 rounded-full font-black uppercase">
                    {item.categoria}
                  </span>
                </div>

                <div className="p-4 flex-grow flex flex-col">
                  <h3 className="text-lg font-black uppercase italic text-[#5D3A1A] text-center">
                    {item.nombre}
                  </h3>
                  <p className="text-[#8B6914] text-xs text-center mt-1 leading-relaxed italic flex-grow">
                    {item.descripcion || "Delicioso leño artesanal"}
                  </p>
                  <p className="text-2xl font-black text-[#8B4513] text-center my-3">
                    ${item.precio}
                  </p>

                  <div className="flex justify-center mb-4">
                    <div className="bg-[#F5E6D3] rounded-xl flex items-center gap-4 px-3 py-1 border border-[#E8D5B7]">
                      <button
                        onClick={() => manejarCantidad(item._id, "menos")}
                        className="text-xl font-bold text-[#8B4513] hover:text-[#5D3A1A]"
                      >
                        −
                      </button>
                      <span className="text-lg font-black text-[#5D3A1A] w-5 text-center">
                        {cantidades[item._id] || 1}
                      </span>
                      <button
                        onClick={() => manejarCantidad(item._id, "mas")}
                        className="text-xl font-bold text-[#8B4513] hover:text-[#5D3A1A]"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => agregarAlCarrito(item)}
                    className="w-full bg-[#5D3A1A] text-white py-3 rounded-xl font-black hover:bg-[#8B4513] transition-all uppercase text-sm shadow-md active:scale-95"
                  >
                    Agregar 🪵
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carrito Desktop (Estático) */}
        <div className="hidden md:block w-80 bg-white border-l-2 border-[#E8D5B7] p-4 sticky top-16 h-[calc(100vh-64px)] overflow-hidden">
          <CarritoContent />
        </div>
      </div>

      {/* Botón flotante carrito Mobile */}
      <button
        onClick={() => setMostrarCarritoMobile(true)}
        className="md:hidden fixed bottom-4 right-4 bg-[#8B4513] text-white p-4 rounded-full shadow-xl flex items-center gap-2 z-40"
      >
        <ShoppingCart size={24} />
        {totalCarrito > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
            {totalCarrito}
          </span>
        )}
      </button>

      {/* Modal Carrito Mobile */}
      {mostrarCarritoMobile && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full max-h-[80vh] rounded-t-3xl p-4 animate-in slide-in-from-bottom">
            <button
              onClick={() => setMostrarCarritoMobile(false)}
              className="absolute top-4 right-4 text-[#8B6914]"
            >
              <X size={24} />
            </button>
            <div className="h-[70vh] overflow-y-auto">
              <CarritoContent />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;