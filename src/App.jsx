import { Outlet, BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Sidebar from "./components/layout/sidebar"
import Navbar from "./components/layout/navbar"
import Cliente from "./pages/clientes/cliente"
import Pedido from "./pages/pedidos/pedido"
import Categoria from "./pages/categorias/categoria"
import Productos from "./pages/productos/productos"
import { SidebarProvider } from "./components/layout/sidebarContext" // Importar el provider
import "./App.css"
import { useSidebar } from "./components/layout/sidebarUtils"

export function App() {
  return (
    <Router>
      <SidebarProvider>
        {" "}
        {/* Envolver la aplicación con el provider */}
        <AppContent />
      </SidebarProvider>
    </Router>
  )
}

// Componente separado para acceder al contexto
function AppContent() {
  const { isExpanded } = useSidebar() // Usar el contexto

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className={`flex-1 ${isExpanded ? "ml-64" : "ml-20"} overflow-y-auto transition-all duration-300`}>
        {/* Margen dinámico basado en el estado de la barra lateral */}
        <Navbar />
        <div className="p-4 pt-20">
          {" "}
          {/* Añadir padding-top para evitar que el contenido quede debajo del navbar */}
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* Ruta de inicio redirige a clientes */}
              <Route index element={<Navigate to="/clientes" replace />} />

              <Route path="clientes" element={<Cliente />} />
              <Route path="pedidos" element={<Pedido />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="usuario" element={<Usuario />} />
              <Route path="categoria" element={<Categoria />} />
              <Route path="productos" element={<Productos />} />
              <Route path="ventas" element={<Ventas />} />
              <Route path="configuracion" element={<Configuracion />} />

              {/* Ruta para manejar páginas no encontradas */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </div>
      </main>
    </div>
  )
}

// Layout que maneja las rutas hijas
function Layout() {
  return <Outlet />
}

// Componente para manejar rutas no encontradas
function NotFound() {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">404</h1>
        <p className="text-xl text-gray-600">Página no encontrada</p>
      </div>
    </div>
  )
}

// Componentes temporales para las rutas faltantes
function Dashboard() {
  return <h1 className="text-2xl">Dashboard</h1>
}

function Usuario() {
  return <h1 className="text-2xl">Usuario</h1>
}

// function Categoria() {
//   return <h1 className="text-2xl">Categoría</h1>
// }

// function Productos() {
//   return <h1 className="text-2xl">Productos</h1>
// }

function Ventas() {
  return <h1 className="text-2xl">Ventas</h1>
}

function Configuracion() {
  return <h1 className="text-2xl">Configuración</h1>
}

export default App

