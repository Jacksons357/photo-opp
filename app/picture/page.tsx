'use client'
import { useRef, useState, useEffect } from "react";
import {Camera, CameraType} from "react-camera-pro";
import LoadingScreen from "../components/LoadingScreen";
import PhotoPreview from "../components/PhotoPreview";
import FinalPhoto from "../components/FinalPhoto";

export default function Picture() {
  const camera = useRef<CameraType>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [isRequesting, setIsRequesting] = useState(false)
  const [photo, setPhoto] = useState<string | null>(null)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [isCounting, setIsCounting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showFinalPhoto, setShowFinalPhoto] = useState(false)

  const errorMessages = {
    noCameraAccess: 'No camera access',
    permissionDenied: 'Permission denied',
    switchCamera: 'Switch camera error',
    canvas: 'Canvas error',
    scanFingerprint: 'Scan fingerprint error',
    stream: 'Stream error',
    getUserMedia: 'Get user media error',
    notSupported: 'Not supported',
    notReadable: 'Not readable',
    overconstrained: 'Overconstrained',
    last: 'Unknown error'
  }

  const requestCameraPermission = async () => {
    setIsRequesting(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      setHasPermission(true)
      stream.getTracks().forEach(track => track.stop())
    } catch (error) {
      console.error('Erro ao solicitar permissão de acesso à câmera:', error)
      setHasPermission(false)
    } finally {
      setIsRequesting(false)
    }
  }

  useEffect(() => {
    const checkAndRequestPermission = async () => {
      try {
        const permissionStatus = await navigator.permissions?.query({ name: 'camera' as PermissionName })
        
        if (permissionStatus?.state === 'granted') {
          setHasPermission(true)
        } else {
          setIsRequesting(true)
          const stream = await navigator.mediaDevices.getUserMedia({ video: true })
          setHasPermission(true)
          stream.getTracks().forEach(track => track.stop())
        }
        
        if (permissionStatus) {
          permissionStatus.onchange = () => {
            setHasPermission(permissionStatus.state === 'granted')
          }
        }
      } catch (error) {
        console.error('Erro ao solicitar permissão de acesso à câmera:', error)
        setHasPermission(false)
      } finally {
        setIsRequesting(false)
      }
    }

    checkAndRequestPermission()
  }, [])

  useEffect(() => {
    if (isCounting && countdown !== null && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
    if (isCounting && countdown === 0) {
      if (camera.current) {
        const result = camera.current.takePhoto();
        if (typeof result === 'string') {
          setPhoto(result);
          setShowPreview(true);
        }
      }
      setIsCounting(false)
      setCountdown(null)
    }
  }, [isCounting, countdown])

  if (hasPermission === null || isRequesting) {
    return (
      <LoadingScreen />
    )
  }

  if (hasPermission === false) {
    return (
      <div className="h-screen flex items-center justify-center ">
        <div className="text-center p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-neutral-700-600">Acesso Negado</h2>
          <p className="text-gray-600 mb-6">
            O acesso à câmera foi negado. Por favor, permita o acesso nas configurações do seu navegador e tente novamente.
          </p>
          <button
            onClick={requestCameraPermission}
            disabled={isRequesting}
            className="bg-neutral-600 hover:bg-neutral-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {isRequesting ? 'Solicitando...' : 'Tentar Novamente'}
          </button>
        </div>
      </div>
    )
  }

  const handleTakePhoto = () => {
    if (!isCounting) {
      setCountdown(3)
      setIsCounting(true)
    }
  }

  const handleRetake = () => {
    setPhoto(null)
    setShowPreview(false)
    setShowFinalPhoto(false)
  }

  const handleContinue = () => {
    setShowPreview(false)
    setShowFinalPhoto(true)
  }

  const handleFinish = () => {
    window.location.href = '/admin'
  }

  // Mostrar foto final se estiver na etapa final
  if (showFinalPhoto && photo) {
    return (
      <FinalPhoto 
        photo={photo}
        onFinish={handleFinish}
      />
    )
  }

  // Mostrar preview se a foto foi capturada
  if (showPreview && photo) {
    return (
      <PhotoPreview 
        photo={photo}
        onRetake={handleRetake}
        onContinue={handleContinue}
      />
    )
  }

  return (
    <div className="h-screen relative">
      <Camera 
        ref={camera} 
        errorMessages={errorMessages}
      />
      {isCounting && countdown !== null && countdown > 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/40">
          <span className="text-9xl font-bold text-black drop-shadow-lg animate-pulse">{countdown}</span>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-8 pointer-events-auto flex flex-col items-center gap-4">
        <div
          onClick={handleTakePhoto}
          className={`w-20 h-20 border-8 border-neutral-400 rounded-full cursor-pointer  hover:bg-white/80 transition-colors flex items-center justify-center shadow-lg ${isCounting ? 'opacity-50 pointer-events-none' : ''}`}
        />
      </div>
    </div>
  )
}