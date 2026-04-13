import { ShoppingBag, BookOpen, Package } from "lucide-react";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: "pedidos", label: "Pedidos", icon: <ShoppingBag size={20} /> },
    { id: "catalogo", label: "Catálogo", icon: <BookOpen size={20} /> },
    { id: "stock", label: "Gestión de Stock", icon: <Package size={20} /> },
  ];

  return (
    <aside className="w-full md:w-64 bg-[#1e293b] border-b border-slate-800 md:border-r md:border-b-0 p-6 flex flex-col md:min-h-screen">
      <div className="mb-10 px-2 text-center">
        <h2 className="text-cyan-400 font-black uppercase italic tracking-tighter text-xl">
          Leños <span className="text-white">Panel</span>
        </h2>
      </div>

      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all uppercase text-[11px] tracking-wider ${
              activeTab === item.id
                ? "bg-cyan-600 text-white shadow-lg shadow-cyan-900/40"
                : "text-slate-400 hover:bg-[#0f172a] hover:text-white"
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;