'use client'
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import QRCode from 'qrcode';
import LoadingScreen from "./LoadingScreen";
import { usePhotoUpload } from "@/hooks/usePhotoUpload";

interface FinalPhotoProps {
  photo: string;
  onFinish: () => void;
}

export default function FinalPhoto({ photo, onFinish }: FinalPhotoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [finalPhotoUrl, setFinalPhotoUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [showQRCodeOnly, setShowQRCodeOnly] = useState(false);
  
  const { uploadPhoto, isUploading } = usePhotoUpload();

  useEffect(() => {
    generateFinalPhoto();
  }, [photo]);

  useEffect(() => {
    if (finalPhotoUrl && !qrCodeUrl && !isUploading) {
      console.log('finalPhotoUrl mudou, fazendo upload...');
      handlePhotoUpload();
    }
  }, [finalPhotoUrl, isUploading]);

  const handlePhotoUpload = async () => {
    if (!finalPhotoUrl) return;

    try {
      // Converter URL para blob
      const response = await fetch(finalPhotoUrl);
      const blob = await response.blob();

      // Gerar QR code temporário para upload
      const tempQrCodeUrl = await QRCode.toDataURL('temp', {
        width: 120,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      // Fazer upload da foto
      const savedPhoto = await uploadPhoto(blob, tempQrCodeUrl);
      
      if (savedPhoto) {
        // Gerar QR code final com o ID da foto
        await generateQRCode(savedPhoto.id);
      }
    } catch (error) {
      console.error('Erro no upload da foto:', error);
    }
  };

  const generateQRCode = async (photoId: string) => {
    try {
      console.log('Gerando QR code final...');
      
      // Criar URL de download que funcione
      const currentUrl = window.location.origin;
      const downloadUrl = `${currentUrl}/api/download-photo?id=${photoId}`;
      
      console.log('URL para QR code:', downloadUrl);
      
      const qrCodeDataUrl = await QRCode.toDataURL(downloadUrl, {
        width: 120,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      console.log('QR code gerado com sucesso');
      setQrCodeUrl(qrCodeDataUrl);
    } catch (error) {
      console.error('Erro ao gerar QR code:', error);
    }
  };

  const generateFinalPhoto = async () => {
    setIsGenerating(true);
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

          // Converter para blob e criar URL
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              setFinalPhotoUrl(url);
              setIsGenerating(false);
            }
          }, 'image/png');
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

          // Converter para blob e criar URL
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              setFinalPhotoUrl(url);
              setIsGenerating(false);
            }
          }, 'image/png');
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
        setIsGenerating(false);
      };
      
      photoImg.src = photo;
    } catch (error) {
      console.error('Erro ao gerar foto final:', error);
      alert('Erro ao gerar a foto final. Tente novamente.');
      setIsGenerating(false);
    }
  };

  const handleFinish = () => {
    setShowThankYouModal(true);
    
    // Após 3 segundos, mostrar apenas o QR code
    setTimeout(() => {
      setShowThankYouModal(false);
      setShowQRCodeOnly(true);
    }, 3000);
  };

  const handleQRCodeFinish = () => {
    // Limpar URL do blob para liberar memória
    if (finalPhotoUrl) {
      URL.revokeObjectURL(finalPhotoUrl);
    }
    onFinish();
  };

  // Componente apenas com QR code
  if (showQRCodeOnly) {
    return (
      <div className="flex flex-col justify-between items-center h-screen p-8">
        <Image src="/logo.svg" alt="NEX LAB" width={100} height={100} />

        <div className="flex flex-col items-center px-8">
          <h2 className="text-2xl font-bold text-neutral-600 mb-4 text-center">
          Obrigado!
          </h2>
          <p className="text-neutral-600 mb-6 text-center">
          Lorem ipsum dolor sit amet consectetur.
          </p>
        
          {qrCodeUrl ? (
            <div className="flex justify-center mb-6 border border-neutral-600 rounded-lg p-4 bg-white">
              <Image 
                src={qrCodeUrl} 
                alt="QR Code para download da foto" 
                width={200}
                height={200}
                className="w-48 h-48"
              />
            </div>
          ) : (
            <LoadingScreen />
          )}
        </div>
        
        <button
          onClick={handleQRCodeFinish}
          className="w-full bg-neutral-700 hover:bg-neutral-800 text-white font-semibold py-3 px-6 rounded-xs transition-all duration-200 transform hover:scale-105 shadow-md"
        >
          Finalizar
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center">
      {/* Modal de agradecimento */}
      {showThankYouModal && (
        <div className="fixed inset-0 bg-black/15 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-sm mx-4 text-center">
            <h2 className="text-2xl font-bold text-neutral-800 mb-2">
              Obrigado!
            </h2>
            <p className="text-neutral-600">
            Lorem ipsum dolor sit amet consectetur.
            </p>
          </div>
        </div>
      )}

      <div className="p-8 max-w-md w-full">
        {/* Foto final com moldura */}
        <div className="mb-6">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center h-96 bg-neutral-100">
              <LoadingScreen />
            </div>
          ) : finalPhotoUrl ? (
            <div className="relative">
              <Image 
                src={finalPhotoUrl} 
                alt="Foto final com moldura" 
                width={400}
                height={600}
                className="w-full h-auto shadow-lg"
              />
              <div className="absolute bottom-9 right-3 bg-white p-4 rounded-lg shadow-lg border border-neutral-200">
                <div className="text-center">
                  <p className="text-xs font-semibold pb-2 text-neutral-700">Fazer download</p>
                  {qrCodeUrl ? (
                    <Image 
                      src={qrCodeUrl} 
                      alt="QR Code para download da foto" 
                      width={100}
                      height={100}
                      className="w-24 h-24"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-neutral-100 rounded flex items-center justify-center">
                      <LoadingScreen />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-96 bg-neutral-100">
              <p className="text-neutral-600">Erro ao gerar foto</p>
            </div>
          )}
        </div>

        {/* Botões */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleFinish}
            disabled={isGenerating}
            className="w-full bg-neutral-700 hover:bg-neutral-800 text-white font-semibold py-3 px-6 rounded-xs transition-all duration-200 transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Finalizar
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