# 🩺 Proyecto de Análisis y Predicción de Riesgo de Diabetes

Este proyecto combina el poder del **Aprendizaje Automático (Machine Learning)** para predecir el riesgo de diabetes con la accesibilidad de una **aplicación móvil** desarrollada con React Native y desplegada a través de Expo Go.

El objetivo principal es tomar datos de salud de un paciente (como glucosa, IMC, edad, etc.) y predecir su riesgo de desarrollar diabetes, proporcionando una herramienta de cribado inicial.

## ✨ Características

* **Modelo de Predicción de Riesgo:** Utiliza un clasificador **Random Forest** entrenado con el conjunto de datos de diabetes de los indios Pima.
* **Análisis Exploratorio de Datos (EDA):** Documentado en el cuaderno `Riesgo_Diabetes.ipynb`, incluye visualizaciones de distribuciones y correlaciones entre las variables clave.
* **Despliegue Móvil:** Interfaz sencilla y portable desarrollada con **React Native/Expo** para ingresar los datos del paciente y obtener la predicción en tiempo real.
* **Alta Precisión:** El modelo alcanzó una precisión de aproximadamente **85%** en las pruebas (según el análisis inicial del notebook).

## 🚀 Despliegue con Expo Go

La aplicación móvil fue desarrollada y desplegada usando el ecosistema Expo, lo que permite una fácil configuración y ejecución en dispositivos iOS y Android.

### 📱 Para ver la aplicación

1. Asegúrate de tener instalada la aplicación **Expo Go** en tu dispositivo móvil (disponible en la App Store y Google Play).
2. Si tienes el servidor de desarrollo de Expo corriendo (usando `expo start`), escanea el código QR que aparece en la terminal.
3. Alternativamente, puedes buscar el proyecto directamente en la pestaña "Projects" de Expo Go si el desarrollador lo ha publicado en la plataforma.

## 🛠️ Tecnologías Utilizadas

| Categoría | Herramienta | Uso |
| :--- | :--- | :--- |
| **Análisis y ML** | `Python`, `Jupyter Notebook` | Análisis exploratorio y entrenamiento del modelo. |
| **Librerías ML** | `Scikit-learn`, `Pandas`, `Numpy` | Implementación del modelo Random Forest y manejo de datos. |
| **Desarrollo Móvil** | `React Native` | Framework para la construcción de la interfaz de la aplicación. |
| **Plataforma de Despliegue** | `Expo Go` | Herramienta para la prueba, desarrollo y despliegue rápido de la aplicación móvil. |

## ⚙️ Configuración del Entorno (Para Desarrolladores)

Si deseas clonar el proyecto y modificar la aplicación o el modelo:

### 1. Prerequisitos

Asegúrate de tener instalados:

* **Node.js** y **npm** (o Yarn).
* **Python** (versión 3.x recomendada).
* **Expo CLI** (instalación global):
    ```bash
    npm install -g expo-cli
    ```

### 2. Instalación y Ejecución

1. Clona este repositorio:
    ```bash
    git clone [URL_DE_TU_REPOSITORIO]
    cd [nombre-del-proyecto-mobile]
    ```

2. Instala las dependencias del proyecto React Native:
    ```bash
    npm install
    # o yarn install
    ```

3. Inicia el servidor de desarrollo de Expo:
    ```bash
    expo start
    ```
    Esto abrirá un navegador con el Metro Bundler. Podrás escanear el código QR con la aplicación Expo Go de tu teléfono para cargar el proyecto.

4. *(Opcional - Para el análisis de ML)* Ve a la carpeta que contiene el archivo `Riesgo_Diabetes.ipynb` y ejecuta el análisis en un entorno Python para entender el entrenamiento del modelo.
    ```bash
    # En un entorno con Jupyter/JupyterLab instalado
    jupyter notebook Riesgo_Diabetes.ipynb
    ```

## 📝 Licencia

Este proyecto está bajo la Licencia [Especifique aquí la licencia, ej: MIT, Apache, o "Todos los derechos reservados"].
