import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
  disabled?: boolean;
}

interface VoiceState {
  isListening: boolean;
  isProcessing: boolean;
  processingStep: number;
  isSupported: boolean;
}

const processingSteps = [
  { icon: '🔊', text: 'Recognizing Speech...' },
  { icon: '🌐', text: 'Translating to English...' },
  { icon: '✨', text: 'Refining Idea...' }
];

// Waveform component for visual feedback
const Waveform = ({ isActive, amplitude, isSpeaking }: { isActive: boolean; amplitude: number; isSpeaking: boolean }) => {
  const bars = Array.from({ length: 20 }, (_, i) => i);
  
  return (
    <div className="flex items-center justify-center gap-1 h-4 mt-2">
      {bars.map((bar) => {
        // Create more natural waveform pattern
        let height = 2; // Default flat line
        
        if (isSpeaking && amplitude > 0.01) {
          // Create wave pattern based on bar position and amplitude
          const wavePhase = (bar / 20) * Math.PI * 2;
          const waveAmplitude = amplitude * 0.8 + 0.2; // Ensure minimum height
          const waveHeight = Math.sin(wavePhase + Date.now() * 0.01) * waveAmplitude;
          height = Math.max(2, Math.abs(waveHeight) * 12 + 2);
        } else if (isActive && !isSpeaking) {
          // Gentle idle pulse
          height = 2 + Math.sin(Date.now() * 0.005 + bar * 0.5) * 0.5;
        }
        
        return (
          <motion.div
            key={bar}
            className="bg-primary/60 rounded-full"
            style={{ width: 2 }}
            animate={{
              height: height,
              opacity: isActive ? (isSpeaking ? 0.9 : 0.4) : 0.3
            }}
            transition={{
              duration: isSpeaking ? 0.05 : 0.3,
              ease: "easeOut"
            }}
          />
        );
      })}
    </div>
  );
};

export default function VoiceInput({ 
  value, 
  onChange, 
  placeholder = "e.g., Eco-friendly t-shirt brand for young professionals",
  className = "",
  rows = 3,
  disabled = false
}: VoiceInputProps) {
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isListening: false,
    isProcessing: false,
    processingStep: 0,
    isSupported: false
  });
  
  const [amplitude, setAmplitude] = useState(0);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(placeholder);
  const [isIdle, setIsIdle] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userStopped, setUserStopped] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const amplitudeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Check for speech recognition support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setVoiceState(prev => ({ ...prev, isSupported: true }));
      
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'hi-IN'; // Default to Hindi, but can detect other languages
      
      recognitionRef.current.onstart = () => {
        setVoiceState(prev => ({ ...prev, isListening: true }));
        setCurrentPlaceholder("Listening... feel free to speak in any language.");
        setIsIdle(false);
        setIsSpeaking(false);
        startAudioAnalysis();
      };
      
      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        // If we have any transcript (interim or final), user is speaking
        if (interimTranscript || finalTranscript) {
          setIsSpeaking(true);
          // Clear any existing silence timeout
          if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
          }
          // Set a timeout to detect silence
          silenceTimeoutRef.current = setTimeout(() => {
            setIsSpeaking(false);
          }, 1500); // 1.5 seconds of silence
        }
        
        if (interimTranscript) {
          setCurrentPlaceholder(`You said: "${interimTranscript}"`);
        }
        
        if (finalTranscript) {
          processVoiceInput(finalTranscript);
        }
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setUserStopped(true);
        setVoiceState(prev => ({ ...prev, isListening: false, isProcessing: false }));
        stopAudioAnalysis();
        setIsIdle(true);
        setIsSpeaking(false);
        setCurrentPlaceholder(placeholder);
      };
      
      recognitionRef.current.onend = () => {
        // Only stop if the user didn't manually stop it
        if (!userStopped) {
          // Restart recognition automatically to keep listening
          setTimeout(() => {
            if (recognitionRef.current && voiceState.isListening) {
              try {
                recognitionRef.current.start();
              } catch (error) {
                console.log('Recognition restart failed:', error);
                // If restart fails, stop listening
                setVoiceState(prev => ({ ...prev, isListening: false }));
                stopAudioAnalysis();
                setIsIdle(true);
                setIsSpeaking(false);
              }
            }
          }, 100);
        } else {
          // User manually stopped, so actually stop
          setVoiceState(prev => ({ ...prev, isListening: false }));
          stopAudioAnalysis();
          setIsIdle(true);
          setIsSpeaking(false);
          setUserStopped(false);
        }
      };
    }
  }, []);

  const stopAudioAnalysis = useCallback(() => {
    // Stop animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    // Stop interval
    if (amplitudeIntervalRef.current) {
      clearInterval(amplitudeIntervalRef.current);
      amplitudeIntervalRef.current = null;
    }
    
    // Clear timeouts
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
    
    // Disconnect audio
    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
      microphoneRef.current = null;
    }
    
    if (analyserRef.current) {
      analyserRef.current.disconnect();
      analyserRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    setAmplitude(0);
    setAudioLevel(0);
    setIsSpeaking(false);
  }, []);

  // Cleanup audio resources on unmount
  useEffect(() => {
    return () => {
      stopAudioAnalysis();
    };
  }, [stopAudioAnalysis]);

  const startAudioAnalysis = async () => {
    try {
      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      // Create audio context
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
      
      // Configure analyser
      analyserRef.current.fftSize = 256;
      analyserRef.current.smoothingTimeConstant = 0.8;
      
      // Connect microphone to analyser
      microphoneRef.current.connect(analyserRef.current);
      
      // Start audio analysis loop
      analyzeAudio();
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      // Fallback to simulation if microphone access fails
      startAmplitudeSimulation();
    }
  };

  const analyzeAudio = () => {
    if (!analyserRef.current) return;
    
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const analyze = () => {
      if (!analyserRef.current) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Calculate average amplitude
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const average = sum / bufferLength;
      const normalizedAmplitude = average / 255; // Normalize to 0-1
      
      // Update amplitude with smoothing
      setAudioLevel(normalizedAmplitude);
      
      // Use the actual audio level for waveform animation
      if (isSpeaking) {
        setAmplitude(normalizedAmplitude);
      } else {
        // Gradually reduce amplitude when not speaking
        setAmplitude(prev => Math.max(0, prev * 0.8));
      }
      
      // Continue analysis
      animationFrameRef.current = requestAnimationFrame(analyze);
    };
    
    analyze();
  };

  const startAmplitudeSimulation = () => {
    amplitudeIntervalRef.current = setInterval(() => {
      // Fallback simulation when microphone access fails
      if (isSpeaking) {
        setAmplitude(Math.random() * 0.8 + 0.2);
      } else {
        setAmplitude(0.1);
      }
    }, 100);
  };

  const processVoiceInput = async (transcript: string) => {
    setVoiceState(prev => ({ ...prev, isProcessing: true, processingStep: 0 }));
    setIsSpeaking(false); // Stop speaking animation during processing
    
    // Simulate processing steps
    for (let step = 0; step < processingSteps.length; step++) {
      setVoiceState(prev => ({ ...prev, processingStep: step }));
      setCurrentPlaceholder(`[ ${processingSteps[step].icon} ${processingSteps[step].text} ]`);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    // Simulate AI translation and refinement
    const refinedIdea = await simulateAITranslation(transcript);
    
    // Set the final result
    onChange(refinedIdea);
    setCurrentPlaceholder(placeholder);
    setVoiceState(prev => ({ ...prev, isProcessing: false, processingStep: 0 }));
  };

  const simulateAITranslation = async (transcript: string): Promise<string> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock translation and refinement logic
    const translations: Record<string, string> = {
      // Hindi to English
      'व्यापार': 'business',
      'कंपनी': 'company',
      'स्टार्टअप': 'startup',
      'उत्पाद': 'product',
      'सेवा': 'service',
      'ब्रांड': 'brand',
      'टी-शर्ट': 't-shirt',
      'कपड़े': 'clothing',
      'भोजन': 'food',
      'कॉफी': 'coffee',
      'दुकान': 'shop',
      'स्टोर': 'store',
      
      // Telugu
      'వ్యాపారం': 'business',
      'కంపెనీ': 'company',
      'ఉత్పత్తి': 'product',
      
      // Tamil
      'வணிகம்': 'business',
      'நிறுவனம்': 'company',
      'தயாரிப்பு': 'product',
      
      // Bengali
      'ব্যবসা': 'business',
      'কোম্পানি': 'company',
      'পণ্য': 'product',
      
      // Marathi
      'व्यवसाय': 'business',
      'उत्पादन': 'product',
      
      // Gujarati
      'વ્યવસાય': 'business',
      'કંપની': 'company',
      'ઉત્પાદન': 'product',
      
      // Kannada
      'ವ್ಯವಹಾರ': 'business',
      'ಕಂಪನಿ': 'company',
      'ಉತ್ಪನ್ನ': 'product',
      
      // Malayalam
      'വ്യവസായം': 'business',
      'കമ്പനി': 'company',
      'ഉൽപ്പന്നം': 'product',
      
      // Punjabi
      'ਵਪਾਰ': 'business',
      'ਕੰਪਨੀ': 'company',
      'ਉਤਪਾਦ': 'product',
      
      // Odia
      'ବ୍ୟବସାୟ': 'business',
      'କମ୍ପାନୀ': 'company',
      'ଉତ୍ପାଦ': 'product'
    };
    
    // Simple mock translation (in real implementation, use actual translation API)
    let refinedIdea = transcript;
    
    // Apply translations
    Object.entries(translations).forEach(([regional, english]) => {
      if (transcript.toLowerCase().includes(regional.toLowerCase())) {
        refinedIdea = refinedIdea.replace(new RegExp(regional, 'gi'), english);
      }
    });
    
    // Add business context refinement
    const businessKeywords = ['business', 'startup', 'company', 'service', 'product', 'brand', 'shop', 'store'];
    const hasBusinessContext = businessKeywords.some(keyword => 
      refinedIdea.toLowerCase().includes(keyword)
    );
    
    if (!hasBusinessContext) {
      refinedIdea = `A business idea: ${refinedIdea}`;
    }
    
    // Capitalize first letter and improve formatting
    refinedIdea = refinedIdea.charAt(0).toUpperCase() + refinedIdea.slice(1);
    
    // Clean up extra spaces
    refinedIdea = refinedIdea.replace(/\s+/g, ' ').trim();
    
    return refinedIdea;
  };

  const startListening = () => {
    if (recognitionRef.current && voiceState.isSupported) {
      setUserStopped(false);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    setUserStopped(true);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setCurrentPlaceholder(placeholder);
    setVoiceState(prev => ({ ...prev, isListening: false, isProcessing: false }));
    stopAudioAnalysis();
    setIsIdle(true);
    setIsSpeaking(false);
  };

  const handleMicClick = () => {
    if (voiceState.isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const isVoiceActive = voiceState.isListening || voiceState.isProcessing;

  return (
    <div className="relative">
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={currentPlaceholder}
          className={`w-full mt-1 p-3 border border-border rounded-md resize-none pr-12 ${className}`}
          rows={rows}
          disabled={disabled || voiceState.isProcessing}
        />
        
        {/* Microphone Button */}
        {voiceState.isSupported && (
          <button
            type="button"
            onClick={handleMicClick}
            disabled={disabled || voiceState.isProcessing}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-200 ${
              isVoiceActive
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            title={voiceState.isListening ? 'Stop listening' : 'Start voice input'}
          >
            <motion.div
              animate={{
                scale: voiceState.isListening ? [1, 1.1, 1] : 1,
              }}
              transition={{
                duration: 1,
                repeat: voiceState.isListening ? Infinity : 0,
                ease: "easeInOut"
              }}
            >
              {voiceState.isListening ? (
                <Mic className="h-4 w-4" />
              ) : (
                <MicOff className="h-4 w-4" />
              )}
            </motion.div>
          </button>
        )}
      </div>

      {/* Waveform Animation */}
      <AnimatePresence>
        {isVoiceActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
             <Waveform isActive={voiceState.isListening} amplitude={amplitude} isSpeaking={isSpeaking} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Processing Status */}
      <AnimatePresence>
        {voiceState.isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-2 text-sm text-muted-foreground text-center"
          >
            <motion.div
              key={voiceState.processingStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              {processingSteps[voiceState.processingStep]?.text}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Support Notice */}
      {!voiceState.isSupported && (
        <div className="mt-2 text-xs text-muted-foreground">
          Voice input not supported in this browser. Please use Chrome, Edge, or Safari.
        </div>
      )}
    </div>
  );
}
