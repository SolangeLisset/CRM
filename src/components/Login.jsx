import { LogIn } from "lucide-react";

export default function Login({ onLogin }) {
  function handleSubmit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    onLogin({
      name: data.name,
      email: data.email,
      role: data.role
    });
  }

  return (
    <main className="login-page">
      <section className="login-panel">
        <div className="brand login-brand">
          <div className="brand-mark">SC</div>
          <div>
            <strong>CRM Comercial</strong>
            <span>SolangeLisset</span>
          </div>
        </div>

        <div>
          <p className="eyebrow">Acceso demo</p>
          <h1>Gestiona tus ventas con claridad</h1>
          <p className="login-copy">Ingresa con un usuario simulado. La sesion se guarda en el navegador con localStorage.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            <span>Nombre</span>
            <input name="name" type="text" defaultValue="Solange Lisset" required />
          </label>
          <label>
            <span>Email</span>
            <input name="email" type="email" defaultValue="solange@crm.cl" required />
          </label>
          <label>
            <span>Rol</span>
            <select name="role" defaultValue="Administradora comercial">
              <option>Administradora comercial</option>
              <option>Ejecutiva de ventas</option>
              <option>Supervisora</option>
            </select>
          </label>
          <button className="primary-button" type="submit"><LogIn />Entrar al CRM</button>
        </form>
      </section>
    </main>
  );
}
