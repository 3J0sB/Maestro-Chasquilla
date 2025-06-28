'use client';

import PublicHeader from '@/components/layout/publicHeader';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function Verify() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutos en segundos
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  // Temporizador de expiración
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // Formatear tiempo restante
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Manejar cambios en los inputs
  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');

    // Auto-focus al siguiente input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Manejar teclas especiales
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Pegar código completo
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length === 6) {
      setCode(pastedData.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  // Verificar código
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');
    
    if (fullCode.length !== 6) {
      setError('Por favor, ingresa el código completo de 6 dígitos');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token: fullCode,
          email: email 
        }),
      });

      const data = await response.json();
      console.log('Response data:', data);
      if (response.ok) {
        
        router.push(`/password-recovery/reset?token=${data.resetToken}`);
      } else {
        setError(data.message || 'Código inválido o expirado');
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reenviar código
  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/password-recovery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setTimeLeft(600); // Reiniciar timer
        setCode(['', '', '', '', '', '']);
        setError('');
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      setError('Error al reenviar el código');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />
      
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-md p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Verificar código
              </h1>
              <p className="text-gray-600">
                Ingresa el código de 6 dígitos que enviamos a tu correo electrónico
              </p>
            </div>

            {/* Timer */}
            <div className="text-center mb-6">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                timeLeft > 120 ? 'bg-green-100 text-green-800' : 
                timeLeft > 60 ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'
              }`}>
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {timeLeft > 0 ? `Expira en ${formatTime(timeLeft)}` : 'Código expirado'}
              </div>
            </div>

            {/* Code Input Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                  Código de verificación
                </label>
                <div className="flex justify-center space-x-2" onPaste={handlePaste}>
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el; }}
                      type="text"
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      maxLength={1}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      autoComplete="off"
                    />
                  ))}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={code.join('').length !== 6 || isLoading || timeLeft === 0}
                className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verificando...
                  </>
                ) : (
                  'Verificar código'
                )}
              </button>
            </form>

            {/* Resend Code */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-2">
                ¿No recibiste el código?
              </p>
              <button
                onClick={handleResendCode}
                disabled={isLoading || timeLeft > 540} // No permitir reenvío hasta que pasen 1 minuto
                className="text-orange-600 hover:text-orange-700 font-medium text-sm disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                Reenviar código
              </button>
            </div>

            {/* Back to recovery */}
            <div className="mt-6 text-center">
              <Link
                href="/password-recovery"
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Cambiar correo electrónico
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Verify;