
// src/components/layout/navbar.jsx
import { useState, useEffect } from "react";
import { Bell, LogOut, Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";


function Navbar() {
  const [userMenu, setUserMenu] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      // Obtener solo el nombre del email (antes del @)
      const emailName = user.email ? user.email.split('@')[0] : '';
      setUserName(emailName);

      // Formatear rol para mostrar (primera letra mayúscula)
      const formattedRole = user.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : '';
      setUserRole(formattedRole);
    }
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md fixed top-0 right-0 left-0 z-10">
      <div className="flex justify-between items-center px-4 py-3">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-800">
            Sistema de Gestión
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notificaciones */}
          <button className="relative p-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-full transition-colors">
            <Bell size={20} />
            <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
          </button>

          {/* Menú de usuario */}
          <div className="relative">
            <button
              onClick={() => setUserMenu(!userMenu)}
              className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-expanded={userMenu}
              aria-haspopup="true"
            >
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-medium">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-700">{userName}</p>
                <p className="text-xs text-gray-500">{userRole}</p>
              </div>
            </button>

            {/* Menú desplegable */}
            {userMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-200">
                <button
                  onClick={() => {
                    setUserMenu(false);
                    navigate("/perfil");
                  } }
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 w-full text-left"
                >
                  <User size={16} className="mr-2" />
                  Mi Perfil
                </button>
                <button
                  onClick={() => {
                    setUserMenu(false);
                    navigate("/configuracion");
                  } }
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 w-full text-left"
                >
                  <Settings size={16} className="mr-2" />
                  Configuración
                </button>
                <hr className="my-1 border-gray-200" />
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                  data-testid="logout-button"
                >
                  <LogOut size={16} className="mr-2" />
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;