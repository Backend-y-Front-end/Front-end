import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, ArrowLeft, CheckCircle, Mail, KeyRound, Lock } from "lucide-react";
import clienteAxios from "../api/axios";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [correo, setCorreo] = useState("");
  const [codigo, setCodigo] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputStyle = {
    background: 'var(--bg-input)',
    border: '2px solid var(--border)',
    color: 'var(--text-primary)'
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await clienteAxios.post("/api/users/olvide-password", { correo });
      if (res.data.success) setStep(2);
    } catch (error) {
      setError(error.response?.data?.message || "Error al enviar el correo");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await clienteAxios.post("/api/users/verificar-codigo", { correo, codigo });
      if (res.data.success) setStep(3);
    } catch (error) {
      setError(error.response?.data?.message || "Código incorrecto");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (nuevaPassword !== confirmarPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (nuevaPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      const res = await clienteAxios.post("/api/users/reset-password", { correo, nuevaPassword });
      if (res.data.success) {
        alert("¡Contraseña actualizada con éxito! 🔥");
        window.location.href = "/login";
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error al actualizar contraseña");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, icon: Mail, label: "Correo" },
    { num: 2, icon: KeyRound, label: "Código" },
    { num: 3, icon: Lock, label: "Nueva" }
  ];

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div 
        className="w-full max-w-md rounded-2xl overflow-hidden animate-fadeIn"
        style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow-lg)' }}
      >
        {/* Progress */}
        <div 
          className="p-6"
          style={{ background: 'var(--gradient-wood)' }}
        >
          <div className="flex justify-between items-center">
            {steps.map((s, i) => (
              <div key={s.num} className="flex items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= s.num ? 'text-white' : 'text-white/40'}`}
                  style={{ background: step >= s.num ? 'var(--accent)' : 'rgba(255,255,255,0.2)' }}
                >
                  <s.icon size={18} />
                </div>
                {i < steps.length - 1 && (
                  <div 
                    className="w-12 h-1 mx-2 rounded"
                    style={{ background: step > s.num ? 'var(--accent)' : 'rgba(255,255,255,0.2)' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-8">
          {/* PASO 1 */}
          {step === 1 && (
            <form onSubmit={handleSendCode} className="space-y-6">
              <div className="text-center">
                <div className="text-5xl mb-4">📧</div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Recuperar Contraseña
                </h2>
                <p style={{ color: 'var(--text-muted)' }}>
                  Ingresa tu correo y te enviaremos un código
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-xl text-center" style={{ background: 'var(--error)', color: 'white' }}>
                  {error}
                </div>
              )}

              <input
                type="email"
                placeholder="tu@correo.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl outline-none"
                style={inputStyle}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2"
                style={{ background: 'var(--gradient-fire)' }}
              >
                {loading ? <Loader2 className="animate-spin" /> : "ENVIAR CÓDIGO"}
              </button>
            </form>
          )}

          {/* PASO 2 */}
          {step === 2 && (
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div className="text-center">
                <div className="text-5xl mb-4">🔐</div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Verifica tu Código
                </h2>
                <p style={{ color: 'var(--text-muted)' }}>
                  Código enviado a <strong style={{ color: 'var(--accent)' }}>{correo}</strong>
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-xl text-center" style={{ background: 'var(--error)', color: 'white' }}>
                  {error}
                </div>
              )}

              <input
                type="text"
                placeholder="Código de 6 dígitos"
                maxLength={6}
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ""))}
                required
                className="w-full px-4 py-3 rounded-xl outline-none text-center text-2xl tracking-widest"
                style={inputStyle}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2"
                style={{ background: 'var(--gradient-fire)' }}
              >
                {loading ? <Loader2 className="animate-spin" /> : "VERIFICAR"}
              </button>

              <button
                type="button"
                onClick={() => { setStep(1); setError(""); setCodigo(""); }}
                className="w-full text-center font-medium flex items-center justify-center gap-2"
                style={{ color: 'var(--text-muted)' }}
              >
                <ArrowLeft size={16} />
                Cambiar correo
              </button>
            </form>
          )}

          {/* PASO 3 */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="text-center">
                <CheckCircle size={48} className="mx-auto mb-4" style={{ color: 'var(--success)' }} />
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Nueva Contraseña
                </h2>
                <p style={{ color: 'var(--text-muted)' }}>
                  Código verificado correctamente
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-xl text-center" style={{ background: 'var(--error)', color: 'white' }}>
                  {error}
                </div>
              )}

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Nueva contraseña"
                  value={nuevaPassword}
                  onChange={(e) => setNuevaPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 rounded-xl outline-none pr-12"
                  style={inputStyle}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <input
                type="password"
                placeholder="Confirmar contraseña"
                value={confirmarPassword}
                onChange={(e) => setConfirmarPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl outline-none"
                style={inputStyle}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2"
                style={{ background: 'var(--gradient-fire)' }}
              >
                {loading ? <Loader2 className="animate-spin" /> : "ACTUALIZAR CONTRASEÑA"}
              </button>
            </form>
          )}

          <Link 
            to="/login" 
            className="block text-center mt-6 font-medium"
            style={{ color: 'var(--accent)' }}
          >
            ← Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;