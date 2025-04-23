"use client"

import { useState, useEffect } from "react"
import { X, Save, Package, ImageIcon, DollarSign, TagIcon } from "lucide-react"
import FormField from "../../categorias/componentes/form/FormField"
import { createProducto, updateProducto } from "../api/ProductoService"
import { fetchCategorias } from "../../categorias/api/categoriaService"

const ProductoForm = ({ producto, onClose, onSave }) => {
  const initialFormData = {
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    categoriaId: "",
    imagenUrl: "",
    estado: "activo", // Por defecto siempre activo
  }

  // Estados para el formulario
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [imagePreview, setImagePreview] = useState("")
  const [imageFile, setImageFile] = useState(null)

  // Estados para las categorías
  const [categorias, setCategorias] = useState([])
  const [loadingCategorias, setLoadingCategorias] = useState(false)

  // Cargar categorías
  const loadCategorias = async () => {
    try {
      setLoadingCategorias(true)
      const data = await fetchCategorias()
      console.log(data)
      // Filtrar solo categorías activas
      // const categoriasActivas = data.filter((cat) => cat.estado === "activo")
      setCategorias(data.data)
    } catch (error) {
      console.error("Error al cargar categorías:", error)
    } finally {
      setLoadingCategorias(false)
    }
  }

  useEffect(() => {
    // Cargar categorías al montar el componente
    loadCategorias()

    // Inicializar formulario con datos del producto si existe
    if (producto) {
      setFormData({
        nombre: producto.nombre || "",
        descripcion: producto.descripcion || "",
        precio: producto.precio?.toString() || "",
        stock: producto.stock?.toString() || "",
        categoriaId: producto.categoriaId || "",
        imagenUrl: producto.imagenUrl || "",
        estado: producto.estado || "activo",
      })
      if (producto.imagenUrl) setImagePreview(producto.imagenUrl)
    }
  }, [producto])

  const handleChange = (e) => {
    const { name, value } = e.target

    // Validación específica para campos numéricos
    if (name === "precio" || name === "stock") {
      if (!/^\d*\.?\d*$/.test(value)) {
        return // No actualizar si no son números o punto decimal
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
        setFormData((prev) => ({ ...prev, imagenUrl: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio"
    }

    if (!formData.precio.trim()) {
      newErrors.precio = "El precio es obligatorio"
    } else if (isNaN(Number.parseFloat(formData.precio)) || Number.parseFloat(formData.precio) <= 0) {
      newErrors.precio = "El precio debe ser un número mayor que cero"
    }

    if (!formData.stock.trim()) {
      newErrors.stock = "El stock es obligatorio"
    } else if (isNaN(Number.parseInt(formData.stock)) || Number.parseInt(formData.stock) < 0) {
      newErrors.stock = "El stock debe ser un número entero no negativo"
    }

    if (!formData.Id_Categoria) {
      setError("Debe seleccionar una categoría")
      return
    }

    try {
      setLoading(prev => ({ ...prev, submit: true }))

      const productoData = {
        nombre: formData.nombre.trim(),
        precio: formData.precio,
        cantidad: parseInt(formData.cantidad),
        descripcion: formData.descripcion?.trim(),
        estado: formData.estado,
        Id_Categoria: formData.Id_Categoria  
      }
      

      if (producto) {
        await actualizarProducto(producto.id, productoData)
        

      } else {
        await crearProducto(productoData)
        
        
      }
      onSave()
    } catch (error) {
      console.error("Error al guardar producto:", error)
      setSubmitError(error.message || "Error al guardar el producto")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-md border-t-4 border-orange-500 animate-fade-in">
        <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-gray-950">
          <h2 className="text-lg font-bold text-white flex items-center">
            <span className="bg-orange-500 text-white p-1.5 rounded-lg mr-2">
              <Package size={16} />
            </span>
            {producto ? "Editar Producto" : "Nuevo Producto"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:rotate-90 transition-all bg-gray-800 p-1.5 rounded-full"
            title="Volver"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          {/* Mostrar error de submit */}
          {submitError && (
            <div className="bg-red-900 text-white p-3 rounded-lg mb-4 animate-pulse border border-red-500 text-sm">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <FormField
              type="text"
              name="nombre"
              label="Nombre del producto"
              value={formData.nombre}
              error={errors.nombre}
              onChange={handleChange}
              icon={<Package size={18} className="text-orange-400" />}
              disabled={isSubmitting}
            />

            <FormField
              type="textarea"
              name="descripcion"
              label="Descripción (opcional)"
              value={formData.descripcion}
              onChange={handleChange}
              disabled={isSubmitting}
            />

            <div className="grid grid-cols-1 gap-4 mb-4">
              <FormField
                type="text"
                name="precio"
                label="Precio"
                value={formData.precio}
                error={errors.precio}
                onChange={handleChange}
                icon={<DollarSign size={18} className="text-orange-400" />}
                disabled={isSubmitting}
              />

              {/* <FormField
                type="text"
                name="stock"
                label="Stock"
                value={formData.stock}
                error={errors.stock}
                onChange={handleChange}
                disabled={isSubmitting}
              /> */}
            </div>

            <div className="mb-4">
              <label className="block text-gray-300 mb-1.5 font-medium text-sm">Categoría</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <TagIcon size={18} className="text-orange-400" />
                </div>
                <select
                  name="categoriaId"
                  value={formData.categoriaId}
                  onChange={handleChange}
                  className={`w-full bg-gray-800 text-white border ${
                    errors.categoriaId ? "border-red-500" : "border-gray-700"
                  } rounded-lg pl-10 p-2.5`}
                  disabled={isSubmitting || loadingCategorias}
                >
                  <option value="">Seleccionar categoría</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>
              {errors.categoriaId && <p className="mt-1 text-sm text-red-500">{errors.categoriaId}</p>}
              {loadingCategorias && <p className="mt-1 text-sm text-gray-400">Cargando categorías...</p>}
            </div>

            <div className="mb-4">
              <label className="block text-gray-300 mb-1.5 font-medium text-sm">Imagen</label>
              <div className="flex items-center space-x-4">
                <div className="relative w-24 h-24 bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                  {imagePreview ? (
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      <ImageIcon size={32} />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600 transition-colors"
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-gray-500 mt-1">Formatos: JPG, PNG, GIF</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors border border-gray-700"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={`px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 border border-orange-500 ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Guardar
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProductoForm
