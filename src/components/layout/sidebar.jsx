"use client"
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  Settings,
  User,
  Tag,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { useSidebar } from "./sidebarUtils" 

const Sidebar = () => {
  const { isExpanded, toggleExpand } = useSidebar()
  const location = useLocation()

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, text: "Dashboard", to: "/dashboard" },
    { icon: <User size={20} />, text: "Usuario", to: "/usuario" },
    { icon: <Users size={20} />, text: "Clientes", to: "/clientes" },
    { icon: <Tag size={20} />, text: "Categoría", to: "/categoria" },
    { icon: <Package size={20} />, text: "Productos", to: "/productos" },
    { icon: <ShoppingCart size={20} />, text: "Ventas", to: "/ventas" },
    { icon: <Package size={20} />, text: "Pedidos", to: "/pedidos" },
    { icon: <Settings size={20} />, text: "Configuración", to: "/configuracion" },
  ]

  return (
    <aside
      className={`
                fixed top-0 left-0 z-50 h-full 
                bg-gray-900 text-white 
                shadow-2xl border-r-2 border-orange-500 
                transition-all duration-300
                ${isExpanded ? "w-64" : "w-20"}
                overflow-hidden
            `}
    >
      {/* Línea decorativa superior */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500 animate-pulse"></div>

      {/* Botón de toggle */}
      <button
        onClick={toggleExpand}
        className="
                    absolute top-4 right-4 z-50 
                    bg-orange-500 text-white 
                    hover:bg-orange-600 
                    p-2 rounded-full 
                    shadow-lg 
                    transform hover:scale-110 
                    transition-all duration-300
                "
      >
        {isExpanded ? <ChevronsLeft size={20} /> : <ChevronsRight size={20} />}
      </button>

      {/* Logo */}
      <div className="flex items-center justify-center mt-8 mb-12 relative">
        <img
          src="logoriginal.png"
          className={`
                        w-36 h-auto 
                        transition-all duration-300 
                        transform hover:scale-105
                        ${isExpanded ? "scale-100" : "scale-70"}
                    `}
        />
      </div>

      {/* Menú */}
      <nav className="px-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index} className="transition-all duration-300 hover:scale-105">
              <Link
                to={item.to}
                className={`
                                    flex items-center p-3 rounded-lg 
                                    transition-all duration-300 
                                    ${
                                      location.pathname === item.to
                                        ? "bg-orange-500 text-white"
                                        : "hover:bg-gray-800 hover:text-orange-400"
                                    }
                                    ${isExpanded ? "justify-start" : "justify-center"}
                                `}
              >
                {item.icon}
                {isExpanded && <span className="ml-3 whitespace-nowrap">{item.text}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar

