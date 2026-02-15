const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export interface DiagnosisResponse {
  diagnosis: string;
  recommendations: string[];
  severity: 'low' | 'medium' | 'high';
}

export const analyzeSymptoms = async (symptoms: string, imageBase64?: string): Promise<DiagnosisResponse> => {
  if (!GEMINI_API_KEY) {
    throw new Error("AI Configuration Missing: Please add VITE_GEMINI_API_KEY to your .env file.");
  }

  console.log('[AI] Requesting analysis for:', symptoms || "Image only");

  const systemPrompt = `
    You are an AI Symptom Analyzer for the HealthMonitor app.
    Instructions:
    1. Analyze the symptoms provided in text and/or the uploaded image showing a health concern (e.g., skin rash, swelling, pill identification).
    2. Provide a preliminary "Clinical Impression" or "Diagnosis Label".
    3. List 3-4 actionable "Recommendations".
    4. Categorize the "Severity" as one of: [low, medium, high].
    5. CRITICAL: If the symptoms suggest a life-threatening emergency, set severity to "high" and advise immediate medical attention.
    6. Always include a disclaimer: "Not a replacement for professional medical advice."
    7. Format the response as a JSON object:
       {
         "diagnosis": "Short label",
         "recommendations": ["Point 1", "Point 2", ...],
         "severity": "low|medium|high"
       }
    8. Return ONLY the JSON object.
  `;

  const promptText = symptoms 
    ? `User Symptoms: ${symptoms}`
    : "Please analyze this health-related image.";

  const body: any = {
    contents: [{
      parts: [
        { text: `${systemPrompt}\n\n${promptText}` }
      ]
    }]
  };

  if (imageBase64) {
    // Remove data:image/png;base64, prefix if present
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    body.contents[0].parts.push({
      inline_data: {
        mime_type: "image/jpeg",
        data: cleanBase64
      }
    });
  }

  try {
    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    
    if (!response.ok) {
        console.error('[Gemini] AI Error Response:', data);
        throw new Error(data.error?.message || `API Error: ${response.status}`);
    }

    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    
    // Clean JSON from possible markdown wrappers
    const cleanedJson = aiResponse.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleanedJson) as DiagnosisResponse;

    return {
      diagnosis: parsed.diagnosis || "Refined Analysis Complete",
      recommendations: parsed.recommendations || ["Consult a doctor if symptoms persist."],
      severity: parsed.severity || "low"
    };
  } catch (error: any) {
    console.error('[Gemini] Analysis Fetch Error:', error);
    // Fallback to basic response
    return {
      diagnosis: "AI Analysis Temporarily Unavailable",
      recommendations: [
        "Please check your internet connection.",
        "Seek medical advice if your condition is serious.",
        "Try again later."
      ],
      severity: 'medium'
    };
  }
};
