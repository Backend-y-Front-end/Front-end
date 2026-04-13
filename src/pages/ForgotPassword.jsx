import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import clienteAxios from "../api/axios";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: email, 2: código, 3: nueva contraseña
  const [correo, setCorreo] = useState("");
  const [codigo, setCodigo] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // PASO 1: Enviar código al correo
  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await clienteAxios.post("/api/users/olvide-password", {
        correo,
      });
      if (res.data.success) {
        setStep(2);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error al enviar el correo");
    } finally {
      setLoading(false);
    }
  };

  // PASO 2: Verificar código
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await clienteAxios.post("/api/users/verificar-codigo", {
        correo,
        codigo,
      });
      if (res.data.success) {
        setStep(3);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Código incorrecto");
    } finally {
      setLoading(false);
    }
  };

  // PASO 3: Actualizar contraseña
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
      const res = await clienteAxios.post("/api/users/reset-password", {
        correo,
        nuevaPassword,
      });
      if (res.data.success) {
        alert("¡Contraseña actualizada con éxito! 🔥");
        window.location.href = "/login";
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Error al actualizar contraseña",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-orange-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-t-8 border-orange-500 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* PASO 1: Ingresar correo */}
        {step === 1 && (
          <form onSubmit={handleSendCode} className="text-center">
            <div className="text-5xl mb-4 animate-bounce">📧</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Recuperar Contraseña
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Ingresa tu correo y te enviaremos un código de verificación
            </p>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm font-medium">
                {error}
              </div>
            )}

            <input
              type="email"
              placeholder="tu@correo.com"
              className="w-full p-3 border-2 rounded-xl mb-4 focus:border-orange-500 outline-none transition-all"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />

            <button
              disabled={loading}
              className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-orange-600 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : "ENVIAR CÓDIGO"}
            </button>
          </form>
        )}

        {/* PASO 2: Verificar código */}
        {step === 2 && (
          <form onSubmit={handleVerifyCode} className="text-center">
            <div className="text-5xl mb-4">🔐</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Verifica tu Código
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Ingresa el código de 6 dígitos enviado a <br />
              <span className="font-bold text-orange-600">{correo}</span>
            </p>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm font-medium">
                {error}
              </div>
            )}

            <input
              type="text"
              maxLength="6"
              placeholder="000000"
              className="w-full p-4 border-2 border-orange-200 rounded-xl mb-6 text-center text-3xl tracking-[10px] font-bold text-orange-600 focus:border-orange-500 outline-none transition-all"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ""))}
              required
            />

            <button
              disabled={loading || codigo.length !== 6}
              className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl mb-4 hover:bg-orange-700 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "VERIFICAR CÓDIGO"
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setError("");
                setCodigo("");
              }}
              className="text-gray-500 text-sm hover:text-orange-600 flex items-center justify-center gap-1 w-full"
            >
              <ArrowLeft size={16} />
              Cambiar correo
            </button>
          </form>
        )}

        {/* PASO 3: Nueva contraseña */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-green-500" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Crea tu Nueva Contraseña
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Tu código fue verificado correctamente
            </p>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm font-medium">
                {error}
              </div>
            )}

            {/* Campo Nueva Contraseña */}
            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nueva Contraseña"
                className="w-full p-3 border-2 rounded-xl focus:border-orange-500 outline-none transition-all pr-12"
                value={nuevaPassword}
                onChange={(e) => setNuevaPassword(e.target.value)}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-orange-500 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <input
              type="password"
              placeholder="Confirmar Contraseña"
              className="w-full p-3 border-2 rounded-xl mb-6 focus:border-orange-500 outline-none transition-all"
              value={confirmarPassword}
              onChange={(e) => setConfirmarPassword(e.target.value)}
              required
            />

            <button
              disabled={loading}
              className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-orange-700 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "ACTUALIZAR CONTRASEÑA"
              )}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-orange-600 font-bold hover:text-orange-800 transition-colors"
          >
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
