import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import clienteAxios from "../api/axios";
import { ShoppingCart, Plus, Minus, Trash2, X, ShoppingBag } from "lucide-react";

const Menu = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [mostrarCarritoMobile, setMostrarCarritoMobile] = useState(false);
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || "http://localhost:4000";

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

  const categorias = ["Todos", ...new Set(productos.map(p => p.categoria).filter(Boolean))];

  const productosFiltrados = categoriaActiva === "Todos" 
    ? productos 
    : productos.filter(p => p.categoria === categoriaActiva);

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
    <div 
      className="h-full flex flex-col"
      style={{ background: 'var(--bg-card)' }}
    >
      <div 
        className="p-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
          Tu Carrito
        </h3>
        <span 
          className="px-3 py-1 rounded-full text-sm font-bold"
          style={{ background: 'var(--accent)', color: 'white' }}
        >
          {totalCarrito}
        </span>
      </div>

      {carrito.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <ShoppingBag size={48} style={{ color: 'var(--text-muted)' }} />
          <p className="mt-4 font-medium" style={{ color: 'var(--text-muted)' }}>
            Tu carrito está vacío
          </p>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {carrito.map((item) => (
              <div 
                key={item._id}
                className="p-3 rounded-xl"
                style={{ background: 'var(--bg-secondary)' }}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                    {item.nombre}
                  </span>
                  <button
                    onClick={() => eliminarDelCarrito(item._id)}
                    style={{ color: 'var(--error)' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => actualizarCantidadCarrito(item._id, "restar")}
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: 'var(--bg-card)', color: 'var(--accent)' }}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                      {item.cantidad}
                    </span>
                    <button
                      onClick={() => actualizarCantidadCarrito(item._id, "sumar")}
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: 'var(--bg-card)', color: 'var(--accent)' }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="font-bold" style={{ color: 'var(--accent)' }}>
                    ${item.cantidad * item.precio}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold" style={{ color: 'var(--text-primary)' }}>Total:</span>
              <span className="text-2xl font-black" style={{ color: 'var(--accent)' }}>
                ${totalPrecio}
              </span>
            </div>

            {faltanLeños && (
              <div 
                className="p-3 rounded-xl text-center text-sm mb-4"
                style={{ background: 'var(--warning)', color: 'var(--text-primary)' }}
              >
                ⚠️ Mínimo 3 leños ({3 - totalCarrito} más)
              </div>
            )}

            <button
              onClick={handlePedir}
              disabled={faltanLeños}
              className="w-full py-4 rounded-xl font-bold text-white transition-all"
              style={{ 
                background: faltanLeños ? 'var(--text-muted)' : 'var(--gradient-fire)',
                opacity: faltanLeños ? 0.5 : 1
              }}
            >
              {faltanLeños ? `Faltan ${3 - totalCarrito} leños` : "🪵 Pedir Ahora"}
            </button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div 
        className="py-12 text-center"
        style={{ background: 'var(--gradient-wood)' }}
      >
        <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
          Menú Leños 🪵
        </h1>
        <p className="text-white/70">El sabor artesanal en tu mesa</p>
      </div>

      {/* Categorías */}
      <div 
        className="sticky top-0 z-30 py-4 px-4 overflow-x-auto"
        style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex gap-2 max-w-7xl mx-auto">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaActiva(cat)}
              className="px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all"
              style={{ 
                background: categoriaActiva === cat ? 'var(--accent)' : 'var(--bg-card)',
                color: categoriaActiva === cat ? 'white' : 'var(--text-secondary)',
                border: '1px solid var(--border)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="flex gap-6">
          {/* Productos */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {productosFiltrados.map((item) => (
                <div
                  key={item._id}
                  className="rounded-2xl overflow-hidden transition-all hover:scale-[1.02]"
                  style={{ 
                    background: 'var(--bg-card)',
                    boxShadow: 'var(--shadow)'
                  }}
                >
                  <div className="relative h-48 overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                    <img
                      src={`${BACKEND_URL}${item.imagenUrl}`}
                      alt={item.nombre}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x300?text=🪵";
                      }}
                    />
                    {item.categoria && (
                      <span 
                        className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold"
                        style={{ background: 'var(--accent)', color: 'white' }}
                      >
                        {item.categoria}
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 
                      className="font-bold text-lg mb-1"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {item.nombre}
                    </h3>
                    <p 
                      className="text-sm mb-3 line-clamp-2"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {item.descripcion || "Delicioso leño artesanal"}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <span 
                        className="text-2xl font-black"
                        style={{ color: 'var(--accent)' }}
                      >
                        ${item.precio}
                      </span>

                      <div 
                        className="flex items-center gap-3 px-3 py-1 rounded-xl"
                        style={{ background: 'var(--bg-secondary)' }}
                      >
                        <button
                          onClick={() => manejarCantidad(item._id, "menos")}
                          style={{ color: 'var(--accent)' }}
                        >
                          <Minus size={18} />
                        </button>
                        <span className="font-bold w-6 text-center" style={{ color: 'var(--text-primary)' }}>
                          {cantidades[item._id] || 1}
                        </span>
                        <button
                          onClick={() => manejarCantidad(item._id, "mas")}
                          style={{ color: 'var(--accent)' }}
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => agregarAlCarrito(item)}
                      className="w-full py-3 rounded-xl font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                      style={{ background: 'var(--gradient-fire)' }}
                    >
                      Agregar 🪵
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carrito Desktop */}
          <div 
            className="hidden md:block w-80 flex-shrink-0"
          >
            <div 
              className="sticky top-24 rounded-2xl overflow-hidden"
              style={{ 
                boxShadow: 'var(--shadow-lg)',
                maxHeight: 'calc(100vh - 120px)'
              }}
            >
              <CarritoContent />
            </div>
          </div>
        </div>
      </div>

      {/* Botón flotante Mobile */}
      <button
        onClick={() => setMostrarCarritoMobile(true)}
        className="md:hidden fixed bottom-6 right-6 p-4 rounded-2xl shadow-2xl flex items-center gap-2 z-40"
        style={{ background: 'var(--gradient-fire)' }}
      >
        <ShoppingCart size={24} color="white" />
        {totalCarrito > 0 && (
          <span className="bg-white text-sm font-black px-2 py-1 rounded-full" style={{ color: 'var(--accent)' }}>
            {totalCarrito}
          </span>
        )}
      </button>

      {/* Modal Carrito Mobile */}
      {mostrarCarritoMobile && (
        <div className="md:hidden fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setMostrarCarritoMobile(false)}
          />
          <div 
            className="absolute bottom-0 left-0 right-0 rounded-t-3xl overflow-hidden animate-fadeIn"
            style={{ maxHeight: '80vh' }}
          >
            <button
              onClick={() => setMostrarCarritoMobile(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full"
              style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
            >
              <X size={20} />
            </button>
            <CarritoContent />
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;