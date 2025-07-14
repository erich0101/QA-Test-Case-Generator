

# 🧠 QA Test Case Generator

Asistente inteligente para generación de **escenarios de prueba funcionales y de API**, impulsado por IA (Gemini). Ideal para testers manuales, automatizadores y equipos de QA que buscan acelerar la redacción y cobertura de casos.

---

## 🎯 Propósito

Este proyecto tiene como objetivo:

- Agilizar la creación de casos de prueba de alta calidad.
- Brindar ejemplos y guías estructuradas a perfiles QA junior.
- Reducir el tiempo dedicado a documentación manual.
- Generar estructuras listas para usar en herramientas como Postman.

---

## ⚙️ Requisitos

- Node.js 18+
- Cuenta en [Google Cloud](https://aistudio.google.com/) o OpenAI para obtener tu propia API Key.

---

## 🚀 Instalación y configuración

1. Clonar el repositorio:

```bash
git clone https://github.com/erich0101/QA-Test-Case-Generator.git
cd QA-Test-Case-Generator
Instalar dependencias


💡 ¿Por qué no se incluye una API Key?
Por seguridad. Las claves son privadas, están ligadas a tu cuenta y pueden generar costos si se abusa de la API.

🧪 Modo E2E – Historia de Usuario
✍️ Input de ejemplo:

Como usuario, quiero registrar un nuevo proveedor con CUIT y razón social para poder emitir facturas correctamente.
📤 Output generado:

json
[
  {
    "title": "Alta de proveedor con CUIT válido",
    "gherkin": "Escenario: Alta exitosa de proveedor...\nDado que el usuario accede al formulario...\nCuando completa los campos y presiona Guardar...\nEntonces el sistema muestra mensaje de éxito.",
    "acceptanceCriteria": [
      "CUIT con formato válido",
      "El proveedor se guarda en la base de datos",
      "Se muestra mensaje de éxito"
    ]
  }
]

🔌 Modo API – Comando cURL
✍️ Input de ejemplo:

curl --request POST https://api.ejemplo.com/login \
     --header 'Content-Type: application/json' \
     --data '{ "username": "admin", "password": "123456" }'

📤 Output:
Un array JSON con:

Escenario Gherkin

Headers y body en JSON

Scripts de prueba

Variables de entorno sugeridas

🧠 ¿Qué se entiende por “contexto”?
El generador no responde de forma libre. Está impulsado por un prompt altamente estructurado que define qué debe generar y cómo.

Este prompt guía a la IA con:

Estructura esperada (títulos, Gherkin, criterios, scripts)

Tipos de validaciones (funcionales, técnicas)

Buenas prácticas de QA

Formatos de salida JSON válidos

📌 El resultado depende del input del usuario. Si la historia de usuario o el cURL son ambiguos o incompletos, los escenarios generados también lo serán.

🧾 Historial de generación
Se almacena localmente en el navegador (localStorage).
No se guarda en servidores externos. Puede perderse si se limpia el caché del navegador.