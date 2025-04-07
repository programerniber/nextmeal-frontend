"use client"

import LoginForm from "../components/LoginForm"
import { useAuth } from "../hooks/useAuth"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const LoginPage = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/")
    }
  }, [isAuthenticated, navigate])

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-white">
          Sistema de Gestión
        </h1>
      </div>
      <LoginForm />
    </div>
  )
}

export default LoginPage