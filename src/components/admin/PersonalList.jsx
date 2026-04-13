import { Trash2, ShieldCheck, Loader2 } from "lucide-react";
import clienteAxios from "../../api/axios";
import { useEffect, useState } from "react";

const PersonalList = ({ reload }) => {
  const [personal, setPersonal] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPersonal = async () => {
    try {
      setLoading(true);
      const res = await clienteAxios.get("/api/users/personal");
      const admins = res.data.filter((user) => user.rol === "admin");
      setPersonal(admins);
    } catch (error) {
      console.error("Error al cargar personal:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonal();
  }, [reload]);

  const eliminarPersonal = async (id, nombre) => {
    const confirmar = window.confirm(
      `¿Estás seguro de quitar a "${nombre}" del equipo?`,
    );
    if (!confirmar) return;

    try {
      await clienteAxios.delete(`/api/users/${id}`);
      alert("Administrador eliminado 🪵");
      fetchPersonal();
    } catch (error) {
      console.error(error);
      alert("Error al eliminar: Verifica tus permisos de administrador.");
    }
  };

  return (
    <div className="bg-[#1e293b] p-8 rounded-3xl border border-slate-800 shadow-2xl w-full animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-black uppercase italic text-white tracking-tighter">
            Administradores <span className="text-cyan-400">Registrados</span>
          </h2>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[3px] mt-1">
            Equipo de administración activo
          </p>
        </div>

        <div className="bg-[#0f172a] px-6 py-2 rounded-2xl border border-slate-800 flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-purple-600 border-2 border-[#0f172a]"></div>
          <span className="text-white font-black text-sm uppercase">
            {personal.length} Admins
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-500">
            <Loader2 className="animate-spin mb-4 text-cyan-400" size={40} />
            <span className="text-xs font-black uppercase tracking-widest">
              Sincronizando base de datos...
            </span>
          </div>
        ) : personal.length === 0 ? (
          <div className="text-center py-24 bg-[#0f172a]/50 rounded-3xl border-2 border-dashed border-slate-800">
            <p className="text-slate-500 text-sm font-bold uppercase italic">
              No hay administradores adicionales registrados
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {personal.map((staff) => (
              <div
                key={staff._id}
                className="bg-[#0f172a] p-5 rounded-2xl border border-slate-800 flex items-center justify-between group hover:border-cyan-500/40 hover:bg-[#161e31] transition-all duration-300 shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 bg-purple-500/10 text-purple-500">
                    <ShieldCheck size={24} />
                  </div>

                  <div>
                    <h3 className="font-black text-sm text-white uppercase tracking-tight">
                      {staff.nombre}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-bold">
                      {staff.telefono}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="hidden sm:block text-[9px] px-3 py-1 rounded-full font-black uppercase border bg-purple-500/5 text-purple-400 border-purple-500/20">
                    ADMIN
                  </span>

                  <button
                    onClick={() => eliminarPersonal(staff._id, staff.nombre)}
                    className="text-slate-600 hover:text-red-500 hover:bg-red-500/10 p-2.5 rounded-xl transition-all active:scale-90"
                    title="Eliminar del equipo"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-800/50 flex justify-center">
        <p className="text-[10px] text-slate-600 font-black uppercase tracking-[4px]">
          Leños Rellenos • Sistema de Gestión
        </p>
      </div>
    </div>
  );
};

export default PersonalList;