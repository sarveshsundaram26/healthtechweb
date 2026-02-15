import { createContext, useContext, useState, type ReactNode } from 'react';

export type Language = 'en' | 'ta' | 'es' | 'hi';

interface Translations {
  [key: string]: {
    [K in Language]: string;
  };
}

export const translations: Translations = {
  // Common
  save: { en: 'Save', ta: 'சேமி', es: 'Guardar', hi: 'सहेजें' },
  loading: { en: 'Loading...', ta: 'ஏற்றுகிறது...', es: 'Cargando...', hi: 'लोड हो रहा है...' },
  error: { en: 'Error', ta: 'பிழை', es: 'Error', hi: 'त्रुटि' },
  success: { en: 'Success', ta: 'வெற்றி', es: 'Éxito', hi: 'சफलता' },
  thinking: { en: 'Thinking...', ta: 'யோசிக்கிறது...', es: 'Pensando...', hi: 'सोच रहा है...' },
  notice: { en: 'Notice', ta: 'அறிவிப்பு', es: 'Aviso', hi: 'सूचना' },
  active: { en: 'Active', ta: 'செயலில்', es: 'Activo', hi: 'सक्रिय' },
  view_profile: { en: 'View Profile', ta: 'சுயவிவரத்தைப் பார்க்கவும்', es: 'Ver Perfil', hi: 'प्रोफ़ाइल देखें' },

  // Sidebar
  dashboard: { en: 'Dashboard', ta: 'டாஷ்போர்டு', es: 'Tablero', hi: 'डैशबोर्ड' },
  reminders: { en: 'Reminders', ta: 'நினைவூட்டல்கள்', es: 'Recordatorios', hi: 'अनुस्मारक' },
  chat: { en: 'AI Chat', ta: 'AI அரட்டை', es: 'Chat de IA', hi: 'एआई चैट' },
  emergency: { en: 'Emergency', ta: 'அவசரம்', es: 'Emergencia', hi: 'आப்பாத்காலீன்' },
  patient_directory: { en: 'Patient Directory', ta: 'நோயாளி அடைவு', es: 'Directorio de Pacientes', hi: 'रोगी निर्देशिका' },
  system_logs: { en: 'System Logs', ta: 'கணினி பதிவுகள்', es: 'Registros del Sistema', hi: 'सिस्टम लॉग' },
  my_profile: { en: 'My Profile', ta: 'எனது சுயவிவரம்', es: 'Mi Perfil', hi: 'मेरी प्रोफाइल' },
  sign_out: { en: 'Sign Out', ta: 'வெளியேறு', es: 'Cerrar Sesión', hi: 'சையன் அவுட்' },

  // Auth
  login_title: { en: 'Login', ta: 'உள்நுழைவு', es: 'Iniciar Sesión', hi: 'लॉग इन करें' },
  patient_login: { en: 'Patient Login', ta: 'நோயாளி உள்நுழைவு', es: 'Inicio de Sesión del Paciente', hi: 'रोगी लॉगिन' },
  doctor_login: { en: 'Doctor/Admin Login', ta: 'மருத்துவர்/நிர்வாகி உள்நுழைவு', es: 'Inicio de Sesión de Doctor/Admin', hi: 'டாக்டர்/அட்மின் லாகின்' },
  welcome_back: { en: 'Welcome Back', ta: 'மீண்டும் வருக', es: 'Bienvenido de nuevo', hi: 'वापस स्वागत है' },
  sign_in: { en: 'Sign In', ta: 'உள்நுழையவும்', es: 'Ingresar', hi: 'साइन इन' },
  email_address: { en: 'Email Address', ta: 'மின்னஞ்சல் முகவரி', es: 'Correo Electrónico', hi: 'ईमेल पता' },
  password: { en: 'Password', ta: 'கடவுச்சொல்', es: 'Contraseña', hi: 'पासवर्ड' },
  new_here: { en: 'New here?', ta: 'இங்கு புதியவரா?', es: '¿Eres nuevo aquí?', hi: 'यहाँ नए हैं?' },
  create_account: { en: 'Create an account', ta: 'கணக்கை உருவாக்கு', es: 'Crear una cuenta', hi: 'खाता बनाएं' },

  // Dashboards
  medical_overview: { en: 'Medical Overview', ta: 'மருத்துவக் கண்ணோட்டம்', es: 'Resumen Médico', hi: 'மெடிக்கல் மேலோட்டம்' },
  system_monitoring_msg: { en: 'System monitoring and patient management active.', ta: 'கணினி கண்காணிப்பு மற்றும் நோயாளி மேலாண்மை செயல்பாட்டில் உள்ளது.', es: 'Monitoreo del sistema y gestión de pacientes activos.', hi: 'सिस्टम निगरानी और रोगी प्रबंधन सक्रिय।' },
  total_patients: { en: 'Total Patients', ta: 'மொத்த நோயாளிகள்', es: 'Total de Pacientes', hi: 'कुल रोगी' },
  critical_alerts: { en: 'Critical Alerts', ta: 'முக்கிய எச்சரிக்கைகள்', es: 'Alertas Críticas', hi: 'महत्वपूर्ण अलर्ट' },
  pending_reviews: { en: 'Pending Reviews', ta: 'நிலுவையில் உள்ள மதிப்பாய்வுகள்', es: 'Revisiones Pendientes', hi: 'लंबित समीक्षाएं' },
  system_status: { en: 'System Status', ta: 'கணினி நிலை', es: 'Estado del Sistema', hi: 'सिस्टम स्थिति' },
  quick_actions: { en: 'Quick Actions', ta: 'விரைவான செயல்கள்', es: 'Acciones Rápidas', hi: 'त्वरित कार्रवाई' },
  new_registration: { en: 'New Registration', ta: 'புதிய பதிவு', es: 'Nuevo Registro', hi: 'नया पंजीकरण' },
  generate_report: { en: 'Generate Report', ta: 'அறிக்கை உருவாக்கு', es: 'Generar Informe', hi: 'ரிப்போர்ட் ஜெனரேட் செய்யவும்' },
  clinic_schedule: { en: 'Clinic Schedule', ta: 'மருத்துவமனை அட்டவணை', es: 'Horario de la Clínica', hi: 'கிளினிக் ஸ்கெட்யூல்' },
  db_sync_notice: { en: 'Database synchronization will occur at 12:00 AM UTC. Please ensure all records are saved.', ta: 'தரவுத்தள ஒத்திசைவு நள்ளிரவு 12:00 மணிக்கு (UTC) நிகழும். அனைத்து பதிவுகளும் சேமிக்கப்பட்டுள்ளதா என்பதை உறுதிப்படுத்தவும்.', es: 'La sincronización de la base de datos ocurrirá a las 12:00 AM UTC. Asegúrese de que todos los registros estén guardados.', hi: 'डेटाबेस सिंक्रोनाइज़ेशन 12:00 AM UTC पर होगा। कृपया सुनिश्चित करें कि सभी रिकॉर्ड सहेजे गए हैं।' },

  // Reminders
  medicine_schedule: { en: 'Medicine Schedule', ta: 'மருந்து அட்டவணை', es: 'Horario de Medicamentos', hi: 'दवा का शेड्यूल' },
  medication_stay_on_track: { en: 'Stay on track with your medication.', ta: 'உங்கள் மருந்துகளை சரியான நேரத்தில் எடுத்துக் கொள்ளுங்கள்.', es: 'Manténgase al día con su medicación.', hi: 'अपनी दवा के साथ ट्रैक पर रहें।' },
  upcoming: { en: 'Upcoming', ta: 'வரவிருக்கும்', es: 'Próximo', hi: 'आगामी' },
  add_reminder: { en: 'Add Reminder', ta: 'நினைவூட்டலைச் சேர்', es: 'Añadir Recordatorio', hi: 'अनुस्मारक जोड़ें' },
  your_reminders: { en: 'Your Reminders', ta: 'உங்கள் நினைவூட்டல்கள்', es: 'Sus Recordatorios', hi: 'आपके अनुस्मारक' },
  chronological_view: { en: 'Chronological View', ta: 'காலவரிசை பார்வை', es: 'Vista Cronológica', hi: 'कालानुक्रमिक दृश्य' },

  // Emergency
  emergency_center: { en: 'Emergency Center', ta: 'அவசர சிகிச்சை மையம்', es: 'Centro de Emergencias', hi: 'आपातकालीन केंद्र' },
  critical_safety_tools: { en: 'Critical safety tools and emergency coordination.', ta: 'முக்கிய பாதுகாப்பு கருவிகள் மற்றும் அவசர ஒருங்கிணைப்பு.', es: 'Herramientas de seguridad críticas y coordinación de emergencias.', hi: 'महत्वपूर्ण सुरक्षा उपकरण और आपातकालीन समन्वय।' },
  active_monitoring: { en: 'Active Monitoring', ta: 'செயலில் கண்காணிப்பு', es: 'Monitoreo Activo', hi: 'सक्रिय निगरानी' },

  // Patient List
  search_patients: { en: 'Search patients by name or username...', ta: 'பெயர் அல்லது பயனர் பெயர் மூலம் நோயாளிகளைத் தேடுங்கள்...', es: 'Buscar pacientes por nombre o usuario...', hi: 'नाम या उपयोगकर्ता नाम से रोगियों को खोजें...' },
  no_patients_found: { en: 'No patients found', ta: 'நோயாளிகள் யாரும் காணப்படவில்லை', es: 'No se encontraron pacientes', hi: 'कोई रोगी नहीं मिला' },
  anonymous_patient: { en: 'Anonymous Patient', ta: 'அநாமதேய நோயாளி', es: 'Paciente Anónimo', hi: 'அநாமதேய நோயாளி' },

  // AI & Vitals
  health_stable_msg: { en: 'Your health metrics are looking stable today.', ta: 'உங்கள் ஆரோக்கிய அளவீடுகள் இன்று சீராக உள்ளன.', es: 'Tus métricas de salud se ven estables hoy.', hi: 'आपके स्वास्थ्य मेट्रिक्स आज स्थिर लग रहे हैं।' },
  record_vitals: { en: 'Record Vitals', ta: 'உடல் நிலையைப் பதிவு செய்யவும்', es: 'Registrar Vitales', hi: 'महत्वपूर्ण लक्षण रिकॉर्ड करें' },
  vitals_history: { en: 'Vitals History', ta: 'உடல் நிலை வரலாறு', es: 'Historial de Vitales', hi: 'महत्वपूर्ण लक्षणों का इतिहास' },
  ai_diagnostic_assistant: { en: 'AI Diagnostic Assistant', ta: 'AI நோயறிதல் உதவியாளர்', es: 'Asistente de Diagnóstico de IA', hi: 'एஐ நோயறிதல் உதவியாளர்' },
  describe_symptoms: { en: 'Describe Symptoms or Upload Photo', ta: 'அறிகுறிகளை விவரிக்கவும் அல்லது புகைப்படத்தைப் பதிவேற்றவும்', es: 'Describe síntomas o sube foto', hi: 'लक्षणों का वर्णन करें या फोटो अपलोड करें' },
  symptom_placeholder: { en: 'E.g., I have a skin rash on my arm...', ta: 'உதாரணமாக, எனது கையில் ஒரு தோல் தடிப்பு உள்ளது...', es: 'Ej., tengo una erupción en el brazo...', hi: 'उदाहरण के लिए, मेरे हाथ पर त्वचा पर लाल चकत्ते हैं...' },
  get_analysis: { en: 'Analyze Health Data', ta: 'சுகாதாரத் தரவைப் பகுப்பாய்வு செய்க', es: 'Analizar Datos de Salud', hi: 'स्वास्थ्य डेटा का विश्लेषण करें' },
  ai_companion_msg: { en: 'Instant answers to your health queries in any language.', ta: 'எந்த மொழியிலும் உங்கள் சுகாதார வினவல்களுக்கு உடனடி பதில்கள்.', es: 'Respuestas instantáneas a tus consultas de salud en cualquier idioma.', hi: 'எந்த மொழியிலும் உங்கள் சுகாதார வினவல்களுக்கு உடனடி பதில்கள்' },
  upload_photo: { en: 'Upload Photo', ta: 'புகைப்படத்தைப் பதிவேற்றவும்', es: 'Subir Foto', hi: 'फोटो अपलोड करें' },
  take_photo: { en: 'Take Photo', ta: 'புகைப்படம் எடுக்கவும்', es: 'Tomar Foto', hi: 'फोटो लें' },
  analyzing: { en: 'Analyzing...', ta: 'பகுப்பாய்வு செய்கிறது...', es: 'Analizando...', hi: 'विश्लेषण कर रहा है...' },

  // Profile
  account_settings: { en: 'Account Settings', ta: 'கணக்கு அமைப்புகள்', es: 'Ajustes de Cuenta', hi: 'கணக்கு அமைப்புகள்' },
  full_name: { en: 'Full Name', ta: 'முழு பெயர்', es: 'Nombre Completo', hi: 'முழு பெயர்' },
  username: { en: 'Username', ta: 'பயனர் பெயர்', es: 'Nombre de usuario', hi: 'பயனர் பெயர்' },
  save_changes: { en: 'Save Changes', ta: 'மாற்றங்களைச் சேமி', es: 'Guardar cambios', hi: 'மாற்றங்களைச் சேமி' },
  security_info: { en: 'Security Info', ta: 'பாதுகாப்பு தகவல்', es: 'Información de Seguridad', hi: 'பாதுகாப்பு தகவல்' },
  change_password: { en: 'Change Password', ta: 'கடவுச்சொல்லை மாற்றவும்', es: 'Cambiar Contraseña', hi: 'கடவுச்சொல்லை மாற்றவும்' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
