import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import Slider from '@react-native-community/slider';

export default function App() {
  const [ip, setIp] = useState('52.91.48.195');
  const [puerto, setPuerto] = useState('5001');
  const [conectado, setConectado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);

  const [datos, setDatos] = useState({
    Edad: 40,
    Embarazos: 3,
    IMC: 25,
    Glucosa: 100,
    PresionArterial: 80,
    HbA1c: 5.5,
    LDL: 100,
    HDL: 50,
    Trigliceridos: 150,
    Cintura: 80,
    Cadera: 90,
    WHR: 0.9,
    HistoriaFamiliar: 0,
    TipoDeDieta: 1,
    Hipertension: 0,
    UsoDeMedicacion: 0
  });

  const categorias = [
    {
      titulo: 'Información Personal',
      emoji: '👤',
      color: '#3B82F6',
      items: [
        { key: 'Edad', label: 'Edad', min: 0, max: 80, step: 1, unidad: 'años', icon: '👤' }
      ]
    },
    {
      titulo: 'Medidas Corporales',
      emoji: '⚖️',
      color: '#8B5CF6',
      items: [
        { key: 'IMC', label: 'IMC', min: 10, max: 50, step: 0.1, unidad: 'kg/m²', icon: '⚖️' },
        { key: 'Cintura', label: 'Cintura', min: 50, max: 150, step: 1, unidad: 'cm', icon: '📏' },
        { key: 'Cadera', label: 'Cadera', min: 50, max: 150, step: 1, unidad: 'cm', icon: '📐' },
        { key: 'WHR', label: 'Cintura/Cadera', min: 0.5, max: 2, step: 0.01, unidad: '', icon: '📊' }
      ]
    },
    {
      titulo: 'Valores de Laboratorio',
      emoji: '🩸',
      color: '#EF4444',
      items: [
        { key: 'Glucosa', label: 'Glucosa', min: 50, max: 200, step: 1, unidad: 'mg/dL', icon: '🩸' },
        { key: 'HbA1c', label: 'HbA1c', min: 3, max: 15, step: 0.1, unidad: '%', icon: '🔬' },
        { key: 'LDL', label: 'LDL', min: 50, max: 200, step: 1, unidad: 'mg/dL', icon: '📉' },
        { key: 'HDL', label: 'HDL', min: 20, max: 100, step: 1, unidad: 'mg/dL', icon: '📈' },
        { key: 'Trigliceridos', label: 'Triglicéridos', min: 50, max: 500, step: 1, unidad: 'mg/dL', icon: '💧' }
      ]
    },
    {
      titulo: 'Salud Cardiovascular',
      emoji: '💓',
      color: '#EC4899',
      items: [
        { key: 'PresionArterial', label: 'Presión', min: 40, max: 180, step: 1, unidad: 'mmHg', icon: '💓' }
      ]
    },
    {
      titulo: 'Historial',
      emoji: '❤️',
      color: '#10B981',
      items: [
        { key: 'Embarazos', label: 'Embarazos', min: 0, max: 10, step: 1, unidad: '', icon: '👶' }
      ]
    }
  ];

  const opcionesBinarias = [
    { key: 'HistoriaFamiliar', label: '¿Historia familiar?', icon: '👨‍👩‍👧‍👦' },
    { key: 'Hipertension', label: '¿Hipertensión?', icon: '💔' },
    { key: 'UsoDeMedicacion', label: '¿Usa medicación?', icon: '💊' }
  ];

  const opcionesDieta = [
    { valor: 0, label: 'Poco\nSaludable', emoji: '🍔', color: '#EF4444' },
    { valor: 1, label: 'Moderada', emoji: '🥗', color: '#F59E0B' },
    { valor: 2, label: 'Saludable', emoji: '🥦', color: '#10B981' }
  ];

  const handleSliderChange = (key, value) => {
    setDatos(prev => ({ ...prev, [key]: value }));
  };

  const handleEnviar = async () => {
    setLoading(true);
    setResultado(null);
    try {
      const url = `http://${ip}:${puerto}/predict`;
      
      // Convertir los datos al formato que espera el backend (en inglés)
      const datosParaEnviar = {
        Age: datos.Edad,
        Pregnancies: datos.Embarazos,
        BMI: datos.IMC,
        Glucose: datos.Glucosa,
        BloodPressure: datos.PresionArterial,
        HbA1c: datos.HbA1c,
        LDL: datos.LDL,
        HDL: datos.HDL,
        Triglycerides: datos.Trigliceridos,
        WaistCircumference: datos.Cintura,
        HipCircumference: datos.Cadera,
        WHR: datos.WHR,
        FamilyHistory: datos.HistoriaFamiliar,
        DietType: datos.TipoDeDieta,
        Hypertension: datos.Hipertension,
        MedicationUse: datos.UsoDeMedicacion
      };
      
      console.log('Enviando datos:', datosParaEnviar);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosParaEnviar)
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Respuesta del servidor:', data);
      
      // Validar que la respuesta tenga los datos esperados
      if (data && (data.mensaje || data.probabilidad_diabetes !== undefined)) {
        setResultado(data);
      } else {
        Alert.alert('Error', 'Respuesta del servidor inválida');
        console.error('Datos recibidos:', data);
      }
    } catch (error) {
      console.error('Error completo:', error);
      Alert.alert('Error', `No se pudo conectar: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getColorValor = (key, valor) => {
    if (key === 'Glucosa') {
      if (valor < 100) return '#10B981';
      if (valor < 126) return '#F59E0B';
      return '#EF4444';
    }
    if (key === 'IMC') {
      if (valor < 18.5) return '#3B82F6';
      if (valor < 25) return '#10B981';
      if (valor < 30) return '#F59E0B';
      return '#EF4444';
    }
    return '#6366F1';
  };

  if (!conectado) {
    return (
      <View style={styles.containerInicio}>
        <View style={styles.cardConexion}>
          <View style={styles.iconoGrande}>
            <Text style={styles.emojiGrande}>🏥</Text>
          </View>
          <Text style={styles.tituloGrande}>Predictor de Diabetes</Text>
          <Text style={styles.subtitulo}>Conecta con el servidor</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.labelInput}>🌐 Dirección IP</Text>
            <TextInput
              style={styles.input}
              value={ip}
              onChangeText={setIp}
              placeholder="192.168.1.1"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.labelInput}>🔌 Puerto</Text>
            <TextInput
              style={styles.input}
              value={puerto}
              onChangeText={setPuerto}
              keyboardType="numeric"
              placeholder="5001"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          
          <TouchableOpacity
            style={styles.botonConectar}
            onPress={() => setConectado(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.textoBotonConectar}>🚀 Conectar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitulo}>🏥 Predictor de Diabetes</Text>
            <Text style={styles.headerSubtitulo}>Datos de salud</Text>
          </View>
          <TouchableOpacity
            style={styles.botonDesconectar}
            onPress={() => setConectado(false)}
            activeOpacity={0.8}
          >
            <Text style={styles.textoDesconectar}>Salir</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.contenido}>
          {categorias.map((categoria, idx) => (
            <View key={idx} style={styles.card}>
              <View style={[styles.cardHeader, { backgroundColor: categoria.color }]}>
                <Text style={styles.cardHeaderEmoji}>{categoria.emoji}</Text>
                <Text style={styles.cardHeaderTitulo}>{categoria.titulo}</Text>
              </View>
              <View style={styles.cardBody}>
                {categoria.items.map((item) => (
                  <View key={item.key} style={styles.sliderContainer}>
                    <View style={styles.sliderHeader}>
                      <Text style={styles.sliderLabel}>
                        {item.icon} {item.label}
                      </Text>
                      <Text style={[styles.sliderValor, { color: getColorValor(item.key, datos[item.key]) }]}>
                        {datos[item.key].toFixed(item.step < 1 ? 1 : 0)} {item.unidad}
                      </Text>
                    </View>
                    <Slider
                      style={styles.slider}
                      minimumValue={item.min}
                      maximumValue={item.max}
                      value={datos[item.key]}
                      onValueChange={(value) => handleSliderChange(item.key, value)}
                      step={item.step}
                      minimumTrackTintColor={categoria.color}
                      maximumTrackTintColor="#E5E7EB"
                      thumbTintColor={categoria.color}
                    />
                    <View style={styles.sliderRango}>
                      <Text style={styles.rangoTexto}>{item.min}</Text>
                      <Text style={styles.rangoTexto}>{item.max}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))}

          <View style={styles.card}>
            <View style={[styles.cardHeader, { backgroundColor: '#F97316' }]}>
              <Text style={styles.cardHeaderEmoji}>🍽️</Text>
              <Text style={styles.cardHeaderTitulo}>Tipo de Dieta</Text>
            </View>
            <View style={styles.cardBody}>
              <View style={styles.dietaGrid}>
                {opcionesDieta.map((opcion) => (
                  <TouchableOpacity
                    key={opcion.valor}
                    style={[
                      styles.dietaBoton,
                      datos.TipoDeDieta === opcion.valor && { 
                        backgroundColor: opcion.color,
                        borderColor: opcion.color
                      }
                    ]}
                    onPress={() => handleSliderChange('TipoDeDieta', opcion.valor)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.dietaEmoji}>{opcion.emoji}</Text>
                    <Text style={[
                      styles.dietaTexto,
                      datos.TipoDeDieta === opcion.valor && styles.dietaTextoActivo
                    ]}>
                      {opcion.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={[styles.cardHeader, { backgroundColor: '#14B8A6' }]}>
              <Text style={styles.cardHeaderEmoji}>❤️</Text>
              <Text style={styles.cardHeaderTitulo}>Condiciones</Text>
            </View>
            <View style={styles.cardBody}>
              {opcionesBinarias.map((opcion) => (
                <View key={opcion.key} style={styles.opcionBinaria}>
                  <View style={styles.opcionBinariaLabel}>
                    <Text style={styles.opcionBinariaEmoji}>{opcion.icon}</Text>
                    <Text style={styles.opcionBinariaTexto}>{opcion.label}</Text>
                  </View>
                  <View style={styles.botonesToggle}>
                    <TouchableOpacity
                      style={[
                        styles.botonToggle,
                        datos[opcion.key] === 0 && styles.botonToggleNoActivo
                      ]}
                      onPress={() => handleSliderChange(opcion.key, 0)}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.textoToggle,
                        datos[opcion.key] === 0 && styles.textoToggleActivo
                      ]}>
                        No
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.botonToggle,
                        datos[opcion.key] === 1 && styles.botonToggleSiActivo
                      ]}
                      onPress={() => handleSliderChange(opcion.key, 1)}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.textoToggle,
                        datos[opcion.key] === 1 && styles.textoToggleActivo
                      ]}>
                        Sí
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {resultado && (
            <View style={[
              styles.cardResultado,
              { backgroundColor: 
                resultado.mensaje && resultado.mensaje.includes('riesgo alto') ? '#EF4444' :
                resultado.mensaje && resultado.mensaje.includes('riesgo moderado') ? '#F59E0B' :
                '#10B981'
              }
            ]}>
              <Text style={styles.resultadoEmoji}>
                {resultado.mensaje && resultado.mensaje.includes('riesgo alto') ? '⚠️' :
                 resultado.mensaje && resultado.mensaje.includes('riesgo moderado') ? '⚡' : '✅'}
              </Text>
              <Text style={styles.resultadoTitulo}>Resultado</Text>
              <Text style={styles.resultadoMensaje}>
                {resultado.mensaje || 'Predicción completada'}
              </Text>
              <View style={styles.resultadoProbabilidad}>
                <Text style={styles.resultadoProbabilidadLabel}>Probabilidad de Diabetes</Text>
                <Text style={styles.resultadoProbabilidadValor}>
                  {resultado.probabilidad_diabetes !== undefined 
                    ? `${(resultado.probabilidad_diabetes * 100).toFixed(1)}%`
                    : 'N/A'}
                </Text>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={[styles.botonEnviar, loading && styles.botonEnviarDisabled]}
            onPress={handleEnviar}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#FFF" size="small" />
                <Text style={styles.textoBotonEnviar}> Analizando...</Text>
              </View>
            ) : (
              <Text style={styles.textoBotonEnviar}>📊 Obtener Predicción</Text>
            )}
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  containerInicio: {
    flex: 1,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cardConexion: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  iconoGrande: {
    alignItems: 'center',
    marginBottom: 16,
  },
  emojiGrande: {
    fontSize: 64,
  },
  tituloGrande: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  labelInput: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFF',
    color: '#1F2937',
  },
  botonConectar: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  textoBotonConectar: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    backgroundColor: '#4F46E5',
    paddingTop: 48,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitulo: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitulo: {
    color: '#C7D2FE',
    fontSize: 14,
    marginTop: 4,
  },
  botonDesconectar: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  textoDesconectar: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  contenido: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  cardHeaderEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  cardHeaderTitulo: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardBody: {
    padding: 16,
  },
  sliderContainer: {
    marginBottom: 20,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sliderLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  sliderValor: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderRango: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -8,
  },
  rangoTexto: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  dietaGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dietaBoton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  dietaEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  dietaTexto: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
  },
  dietaTextoActivo: {
    color: '#FFF',
  },
  opcionBinaria: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 12,
  },
  opcionBinariaLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  opcionBinariaEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  opcionBinariaTexto: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
  },
  botonesToggle: {
    flexDirection: 'row',
  },
  botonToggle: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
    marginLeft: 8,
  },
  botonToggleNoActivo: {
    backgroundColor: '#EF4444',
  },
  botonToggleSiActivo: {
    backgroundColor: '#10B981',
  },
  textoToggle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  textoToggleActivo: {
    color: '#FFF',
  },
  cardResultado: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  resultadoEmoji: {
    fontSize: 64,
    marginBottom: 8,
  },
  resultadoTitulo: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultadoMensaje: {
    color: '#FFF',
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  resultadoProbabilidad: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 16,
  },
  resultadoProbabilidadLabel: {
    color: '#FFF',
    fontSize: 12,
    opacity: 0.9,
    textAlign: 'center',
  },
  resultadoProbabilidadValor: {
    color: '#FFF',
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  botonEnviar: {
    backgroundColor: '#6366F1',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  botonEnviarDisabled: {
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textoBotonEnviar: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});