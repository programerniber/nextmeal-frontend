"use client"

import { useState, useEffect } from "react"
import { X, Save, Tag as TagIcon, Image as ImageIcon } from "lucide-react"
import FormField from "../../../clientes/components/form/FormField"

const CategoriaForm = ({ categoria, onClose, onSave }) => {
  const initialFormData = {
    nombre: "",
    descripcion: "",
    imagenUrl: "",
    estado: "activo",
  }

  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [imagePreview, setImagePreview] = useState("")

  useEffect(() => {
    if (categoria) {
      setFormData({
        nombre: categoria.nombre || "",
        descripcion: categoria.descripcion || "",
        imagenUrl: categoria.imagenUrl || "",
        estado: categoria.estado || "activo",
      })
      if (categoria.imagenUrl) setImagePreview(categoria.imagenUrl)
    }
  }, [categoria])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
        setFormData((prev) => ({ ...prev, imagenUrl: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = {}
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio"
    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) return

    setIsSubmitting(true)
    setSubmitError("")

    try {
      // Aquí llamarías al servicio para guardar la categoría
      // if (categoria) {
      //   await updateCategoria(categoria.id, formData)
      // } else {
      //   await createCategoria(formData)
      // }
      onSave()
    } catch (error) {
      console.error("Error al guardar categoría:", error)
      setSubmitError(error.message || "Error al guardar la categoría")
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
              <TagIcon size={16} />
            </span>
            {categoria ? "Editar Categoría" : "Nueva Categoría"}
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
          {submitError && (
            <div className="bg-red-900 text-white p-3 rounded-lg mb-4 animate-pulse border border-red-500 text-sm">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <FormField
              type="text"
              name="nombre"
              label="Nombre de la categoría"
              value={formData.nombre}
              error={errors.nombre}
              onChange={handleChange}
              icon={<TagIcon size={18} className="text-orange-400" />}
            />

            <FormField
              type="text"
              name="descripcion"
              label="Descripción (opcional)"
              value={formData.descripcion}
              onChange={handleChange}
            />

            <div className="mb-4">
              <label className="block text-gray-300 mb-1.5 font-medium text-sm">Imagen</label>
              <div className="flex items-center space-x-4">
                <div className="relative w-24 h-24 bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
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

export default CategoriaForm