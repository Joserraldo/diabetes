from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
import joblib
from fastapi.middleware.cors import CORSMiddleware

# Inicializar la app FastAPI
app = FastAPI(
    title="API de Predicción de Diabetes - Random Forest",
    description="Predice si una persona tiene riesgo de diabetes usando un modelo Random Forest entrenado.",
    version="1.0.0"
)

# Permitir CORS (para conexión con frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cambiar por el dominio del frontend en producción
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cargar el modelo y el escalador
modelo = joblib.load("random_forest_model.joblib")
scaler = joblib.load("scaler.joblib")

# Definir la estructura del JSON de entrada
class PatientData(BaseModel):
    Age: float
    Pregnancies: float
    BMI: float
    Glucose: float
    BloodPressure: float
    HbA1c: float
    LDL: float
    HDL: float
    Triglycerides: float
    WaistCircumference: float
    HipCircumference: float
    WHR: float
    FamilyHistory: float
    DietType: float
    Hypertension: float
    MedicationUse: float


@app.get("/")
def root():
    return {"message": "API de predicción de riesgo de Diabetes operativa ✅"}


@app.post("/predict")
def predict_diabetes(data: PatientData):
    """
    Recibe los datos de un paciente en formato JSON,
    los transforma, escala y predice el riesgo de diabetes.
    """
    # Convertir los datos a un arreglo numpy sin nombres de columnas
    input_data = np.array([
        data.Age,
        data.Pregnancies,
        data.BMI,
        data.Glucose,
        data.BloodPressure,
        data.HbA1c,
        data.LDL,
        data.HDL,
        data.Triglycerides,
        data.WaistCircumference,
        data.HipCircumference,
        data.WHR,
        data.FamilyHistory,
        data.DietType,
        data.Hypertension,
        data.MedicationUse
    ]).reshape(1, -1)

    # Escalar los datos con el StandardScaler cargado
    input_scaled = scaler.transform(input_data)

    # Obtener la probabilidad de la clase "1" (riesgo de diabetes)
    prob_diabetes = modelo.predict_proba(input_scaled)[0][1]

    # Clasificar según umbral de 0.5
    resultado = 1 if prob_diabetes > 0.5 else 0
    mensaje = "Tiene riesgo de diabetes" if resultado == 1 else "No tiene riesgo de diabetes"

    return {
        "resultado": int(resultado),
        "mensaje": mensaje,
        "probabilidad_diabetes": float(round(prob_diabetes, 4))
    }


# Ejecutar con: uvicorn app:app --host 0.0.0.0 --port 5001
