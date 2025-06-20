'use client'
import Image from "next/image";
import { useRef, useState } from "react";
import LoadingScreen from "./LoadingScreen";

interface PhotoPreviewProps {
  photo: string;
  onRetake: () => void;
  onContinue: () => void;
}

export default function PhotoPreview({ photo, onRetake, onContinue }: PhotoPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const processPhotoWithFrame = async () => {
    setIsProcessing(true);
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Definir dimensões do canvas
      const canvasWidth = 1080;
      const canvasHeight = 1920; // Proporção 16:9
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // Carregar a imagem da foto
      const photoImg = new window.Image();
      photoImg.crossOrigin = 'anonymous';
      
      photoImg.onload = () => {
        // Limpar canvas
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // Calcular dimensões da foto para ocupar todo o canvas
        const photoAspectRatio = photoImg.width / photoImg.height;
        const canvasAspectRatio = canvasWidth / canvasHeight;
        
        let photoWidth, photoHeight, photoX, photoY;
        
        if (photoAspectRatio > canvasAspectRatio) {
          // Foto é mais larga que o canvas - ajustar pela altura
          photoHeight = canvasHeight;
          photoWidth = photoHeight * photoAspectRatio;
          photoX = (canvasWidth - photoWidth) / 2;
          photoY = 0;
        } else {
          // Foto é mais alta que o canvas - ajustar pela largura
          photoWidth = canvasWidth;
          photoHeight = photoWidth / photoAspectRatio;
          photoX = 0;
          photoY = (canvasHeight - photoHeight) / 2;
        }
        
        // Desenhar a foto principal ocupando todo o canvas
        ctx.drawImage(photoImg, photoX, photoY, photoWidth, photoHeight);

        // Carregar e desenhar o logo
        const logoImg = new window.Image();
        logoImg.crossOrigin = 'anonymous';
        
        // Timeout para o logo
        const logoTimeout = setTimeout(() => {
          logoImg.onload = null;
          logoImg.onerror = null;
          // Executar fallback manualmente
          handleLogoFallback();
        }, 3000); // 3 segundos de timeout
        
        const handleLogoFallback = () => {
          // Fallback se o logo não carregar - apenas texto
          // Adicionar moldura superior com fundo neutro
          ctx.fillStyle = '#e5e5e5';
          ctx.fillRect(0, 0, canvasWidth, 160);
          
          // Texto "NEX LAB"
          ctx.fillStyle = '#404040';
          ctx.font = 'bold 32px Arial';
          ctx.textAlign = 'left';
          ctx.fillText('NEX LAB', 20, 110);
          
          // Texto "we make tech simple_"
          ctx.font = '24px Arial';
          ctx.textAlign = 'right';
          ctx.fillText('we make tech simple_', canvasWidth - 20, 110);

          // Adicionar moldura inferior com fundo neutro
          ctx.fillStyle = '#e5e5e5';
          ctx.fillRect(0, canvasHeight - 80, canvasWidth, 80);

          // Texto na parte inferior
          ctx.fillStyle = '#404040';
          ctx.font = '24px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('we make tech simple_', canvasWidth / 2, canvasHeight - 30);

          // Processamento concluído
          setIsProcessing(false);
          onContinue();
        };
        
        logoImg.onload = () => {
          clearTimeout(logoTimeout);
          
          // Adicionar moldura superior com fundo neutro
          ctx.fillStyle = '#e5e5e5';
          ctx.fillRect(0, 0, canvasWidth, 160);
          
          // Desenhar logo na parte superior
          const logoSize = 120;
          ctx.drawImage(logoImg, 20, 20, logoSize, logoSize);
          
          // Texto "we make tech simple_"
          ctx.fillStyle = '#404040';
          ctx.font = '32px Arial';
          ctx.textAlign = 'right';
          ctx.fillText('we make tech simple_', canvasWidth - 20, 110);

          // Adicionar moldura inferior com fundo neutro
          ctx.fillStyle = '#e5e5e5';
          ctx.fillRect(0, canvasHeight - 80, canvasWidth, 80);

          // Texto na parte inferior
          ctx.fillStyle = '#404040';
          ctx.font = '32px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('we make tech simple_', canvasWidth / 2, canvasHeight - 30);

          // Processamento concluído
          setIsProcessing(false);
          onContinue();
        };

        logoImg.onerror = () => {
          clearTimeout(logoTimeout);
          handleLogoFallback();
        };

        logoImg.src = '/logo.svg';
      };

      photoImg.onerror = () => {
        console.error('Erro ao carregar a foto');
        alert('Erro ao processar a foto. Tente novamente.');
        setIsProcessing(false);
      };
      
      photoImg.src = photo;
    } catch (error) {
      console.error('Erro ao processar foto com moldura:', error);
      alert('Erro ao processar a foto. Tente novamente.');
      setIsProcessing(false);
    }
  };

  const handleContinue = () => {
    processPhotoWithFrame();
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="rounded-2xl p-8 max-w-md w-full">
        {/* Moldura da foto */}
        <div className="mb-6">
          {/* Moldura decorativa */}
          <div className="flex flex-row gap-2 justify-between items-end bg-neutral-200 p-3">
            <Image src="/logo.svg" alt="logo" width={80} height={80} />

            <span className="text-xs">we make tech simple_</span>
          </div>
            <div className="relative overflow-hidden">
              <Image 
                src={photo} 
                alt="Foto capturada" 
                width={400}
                height={300}
                className="w-full h-144 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            <div className="bg-neutral-200 flex justify-center py-2">
              <p className="text-xs">we make tech simple_</p>
            </div>
        </div>

        {/* Botões */}
        <div className="flex flex-row gap-5">
          <button
            onClick={onRetake}
            disabled={isProcessing}
            className="w-full bg-transparent text-neutral-700 border-3 border-neutral-700 font-semibold py-2 px-6 rounded-xs transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Refazer
          </button>
          
          <button
            onClick={handleContinue}
            disabled={isProcessing}
            className="w-full bg-neutral-700 hover:bg-neutral-800 text-white font-semibold py-2 px-6 rounded-xs transition-all duration-200 transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isProcessing ? (
              <>
                <LoadingScreen />
              </>
            ) : (
              'Continuar'
            )}
          </button>
        </div>

        {/* Canvas oculto para processamento */}
        <canvas 
          ref={canvasRef} 
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
} 