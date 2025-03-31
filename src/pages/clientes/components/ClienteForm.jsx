"use client"

import { useState, useEffect } from "react"
import { X, Save, User, Mail, Phone, MapPin, CheckCircle, AlertCircle } from "lucide-react"
import { createCliente, updateCliente } from "../api/clienteService"
import FormField from "./form/FormField"
import SelectField from "./form/SelectField"

const ClienteForm = ({ cliente, onClose, onSave }) => {
  const initialFormData = {
    nombreCompleto: "",
    tipoDocumento: "CC",
    documentoIdentidad: "",
    correoElectronico: "",
    telefono: "",
    direccion: "",
    genero: "masculino",
    estado: "activo",
  }

  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 2
  const [formSubmitted, setFormSubmitted] = useState(false)

  // Si hay un cliente para editar, cargar sus datos
  useEffect(() => {
    if (cliente) {
      setFormData({
        nombreCompleto: cliente.nombreCompleto || "",
        tipoDocumento: cliente.tipoDocumento || "CC",
        documentoIdentidad: cliente.documentoIdentidad || "",
        correoElectronico: cliente.correoElectronico || "",
        telefono: cliente.telefono || "",
        direccion: cliente.direccion || "",
        genero: cliente.genero || "masculino",
        estado: cliente.estado || "activo",
      })
    }
  }, [cliente])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Limpiar error del campo cuando cambia
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  // Validaciones de formulario
  const validations = {
    nombreCompleto: (value) => (!value.trim() ? "El nombre es obligatorio" : ""),
    documentoIdentidad: (value) => (!value.trim() ? "El documento es obligatorio" : ""),
    correoElectronico: (value) => {
      if (!value.trim()) return "El correo es obligatorio"
      if (!/\S+@\S+\.\S+/.test(value)) return "El correo no es válido"
      return ""
    },
    telefono: (value) => (!value.trim() ? "El teléfono es obligatorio" : ""),
    direccion: (value) => (!value.trim() ? "La dirección es obligatoria" : ""),
  }

  // Validar solo los campos del paso actual
  const validateCurrentStep = () => {
    const newErrors = {}
    const fieldsToValidate =
      currentStep === 1 ? ["nombreCompleto", "documentoIdentidad", "correoElectronico"] : ["telefono", "direccion"]

    // Validar cada campo del paso actual
    fieldsToValidate.forEach((field) => {
      if (validations[field]) {
        const error = validations[field](formData[field])
        if (error) newErrors[field] = error
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateForm = () => {
    const newErrors = {}

    // Validar cada campo
    Object.keys(validations).forEach((field) => {
      const error = validations[field](formData[field])
      if (error) newErrors[field] = error
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()

    // Evitar múltiples envíos
    if (formSubmitted) return
    setFormSubmitted(true)

    if (!validateForm()) {
      setFormSubmitted(false)
      return
    }

    setIsSubmitting(true)
    setSubmitError("")

    try {
      if (cliente) {
        await updateCliente(cliente.id, formData)
      } else {
        await createCliente(formData)
      }

      onSave()
    } catch (error) {
      console.error("Error al guardar cliente:", error)
      setSubmitError(error.message || "Error al guardar el cliente")
      setFormSubmitted(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  // Definición de campos del formulario por pasos
  const formFieldsByStep = {
    1: [
      {
        type: "text",
        name: "nombreCompleto",
        label: "Nombre Completo",
        value: formData.nombreCompleto,
        error: errors.nombreCompleto,
        icon: <User size={18} className="text-orange-400" />,
      },
      {
        type: "document-group",
        fields: [
          {
            type: "select",
            name: "tipoDocumento",
            label: "Tipo",
            value: formData.tipoDocumento,
            options: [
              { value: "CC", label: "CC" },
              { value: "TI", label: "TI" },
              { value: "Pasaporte", label: "Pasaporte" },
              { value: "CE", label: "CE" },
            ],
          },
          {
            type: "text",
            name: "documentoIdentidad",
            label: "Documento",
            value: formData.documentoIdentidad,
            error: errors.documentoIdentidad,
          },
        ],
      },
      {
        type: "email",
        name: "correoElectronico",
        label: "Correo Electrónico",
        value: formData.correoElectronico,
        error: errors.correoElectronico,
        icon: <Mail size={18} className="text-orange-400" />,
      },
    ],
    2: [
      {
        type: "text",
        name: "telefono",
        label: "Teléfono",
        value: formData.telefono,
        error: errors.telefono,
        icon: <Phone size={18} className="text-orange-400" />,
      },
      {
        type: "text",
        name: "direccion",
        label: "Dirección",
        value: formData.direccion,
        error: errors.direccion,
        icon: <MapPin size={18} className="text-orange-400" />,
      },
      {
        type: "select",
        name: "genero",
        label: "Género",
        value: formData.genero,
        options: [
          { value: "masculino", label: "Masculino" },
          { value: "femenino", label: "Femenino" },
          { value: "otro", label: "Otro" },
        ],
      },
      {
        type: "select",
        name: "estado",
        label: "Estado",
        value: formData.estado,
        options: [
          { value: "activo", label: "Activo" },
          { value: "inactivo", label: "Inactivo" },
        ],
        icon:
          formData.estado === "activo" ? (
            <CheckCircle size={18} className="text-green-400" />
          ) : (
            <AlertCircle size={18} className="text-red-400" />
          ),
      },
    ],
  }

  // Renderizar campos de formulario
  const renderFormField = (field) => {
    if (field.type === "document-group") {
      return (
        <div key="document-group" className="mb-4">
          <div className="flex flex-row space-x-2">
            <div className="w-1/3">
              <SelectField
                name={field.fields[0].name}
                label={field.fields[0].label}
                value={field.fields[0].value}
                options={field.fields[0].options}
                onChange={handleChange}
              />
            </div>
            <div className="w-2/3">
              <FormField
                type={field.fields[1].type}
                name={field.fields[1].name}
                label={field.fields[1].label}
                value={field.fields[1].value}
                error={field.fields[1].error}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      )
    }

    if (field.type === "select") {
      return (
        <SelectField
          key={field.name}
          name={field.name}
          label={field.label}
          value={field.value}
          options={field.options}
          onChange={handleChange}
          icon={field.icon}
        />
      )
    }

    return (
      <FormField
        key={field.name}
        type={field.type}
        name={field.name}
        label={field.label}
        value={field.value}
        error={field.error}
        onChange={handleChange}
        icon={field.icon}
      />
    )
  }

  // Componente para los pasos del formulario
  const FormSteps = () => (
    <div className="flex justify-center mb-6">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm
              ${
                currentStep === step
                  ? "bg-orange-500 shadow-lg shadow-orange-500/30"
                  : currentStep > step
                    ? "bg-green-500 shadow-lg shadow-green-500/30"
                    : "bg-gray-700"
              }`}
          >
            {step}
          </div>
          {step < totalSteps && (
            <div className={`w-12 h-1 ${currentStep > step ? "bg-green-500" : "bg-gray-700"}`}></div>
          )}
        </div>
      ))}
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-md border-t-4 border-orange-500 animate-fade-in">
        <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-gray-950">
          <h2 className="text-lg font-bold text-white flex items-center">
            <span className="bg-orange-500 text-white p-1.5 rounded-lg mr-2">
              <User size={16} />
            </span>
            {cliente ? "Editar Cliente" : "Registrar Cliente"}
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

          <FormSteps />

          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (currentStep === totalSteps) {
                handleSubmit()
              } else {
                nextStep()
              }
            }}
          >
            <div className="space-y-4">{formFieldsByStep[currentStep].map(renderFormField)}</div>

            <div className="flex justify-between mt-6">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-3 py-1.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors border border-gray-700 flex items-center gap-1 text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Anterior
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors border border-gray-700 text-sm"
                >
                  Cancelar
                </button>
              )}

              {currentStep < totalSteps ? (
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors border border-orange-500 flex items-center gap-1 text-sm"
                >
                  Siguiente
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              ) : (
                <button
                  type="submit"
                  className={`px-3 py-1.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-1 border border-orange-500 text-sm ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  disabled={isSubmitting || formSubmitted}
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
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ClienteForm

