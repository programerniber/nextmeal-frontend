// Ejemplo básico - Debes implementar las llamadas reales a tu API
export const fetchCategorias = async () => {
    try {
      // Simulación de llamada a API
      // const response = await fetch('/api/categorias');
      // return await response.json();
      return [
        {
          id: 1,
          nombre: "Electrónicos",
          descripcion: "Productos electrónicos y dispositivos",
          imagenUrl: "/images/electronics.jpg",
          estado: "activo"
        },
        {
          id: 2,
          nombre: "Ropa",
          descripcion: "Ropa para todas las edades",
          imagenUrl: "",
          estado: "activo"
        }
      ]
    } catch (error) {
      throw new Error("Error al obtener categorías")
    }
  }
  
  export const createCategoria = async (categoriaData) => {
    try {
      // Implementar llamada real a API para crear categoría
      // const response = await fetch('/api/categorias', {
      //   method: 'POST',
      //   body: JSON.stringify(categoriaData)
      // });
      // return await response.json();
      return { success: true }
    } catch (error) {
      throw new Error("Error al crear categoría")
    }
  }
  
  export const deleteCategoria = async (id) => {
    try {
      // Implementar llamada real a API para eliminar categoría
      // const response = await fetch(`/api/categorias/${id}`, {
      //   method: 'DELETE'
      // });
      // return await response.json();
      return { success: true }
    } catch (error) {
      throw new Error("Error al eliminar categoría")
    }
  }