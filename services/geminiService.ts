import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateWod = async (input: string, mode: 'create' | 'format'): Promise<string> => {
  try {
    let prompt = "";
    
    if (mode === 'create') {
      prompt = `
        Actúa como un entrenador de CrossFit de clase mundial.
        Crea un entrenamiento (WOD) desafiante basado en la siguiente solicitud del usuario: "${input}".
        Si la solicitud está vacía, crea un WOD "del día" aleatorio pero bien estructurado.
        
        Estructura la respuesta estrictamente en formato Markdown con estas secciones:
        ##  calentamiento
        ## Fuerza/Habilidad
        ## WOD (Metcon) - Especifica si es AMRAP, EMOM o For Time.
        ## Vuelta a la calma / Estiramiento
        
        Mantén el tono motivador pero conciso.
      `;
    } else {
      prompt = `
        Actúa como un entrenador de CrossFit.
        Toma el siguiente texto de programación desordenado y formatéalo limpiamente usando Markdown para que sea fácil de leer en un teléfono móvil.
        Resalta los pesos y movimientos clave.
        
        Texto original:
        "${input}"
      `;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    return response.text || "No se pudo generar el contenido. Intenta de nuevo.";
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "Error al conectar con el entrenador IA. Por favor verifica tu conexión.";
  }
};

export const getAiAdvice = async (rm: number, movement: string): Promise<string> => {
    try {
        const prompt = `
            Un atleta tiene un 1RM (Repetición Máxima) de ${rm} libras en ${movement}.
            Dame 3 consejos breves y tácticos para mejorar este levantamiento específico.
            Sé breve, usa viñetas.
        `;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });

        return response.text || "Consejos no disponibles.";
    } catch (e) {
        return "No se pudieron cargar los consejos.";
    }
}
