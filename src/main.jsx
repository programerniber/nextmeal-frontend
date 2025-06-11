
import React from 'react'
import ReactDOM  from 'react-dom/client'
import {App} from './App.jsx'
import './App.css'


window.API_URL = import.meta.env.VITE_API_URL ||"https://nextmeal-rapido.onrender.com"

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
 
    <App />
)
