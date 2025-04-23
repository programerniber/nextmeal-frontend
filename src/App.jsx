import {
  Outlet,
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom"

import Sidebar from "./components/layout/sidebar"
import Navbar from "./components/layout/navbar"

import Cliente from "./pages/clientes/cliente"
import Pedido from "./pages/pedidos/pedido"
import Categoria from "./pages/categorias/categoria"
import Productos from "./pages/productos/productos"
import Usuario from "./pages/usuarios/usuario"
import Configuracion from "./pages/configuracion/configuracion"
import { SidebarProvider } from "./components/layout/sidebarContext"
import { useSidebar } from "./components/layout/sidebarUtils"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import "./App.css"

export function App() {
  return (
    <Router>
      <SidebarProvider>
        <AppContent />
      </SidebarProvider>
    </Router>
  )
}

function AppContent() {
  const { isExpanded } = useSidebar()

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main
        className={`flex-1 ${isExpanded ? "ml-64" : "ml-20"} overflow-y-auto transition-all duration-300`}
      >
        <Navbar />
        <div className="p-4 pt-20">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/clientes" replace />} />
              <Route path="clientes" element={<Cliente />} />
              <Route path="pedidos" element={<Pedido />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="usuario" element={<Usuario />} />
              <Route path="categoria" element={<Categoria />} />
              <Route path="productos" element={<Productos />} />
              <Route path="ventas" element={<Ventas />} />
              <Route path="configuracion" element={<Configuracion />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </div>

        {/* 🔔 Contenedor global para notificaciones */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="dark" // Puedes cambiarlo a "light" o "colored"
        />
      </main>
    </div>
  )
}

function Layout() {
  return <Outlet />
}

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

function Dashboard() {
  return <h1 className="text-2xl">Dashboard</h1>
}



function Ventas() {
  return <h1 className="text-2xl">Ventas</h1>
}

export default App