import axios from "axios"
const VITE_API_URL = "http://localhost:3000/api/clientes"


// Datos quemados para simular una base de datos
// let clientes = [
//   {
//     id: "1",
//     nombreCompleto: "Juan Pérez",
//     tipoDocumento: "CC",
//     documentoIdentidad: "1234567890",
//     correoElectronico: "juan@ejemplo.com",
//     telefono: "3001234567",
//     direccion: "Calle 123 #45-67",
//     genero: "masculino",
//     estado: "activo",
//     fechaRegistro: new Date("2023-01-15").toISOString(),
//   },
//   {
//     id: "2",
//     nombreCompleto: "María López",
//     tipoDocumento: "CC",
//     documentoIdentidad: "0987654321",
//     correoElectronico: "maria@ejemplo.com",
//     telefono: "3109876543",
//     direccion: "Avenida 456 #78-90",
//     genero: "femenino",
//     estado: "activo",
//     fechaRegistro: new Date("2023-02-20").toISOString(),
//   },
//   {
//     id: "3",
//     nombreCompleto: "Carlos Rodríguez",
//     tipoDocumento: "CE",
//     documentoIdentidad: "5678901234",
//     correoElectronico: "carlos@ejemplo.com",
//     telefono: "3201234567",
//     direccion: "Carrera 789 #12-34",
//     genero: "masculino",
//     estado: "inactivo",
//     fechaRegistro: new Date("2023-03-10").toISOString(),
//   },
//   {
//     id: "4",
//     nombreCompleto: "Ana Martínez",
//     tipoDocumento: "TI",
//     documentoIdentidad: "4321098765",
//     correoElectronico: "ana@ejemplo.com",
//     telefono: "3501234567",
//     direccion: "Diagonal 234 #56-78",
//     genero: "femenino",
//     estado: "activo",
//     fechaRegistro: new Date("2023-04-05").toISOString(),
//   },
//   {
//     id: "5",
//     nombreCompleto: "Pedro Gómez",
//     tipoDocumento: "CC",
//     documentoIdentidad: "9876543210",
//     correoElectronico: "pedro@ejemplo.com",
//     telefono: "3151234567",
//     direccion: "Transversal 567 #89-01",
//     genero: "masculino",
//     estado: "inactivo",
//     fechaRegistro: new Date("2023-05-15").toISOString(),
//   },
// ]

// Función para generar un ID único
// const generateId = () => {
//   return Math.random().toString(36).substring(2, 9)
// }

// Simular delay para operaciones asíncronas
// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Obtener todos los clientes
// export const fetchClientes = async () => {
//   await delay(500) // Simular tiempo de carga
//   // return [...clientes]
// }
export const fetchClientes = async () => {
  const cliente = await axios.get(VITE_API_URL);
  return cliente.data
}

// // Obtener un cliente por ID
// export const fetchClienteById = async (id) => {
//   await delay(300)
//   const cliente = clientes.find((c) => c.id === id)
//   if (!cliente) {
//     throw new Error("Cliente no encontrado")
//   }
//   return cliente
// }
export const fetchClienteById = async (id) => {
  const cliente = await axios.get(`${VITE_API_URL}/${id}`)
  return cliente.data.data
}


// Crear un nuevo cliente
// export const createCliente = async (clienteData) => {
//   await delay(500)
//   const newCliente = {
//     ...clienteData,
//     id: generateId(),
//     fechaRegistro: new Date().toISOString(),
//   }
//   clientes.push(newCliente)
//   return newCliente
// }
export const createCliente = async (clienteData) => {
  try {
    const response = await axios.post(VITE_API_URL, clienteData);
    return response.data.data; // Cambia esto si el backend no devuelve un objeto con `.data.data`
  } catch (error) {
    console.error("Error al crear el cliente:", error.response?.data || error.message);
    throw error;
  }
};


// Actualizar un cliente existente
// export const updateCliente = async (id, clienteData) => {
//   await delay(500)
//   const index = clientes.findIndex((cliente) => cliente.id === id)
//   if (index === -1) {
//     throw new Error("Cliente no encontrado")
//   }
//   clientes[index] = { ...clientes[index], ...clienteData }
//   return clientes[index]
// }
export const updateCliente = async (id, clienteData) => {
  const response = await axios.put(`${VITE_API_URL}/${id}`, clienteData)
  return response.data
}

// Eliminar un cliente
// export const deleteCliente = async (id) => {
//   await delay(500)
//   const index = clientes.findIndex((cliente) => cliente.id === id)
//   if (index === -1) {
//     throw new Error("Cliente no encontrado")
//   }
//   clientes = clientes.filter((cliente) => cliente.id !== id)
//   return { success: true }
// }
export const deleteCliente = async (id) => {
  await axios.delete(`${VITE_API_URL}/${id}`)
  return { success: true }
}

// // Cambiar el estado de un cliente (activo/inactivo)
// export const toggleClienteEstado = async (id) => {
//   await delay(300)
//   const index = clientes.findIndex((cliente) => cliente.id === id)
//   if (index === -1) {
//     throw new Error("Cliente no encontrado")
//   }

//   // Cambiar el estado
//   const nuevoEstado = clientes[index].estado === "activo" ? "inactivo" : "activo"
//   clientes[index] = { ...clientes[index], estado: nuevoEstado }

//   return clientes[index]
// }
export const toggleClienteEstado = async (id, estado) => {
  const clientes = await axios.patch(`${VITE_API_URL}/${id}/estado`, estado)
  return clientes.data
}

