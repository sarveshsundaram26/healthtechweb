import { useState, useRef, useEffect } from 'react';
import { analyzeSymptoms, type DiagnosisResponse } from '../services/aiService';
import { AlertTriangle, CheckCircle, Info, Sparkles, Loader2, Image as ImageIcon, Camera, X, RefreshCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function SymptomChecker() {
  const { t } = useLanguage();
  const [symptoms, setSymptoms] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<DiagnosisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    setShowCamera(true);
    setResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' },
        audio: false 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Could not access camera. Please ensure permissions are granted.');
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setImage(dataUrl);
        stopCamera();
      }
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleAnalyze = async () => {
    if (!symptoms.trim() && !image) return;

    setLoading(true);
    setResult(null);
    console.log('[AI] Analyzing health data...');

    try {
      const response = await analyzeSymptoms(symptoms, image || undefined);
      setResult(response);
    } catch (error) {
      console.error('[AI] Analysis error:', error);
      alert('AI processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <label htmlFor="symptoms" className="block text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
          {t('describe_symptoms') || 'Describe Symptoms or Upload Photo'}
        </label>
        
        <div className="relative group">
          <textarea
            id="symptoms"
            rows={4}
            className="block w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all resize-none shadow-inner"
            placeholder={t('symptom_placeholder') || "E.g., I have a skin rash on my arm..."}
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
          />

          {/* Image Preview Overlay */}
          {image && (
            <div className="absolute right-4 bottom-4 animate-in fade-in zoom-in duration-200">
               <div className="relative group/img">
                  <img src={image} alt="Symptom" className="h-16 w-16 object-cover rounded-xl border-2 border-indigo-500 shadow-xl" />
                  <button 
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg opacity-0 group-hover/img:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
               </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/10 hover:text-white transition-all active:scale-95"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            {t('upload_photo') || 'Upload Photo'}
          </button>
          <button
             onClick={startCamera}
            className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/10 hover:text-white transition-all active:scale-95"
          >
            <Camera className="h-4 w-4 mr-2" />
            {t('take_photo') || 'Take Photo'}
          </button>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading || (!symptoms.trim() && !image)}
          className="w-full inline-flex items-center justify-center px-6 py-4 border border-transparent font-black uppercase tracking-widest text-xs rounded-2xl text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? (
             <Loader2 className="h-5 w-5 animate-spin mr-2" />
          ) : (
            <Sparkles className="h-4 w-4 mr-2" />
          )}
          {loading ? t('analyzing') || 'Analyzing...' : t('get_analysis') || 'Analyze Health Data'}
        </button>
      </div>

      {/* Live Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-4 md:p-8 animate-in fade-in duration-300">
          <div className="relative w-full max-w-2xl bg-slate-900 rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
               <h3 className="text-lg font-bold text-white flex items-center">
                  <Camera className="h-5 w-5 mr-3 text-indigo-400" />
                  Live Capture Analysis
               </h3>
               <button onClick={stopCamera} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="h-6 w-6 text-slate-400" />
               </button>
            </div>
            
            <div className="relative flex-1 bg-black aspect-video flex items-center justify-center overflow-hidden">
               <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover transform scale-x-[-1]"
               />
               <canvas ref={canvasRef} className="hidden" />
               
               {/* Viewfinder corner accents */}
               <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-white/30 rounded-tl-lg" />
               <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-white/30 rounded-tr-lg" />
               <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-white/30 rounded-bl-lg" />
               <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-white/30 rounded-br-lg" />
            </div>

            <div className="p-8 bg-white/5 flex flex-col items-center gap-4">
               <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Position the area of concern clearly</p>
               <button 
                onClick={capturePhoto}
                className="group relative h-20 w-20 bg-white rounded-full p-1 shadow-2xl hover:scale-105 active:scale-95 transition-all"
               >
                  <div className="h-full w-full rounded-full border-4 border-slate-900 flex items-center justify-center">
                     <div className="h-14 w-14 bg-indigo-600 rounded-full group-hover:bg-indigo-500 transition-colors shadow-inner flex items-center justify-center">
                        <RefreshCw className="h-6 w-6 text-white animate-pulse" />
                     </div>
                  </div>
               </button>
               <button onClick={stopCamera} className="text-sm font-bold text-slate-400 hover:text-white transition-colors">
                  Cancel
               </button>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className={`p-6 rounded-3xl border animate-fade-in-up ${
          result.severity === 'high' ? 'bg-red-500/10 border-red-500/20 shadow-red-500/5' :
          result.severity === 'medium' ? 'bg-amber-500/10 border-amber-500/20 shadow-amber-500/5' :
          'bg-blue-500/10 border-blue-500/20 shadow-blue-500/5'
        }`}>
          <div className="flex gap-4">
            <div className={`p-3 rounded-xl h-fit ${
              result.severity === 'high' ? 'bg-red-500/20 text-red-400' :
              result.severity === 'medium' ? 'bg-amber-500/20 text-amber-400' :
              'bg-blue-500/20 text-blue-400'
            }`}>
              {result.severity === 'high' ? (
                <AlertTriangle className="h-6 w-6 animate-pulse" />
              ) : result.severity === 'medium' ? (
                <Info className="h-6 w-6" />
              ) : (
                <Sparkles className="h-6 w-6" />
              )}
            </div>
            <div className="flex-1">
              <h3 className={`text-lg font-bold leading-tight mb-2 ${
                result.severity === 'high' ? 'text-red-300' :
                result.severity === 'medium' ? 'text-amber-300' :
                'text-blue-300'
              }`}>
                {result.diagnosis}
              </h3>
              <ul className="space-y-2">
                {result.recommendations.map((rec, index) => (
                   <li key={index} className="flex items-start text-sm text-slate-300">
                    <CheckCircle className={`h-4 w-4 mt-0.5 mr-2 shrink-0 ${
                       result.severity === 'high' ? 'text-red-500' :
                       result.severity === 'medium' ? 'text-amber-500' :
                       'text-blue-500'
                    }`} />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
