import { useState, useEffect } from "react";

// ─── Simulated "DB" in memory ───────────────────────────────────────────────
const DB = {
  users: [], // { id, nombre, email, password, credits, plan }
};

const PLANS = [
  { id: "starter", name: "Starter", credits: 5, price: "$4.99 USD", color: "#6ee7b7", desc: "Ideal para probar" },
  { id: "pro", name: "Pro", credits: 15, price: "$11.99 USD", color: "#c8a050", desc: "El más popular", popular: true },
  { id: "agency", name: "Agencia", credits: 40, price: "$24.99 USD", color: "#a78bfa", desc: "Para equipos" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 10);

// ─── Styles ──────────────────────────────────────────────────────────────────
const G = {
  bg: "#08070a",
  surface: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.09)",
  text: "#ede9e0",
  muted: "#7a7468",
  accent: "#c8a050",
  accentDark: "#7a5520",
  error: "#f87171",
  success: "#6ee7b7",
};

const css = {
  page: {
    minHeight: "100vh", background: G.bg, color: G.text,
    fontFamily: "'Sora', 'DM Sans', sans-serif",
    position: "relative", overflow: "hidden",
  },
  glow: {
    position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
    background: `
      radial-gradient(ellipse 70% 50% at 15% 0%, rgba(200,160,80,0.08) 0%, transparent 55%),
      radial-gradient(ellipse 50% 40% at 85% 100%, rgba(167,139,250,0.06) 0%, transparent 55%)
    `,
  },
  center: {
    position: "relative", zIndex: 1,
    display: "flex", alignItems: "center", justifyContent: "center",
    minHeight: "100vh", padding: "24px",
  },
  card: {
    background: "rgba(255,255,255,0.03)",
    border: `1px solid ${G.border}`,
    borderRadius: "20px",
    padding: "36px 32px",
    width: "100%", maxWidth: "420px",
    boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
  },
  input: {
    width: "100%", boxSizing: "border-box",
    background: "rgba(255,255,255,0.05)",
    border: `1px solid ${G.border}`,
    borderRadius: "10px",
    padding: "12px 14px",
    color: G.text, fontSize: "14px",
    fontFamily: "inherit", outline: "none",
    transition: "border 0.2s",
    marginBottom: "14px",
  },
  label: {
    display: "block", fontSize: "11px", fontWeight: "600",
    letterSpacing: "0.08em", textTransform: "uppercase",
    color: G.muted, marginBottom: "6px",
  },
  btn: (variant = "primary") => ({
    width: "100%", padding: "13px",
    background: variant === "primary"
      ? `linear-gradient(135deg, ${G.accent}, ${G.accentDark})`
      : "rgba(255,255,255,0.06)",
    border: variant === "primary" ? "none" : `1px solid ${G.border}`,
    borderRadius: "10px",
    color: variant === "primary" ? "#08070a" : G.text,
    fontSize: "14px", fontWeight: "700",
    cursor: "pointer", letterSpacing: "0.01em",
    fontFamily: "inherit",
    transition: "opacity 0.15s, transform 0.1s",
  }),
  link: {
    color: G.accent, background: "none", border: "none",
    cursor: "pointer", fontSize: "13px", fontFamily: "inherit",
    textDecoration: "underline", padding: 0,
  },
};

// ─── Logo ─────────────────────────────────────────────────────────────────────
function Logo({ size = 22 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div style={{
        width: size + 8, height: size + 8,
        background: `linear-gradient(135deg, ${G.accent}, ${G.accentDark})`,
        borderRadius: "7px",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.65, fontWeight: "900",
      }}>P</div>
      <span style={{ fontSize: size, fontWeight: "800", letterSpacing: "-0.04em" }}>
        Propel<span style={{ color: G.accent }}>IA</span>
      </span>
    </div>
  );
}

// ─── Input field ──────────────────────────────────────────────────────────────
function Field({ label, name, value, onChange, type = "text", placeholder }) {
  return (
    <div>
      <label style={css.label}>{label}</label>
      <input
        type={type} name={name} value={value} onChange={onChange}
        placeholder={placeholder} style={css.input}
        onFocus={e => e.target.style.borderColor = G.accent}
        onBlur={e => e.target.style.borderColor = G.border}
      />
    </div>
  );
}

// ─── LANDING ─────────────────────────────────────────────────────────────────
function Landing({ onGoAuth }) {
  const features = [
    { icon: "⚡", title: "En segundos", desc: "Genera propuestas profesionales con IA en menos de 30 segundos." },
    { icon: "✦", title: "Personalizada", desc: "Cada propuesta es única, adaptada a tu cliente y producto." },
    { icon: "📋", title: "Lista para enviar", desc: "Cópiala y pégala directamente en tu correo o Word." },
  ];

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      {/* Nav */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 40px", borderBottom: `1px solid ${G.border}`,
      }}>
        <Logo />
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => onGoAuth("login")} style={{ ...css.btn("secondary"), width: "auto", padding: "9px 20px", fontSize: "13px" }}>
            Iniciar sesión
          </button>
          <button onClick={() => onGoAuth("register")} style={{ ...css.btn("primary"), width: "auto", padding: "9px 20px", fontSize: "13px" }}>
            Empezar gratis
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "80px 32px 60px", textAlign: "center" }}>
        <div style={{
          display: "inline-block", padding: "5px 14px",
          background: "rgba(200,160,80,0.1)", border: `1px solid rgba(200,160,80,0.25)`,
          borderRadius: "20px", fontSize: "12px", color: G.accent,
          fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase",
          marginBottom: "24px",
        }}>
          ✦ Impulsado por Inteligencia Artificial
        </div>

        <h1 style={{
          fontSize: "clamp(36px, 6vw, 60px)", fontWeight: "800",
          lineHeight: "1.1", letterSpacing: "-0.04em",
          margin: "0 0 20px",
        }}>
          Propuestas que<br />
          <span style={{
            background: `linear-gradient(90deg, ${G.accent}, #e8c878)`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>cierran ventas.</span>
        </h1>

        <p style={{ fontSize: "17px", color: G.muted, lineHeight: "1.7", maxWidth: "520px", margin: "0 auto 36px" }}>
          Genera propuestas comerciales profesionales en segundos. Solo ingresa los datos, la IA hace el resto.
        </p>

        <button onClick={() => onGoAuth("register")} style={{ ...css.btn(), width: "auto", padding: "14px 36px", fontSize: "15px" }}>
          Crear mi primera propuesta →
        </button>

        <p style={{ marginTop: "12px", fontSize: "12px", color: G.muted }}>3 propuestas gratis al registrarte. Sin tarjeta.</p>
      </div>

      {/* Features */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "16px", maxWidth: "760px", margin: "0 auto", padding: "0 32px 80px",
      }}>
        {features.map((f, i) => (
          <div key={i} style={{
            background: G.surface, border: `1px solid ${G.border}`,
            borderRadius: "14px", padding: "24px",
          }}>
            <div style={{ fontSize: "24px", marginBottom: "10px" }}>{f.icon}</div>
            <div style={{ fontWeight: "700", marginBottom: "6px", fontSize: "15px" }}>{f.title}</div>
            <div style={{ fontSize: "13px", color: G.muted, lineHeight: "1.6" }}>{f.desc}</div>
          </div>
        ))}
      </div>

      {/* Pricing */}
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "0 32px 80px", textAlign: "center" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "800", letterSpacing: "-0.03em", marginBottom: "8px" }}>Precios simples</h2>
        <p style={{ color: G.muted, fontSize: "14px", marginBottom: "32px" }}>Paga solo lo que usas. Sin suscripciones forzadas.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          {PLANS.map(p => (
            <div key={p.id} style={{
              background: p.popular ? "rgba(200,160,80,0.07)" : G.surface,
              border: `1px solid ${p.popular ? "rgba(200,160,80,0.35)" : G.border}`,
              borderRadius: "14px", padding: "24px",
              position: "relative",
            }}>
              {p.popular && (
                <div style={{
                  position: "absolute", top: "-11px", left: "50%", transform: "translateX(-50%)",
                  background: `linear-gradient(135deg, ${G.accent}, ${G.accentDark})`,
                  color: "#08070a", fontSize: "10px", fontWeight: "700",
                  padding: "3px 12px", borderRadius: "20px", letterSpacing: "0.06em",
                  textTransform: "uppercase", whiteSpace: "nowrap",
                }}>Más popular</div>
              )}
              <div style={{ color: p.color, fontWeight: "800", fontSize: "17px", marginBottom: "4px" }}>{p.name}</div>
              <div style={{ fontSize: "24px", fontWeight: "800", marginBottom: "4px" }}>{p.price}</div>
              <div style={{ color: G.muted, fontSize: "13px", marginBottom: "12px" }}>{p.credits} propuestas</div>
              <div style={{ fontSize: "12px", color: G.muted }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
function Auth({ mode, onSwitch, onAuth }) {
  const isLogin = mode === "login";
  const [form, setForm] = useState({ nombre: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = () => {
    setError("");
    if (!form.email || !form.password) return setError("Completa todos los campos.");
    if (!isLogin && !form.nombre) return setError("Ingresa tu nombre.");

    setLoading(true);
    setTimeout(() => {
      if (isLogin) {
        const user = DB.users.find(u => u.email === form.email && u.password === form.password);
        if (!user) { setError("Correo o contraseña incorrectos."); setLoading(false); return; }
        onAuth(user);
      } else {
        if (DB.users.find(u => u.email === form.email)) {
          setError("Este correo ya está registrado."); setLoading(false); return;
        }
        const user = { id: uid(), nombre: form.nombre, email: form.email, password: form.password, credits: 3, plan: null };
        DB.users.push(user);
        onAuth(user);
      }
      setLoading(false);
    }, 700);
  };

  return (
    <div style={css.center}>
      <div style={{ ...css.card, animation: "fadeUp 0.35s ease both" }}>
        <style>{`
          @keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:none } }
          @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');
        `}</style>

        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <Logo />
          <h2 style={{ fontSize: "20px", fontWeight: "700", marginTop: "20px", marginBottom: "6px", letterSpacing: "-0.02em" }}>
            {isLogin ? "Bienvenido de vuelta" : "Crea tu cuenta gratis"}
          </h2>
          <p style={{ color: G.muted, fontSize: "13px", margin: 0 }}>
            {isLogin ? "Accede a tu cuenta para continuar." : "3 propuestas gratis al registrarte."}
          </p>
        </div>

        {!isLogin && <Field label="Nombre" name="nombre" value={form.nombre} onChange={handle} placeholder="Tu nombre" />}
        <Field label="Correo electrónico" name="email" type="email" value={form.email} onChange={handle} placeholder="tu@email.com" />
        <Field label="Contraseña" name="password" type="password" value={form.password} onChange={handle} placeholder="••••••••" />

        {error && <div style={{ color: G.error, fontSize: "12px", marginBottom: "12px", textAlign: "center" }}>{error}</div>}

        <button onClick={submit} disabled={loading} style={{ ...css.btn(), opacity: loading ? 0.6 : 1 }}>
          {loading ? "..." : isLogin ? "Iniciar sesión" : "Crear cuenta →"}
        </button>

        <p style={{ textAlign: "center", marginTop: "18px", fontSize: "13px", color: G.muted }}>
          {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
          <button onClick={() => onSwitch(isLogin ? "register" : "login")} style={css.link}>
            {isLogin ? "Regístrate" : "Inicia sesión"}
          </button>
        </p>
      </div>
    </div>
  );
}

// ─── PLANS / CHECKOUT ─────────────────────────────────────────────────────────
function Plans({ user, onBuy, onBack }) {
  const [selected, setSelected] = useState(null);
  const [paying, setPaying] = useState(false);
  const [done, setDone] = useState(false);

  const buy = () => {
    if (!selected) return;
    setPaying(true);
    setTimeout(() => {
      onBuy(selected);
      setDone(true);
      setPaying(false);
    }, 1200);
  };

  if (done) return (
    <div style={css.center}>
      <div style={{ ...css.card, textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎉</div>
        <h2 style={{ fontSize: "22px", fontWeight: "800", marginBottom: "8px" }}>¡Créditos agregados!</h2>
        <p style={{ color: G.muted, fontSize: "14px", marginBottom: "24px" }}>
          Tu cuenta ahora tiene <strong style={{ color: G.accent }}>{user.credits} créditos</strong> disponibles.
        </p>
        <button onClick={onBack} style={css.btn()}>Ir a generar propuestas →</button>
      </div>
    </div>
  );

  return (
    <div style={{ ...css.center, alignItems: "flex-start", paddingTop: "48px" }}>
      <div style={{ width: "100%", maxWidth: "660px" }}>
        <div style={{ marginBottom: "32px" }}>
          <button onClick={onBack} style={{ ...css.link, marginBottom: "16px", display: "inline-block" }}>← Volver</button>
          <h2 style={{ fontSize: "26px", fontWeight: "800", letterSpacing: "-0.03em", margin: "0 0 8px" }}>Recargar créditos</h2>
          <p style={{ color: G.muted, fontSize: "14px" }}>Selecciona el paquete que mejor se adapte a tus necesidades.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px", marginBottom: "28px" }}>
          {PLANS.map(p => (
            <div key={p.id} onClick={() => setSelected(p)} style={{
              background: selected?.id === p.id ? "rgba(200,160,80,0.1)" : G.surface,
              border: `2px solid ${selected?.id === p.id ? G.accent : G.border}`,
              borderRadius: "14px", padding: "22px", cursor: "pointer",
              transition: "all 0.15s", position: "relative",
            }}>
              {p.popular && (
                <div style={{
                  position: "absolute", top: "-10px", left: "16px",
                  background: `linear-gradient(135deg, ${G.accent}, ${G.accentDark})`,
                  color: "#08070a", fontSize: "9px", fontWeight: "700",
                  padding: "2px 10px", borderRadius: "20px", letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}>Popular</div>
              )}
              <div style={{ color: p.color, fontWeight: "700", fontSize: "15px", marginBottom: "4px" }}>{p.name}</div>
              <div style={{ fontSize: "22px", fontWeight: "800", marginBottom: "2px" }}>{p.price}</div>
              <div style={{ color: G.muted, fontSize: "13px" }}>{p.credits} propuestas</div>
            </div>
          ))}
        </div>

        {/* Simulated card form */}
        <div style={{
          background: G.surface, border: `1px solid ${G.border}`,
          borderRadius: "14px", padding: "24px", marginBottom: "20px",
        }}>
          <p style={{ ...css.label, marginBottom: "16px" }}>Datos de pago (simulado)</p>
          <Field label="Número de tarjeta" name="card" value="4242 4242 4242 4242" onChange={() => {}} placeholder="1234 5678 9012 3456" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <Field label="Vencimiento" name="exp" value="12/28" onChange={() => {}} placeholder="MM/AA" />
            <Field label="CVV" name="cvv" value="123" onChange={() => {}} placeholder="•••" />
          </div>
          <p style={{ color: G.muted, fontSize: "11px", margin: "4px 0 0" }}>
            🔒 Esto es una demo. En producción conectarías Stripe o MercadoPago.
          </p>
        </div>

        <button onClick={buy} disabled={!selected || paying} style={{ ...css.btn(), opacity: (!selected || paying) ? 0.5 : 1 }}>
          {paying ? "Procesando pago..." : selected ? `Pagar ${selected.price} — ${selected.credits} créditos` : "Selecciona un plan primero"}
        </button>
      </div>
    </div>
  );
}

// ─── DASHBOARD / APP ─────────────────────────────────────────────────────────
function Dashboard({ user, setUser, onLogout }) {
  const [view, setView] = useState("form"); // form | generating | result | plans
  const [proposal, setProposal] = useState("");
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({
    miEmpresa: "", miGiro: "", clienteNombre: "", clienteEmpresa: "",
    producto: "", precio: "", beneficios: "", vigencia: "",
  });

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const isValid = form.miEmpresa && form.clienteNombre && form.producto && form.precio;

  const generate = async () => {
    if (user.credits <= 0) return setView("plans");
    setView("generating");
    try {
      const prompt = `Eres un experto en ventas B2B. Crea una propuesta comercial profesional y persuasiva en español con este formato exacto:

---
PROPUESTA COMERCIAL
${form.miEmpresa}
---

Para: ${form.clienteNombre}${form.clienteEmpresa ? ` — ${form.clienteEmpresa}` : ""}
Vigencia: ${form.vigencia || "15 días"}

## Introducción
[Párrafo profesional y cálido]

## Lo que ofrecemos
[Descripción atractiva de: ${form.producto}]

## Beneficios para su negocio
[Lista de beneficios basada en: ${form.beneficios || "el producto descrito"}]

## Inversión
[Presenta ${form.precio} como inversión inteligente, no como costo]

## Próximos pasos
[CTA claro y amigable]

---
*${form.miEmpresa} — Comprometidos con su éxito*

Genera la propuesta completa. Sin texto introductorio. Solo la propuesta.`;

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-3-haiku-20240307",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      console.log("Respuesta API:", JSON.stringify(data));
const text = data.content?.map(b => b.text || "").join("") || "";
      if (!text) throw new Error();
      setProposal(text);
      const updated = { ...user, credits: user.credits - 1 };
      setUser(updated);
      const idx = DB.users.findIndex(u => u.id === user.id);
      if (idx > -1) DB.users[idx].credits = updated.credits;
      setView("result");
    } catch {
      setView("form");
      alert("Error al generar. Intenta de nuevo.");
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(proposal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (view === "plans") return (
    <Plans user={user} onBack={() => setView("form")} onBuy={(plan) => {
      const updated = { ...user, credits: user.credits + plan.credits, plan: plan.id };
      setUser(updated);
      const idx = DB.users.findIndex(u => u.id === user.id);
      if (idx > -1) { DB.users[idx].credits = updated.credits; DB.users[idx].plan = plan.id; }
    }} />
  );

  return (
    <div style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');`}</style>

      {/* Header */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 32px", height: "60px",
        borderBottom: `1px solid ${G.border}`,
      }}>
        <Logo size={18} />
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
            background: G.surface, border: `1px solid ${G.border}`,
            borderRadius: "20px", padding: "5px 14px",
            fontSize: "13px",
          }}>
            <span style={{ color: user.credits > 0 ? G.accent : G.error }}>●</span>
            <span style={{ color: G.muted }}>{user.credits} crédito{user.credits !== 1 ? "s" : ""}</span>
          </div>
          <button onClick={() => setView("plans")} style={{ ...css.btn("secondary"), width: "auto", padding: "7px 16px", fontSize: "12px" }}>
            + Recargar
          </button>
          <div style={{
            width: "32px", height: "32px", borderRadius: "50%",
            background: `linear-gradient(135deg, ${G.accent}, ${G.accentDark})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "13px", fontWeight: "700", color: "#08070a",
            cursor: "pointer", position: "relative",
          }} title={`${user.nombre} — ${user.email}`}>
            {user.nombre.charAt(0).toUpperCase()}
          </div>
          <button onClick={onLogout} style={{ ...css.link, fontSize: "12px" }}>Salir</button>
        </div>
      </header>

      <main style={{ maxWidth: "660px", margin: "0 auto", padding: "40px 24px" }}>

        {view === "form" && (
          <>
            <div style={{ marginBottom: "32px" }}>
              <h1 style={{ fontSize: "26px", fontWeight: "800", letterSpacing: "-0.03em", margin: "0 0 8px" }}>
                Hola, {user.nombre.split(" ")[0]} 👋
              </h1>
              <p style={{ color: G.muted, fontSize: "14px", margin: 0 }}>
                Completa los datos y genera tu propuesta en segundos.
              </p>
            </div>

            {[
              { title: "Tu empresa", fields: [
                { label: "Tu nombre / empresa *", name: "miEmpresa", placeholder: "Ej. Juan López / Tech Solutions" },
                { label: "Tu giro o sector", name: "miGiro", placeholder: "Ej. Software, Marketing..." },
              ]},
              { title: "El cliente", fields: [
                { label: "Nombre del cliente *", name: "clienteNombre", placeholder: "Ej. María González" },
                { label: "Empresa del cliente", name: "clienteEmpresa", placeholder: "Ej. Grupo Comercial XYZ" },
              ]},
              { title: "La propuesta", fields: [
                { label: "Producto o servicio *", name: "producto", placeholder: "Ej. Desarrollo de sitio web corporativo" },
                { label: "Precio *", name: "precio", placeholder: "Ej. $8,500 MXN / $450 USD" },
                { label: "Vigencia", name: "vigencia", placeholder: "Ej. 30 días" },
                { label: "Beneficios clave", name: "beneficios", placeholder: "Ej. Entrega en 2 semanas, soporte incluido..." },
              ]},
            ].map((section, si) => (
              <div key={si} style={{
                background: G.surface, border: `1px solid ${G.border}`,
                borderRadius: "14px", padding: "24px", marginBottom: "16px",
              }}>
                <p style={{ ...css.label, color: G.accent, marginBottom: "18px", marginTop: 0 }}>{section.title}</p>
                <div style={{ display: "grid", gridTemplateColumns: section.fields.length === 2 ? "1fr 1fr" : "1fr", gap: "0 16px" }}>
                  {section.fields.map(f => (
                    <Field key={f.name} {...f} value={form[f.name]} onChange={handle} />
                  ))}
                </div>
              </div>
            ))}

            {user.credits <= 0 && (
              <div style={{
                background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)",
                borderRadius: "12px", padding: "14px 18px", marginBottom: "16px",
                fontSize: "13px", color: G.error, display: "flex", alignItems: "center", gap: "10px",
              }}>
                <span>⚠️</span>
                <span>Sin créditos. <button onClick={() => setView("plans")} style={{ ...css.link, color: G.error }}>Recarga aquí</button> para continuar.</span>
              </div>
            )}

            <button onClick={generate} disabled={!isValid || user.credits <= 0} style={{
              ...css.btn(), opacity: (!isValid || user.credits <= 0) ? 0.4 : 1,
              cursor: (!isValid || user.credits <= 0) ? "not-allowed" : "pointer",
            }}>
              ✦ Generar propuesta ({user.credits} crédito{user.credits !== 1 ? "s" : ""})
            </button>
          </>
        )}

        {view === "generating" && (
          <div style={{ textAlign: "center", padding: "100px 0" }}>
            <div style={{
              width: "52px", height: "52px", margin: "0 auto 24px",
              border: `3px solid rgba(200,160,80,0.15)`,
              borderTop: `3px solid ${G.accent}`,
              borderRadius: "50%",
              animation: "spin 0.9s linear infinite",
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>Generando tu propuesta...</h2>
            <p style={{ color: G.muted, fontSize: "14px" }}>La IA está redactando algo especial para ti.</p>
          </div>
        )}

        {view === "result" && (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <p style={{ fontSize: "11px", fontWeight: "700", color: G.success, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px" }}>✓ Lista para enviar</p>
                <h2 style={{ fontSize: "22px", fontWeight: "800", margin: 0, letterSpacing: "-0.02em" }}>Tu propuesta comercial</h2>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={copy} style={{
                  ...css.btn("secondary"), width: "auto", padding: "9px 16px", fontSize: "13px",
                  color: copied ? G.success : G.text,
                  borderColor: copied ? G.success : G.border,
                }}>
                  {copied ? "✓ Copiado" : "Copiar"}
                </button>
                <button onClick={() => { setView("form"); setProposal(""); }} style={{ ...css.btn(), width: "auto", padding: "9px 16px", fontSize: "13px" }}>
                  + Nueva
                </button>
              </div>
            </div>

            <div style={{
              background: G.surface, border: `1px solid ${G.border}`,
              borderRadius: "14px", padding: "28px",
              whiteSpace: "pre-wrap", lineHeight: "1.8", fontSize: "14px",
              color: "#ddd8ce", fontFamily: "inherit",
            }}>
              {proposal}
            </div>

            <div style={{
              marginTop: "14px", padding: "14px 18px",
              background: "rgba(200,160,80,0.06)", border: `1px solid rgba(200,160,80,0.18)`,
              borderRadius: "12px", fontSize: "13px", color: G.muted,
              display: "flex", gap: "10px", alignItems: "center",
            }}>
              <span>💡</span>
              <span>Pega este texto en Word, Google Docs o envíalo por correo directamente.</span>
            </div>
          </>
        )}

      </main>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("landing"); // landing | login | register | app
  const [user, setUser] = useState(null);

  return (
    <div style={css.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        input::placeholder, textarea::placeholder { color: #4a4640; }
      `}</style>
      <div style={css.glow} />

      {screen === "landing" && (
        <Landing onGoAuth={(mode) => setScreen(mode)} />
      )}
      {(screen === "login" || screen === "register") && (
        <Auth
          mode={screen}
          onSwitch={setScreen}
          onAuth={(u) => { setUser(u); setScreen("app"); }}
        />
      )}
      {screen === "app" && user && (
        <Dashboard
          user={user}
          setUser={setUser}
          onLogout={() => { setUser(null); setScreen("landing"); }}
        />
      )}
    </div>
  );
}
