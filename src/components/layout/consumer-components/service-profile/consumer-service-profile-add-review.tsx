import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId: string;
  serviceName: string;
  onReviewAdded?: () => void; // Callback opcional para cuando se añade una review
}

const AddReviewModal: React.FC<AddReviewModalProps> = ({
  isOpen,
  onClose,
  serviceId,
  serviceName,
  onReviewAdded
}) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const { data: session } = useSession();

  if (!isOpen) return null;

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleRatingHover = (hoveredRating: number) => {
    setHoverRating(hoveredRating);
  };

  const handleRatingLeave = () => {
    setHoverRating(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user?.id) {
      toast.error('Debes iniciar sesión para dejar una reseña');
      return;
    }

    if (rating === 0) {
      toast.error('Por favor, selecciona una calificación');
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch('/api/consumer/service-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId,
          userId: session.user.id,
          rating,
          comment
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al enviar la reseña');
      }

      toast.success('¡Reseña enviada con éxito!');
      setRating(0);
      setComment('');
      onClose();
      
      // Si hay un callback para cuando se añade una review, lo llamamos
      if (onReviewAdded) {
        onReviewAdded();
      }
    } catch (error) {
      console.error('Error al enviar reseña:', error);
      toast.error(error instanceof Error ? error.message : 'Error al enviar la reseña');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        {/* Encabezado */}
        <div className="bg-orange-50 px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-800">Calificar servicio</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Cerrar"
            >
              <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Nombre del servicio */}
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <p className="font-medium text-gray-800">{serviceName}</p>
          <p className="text-xs text-gray-500">Tu opinión nos ayuda a mejorar</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <div className="p-4">
            {/* Sistema de calificación con estrellas */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Cómo calificarías este servicio?
              </label>
              <div 
                className="flex justify-center items-center space-x-1"
                onMouseLeave={handleRatingLeave}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => handleRatingHover(star)}
                    className="focus:outline-none transition-colors p-1"
                    aria-label={`Calificar ${star} de 5 estrellas`}
                  >
                    <svg
                      className={`w-8 h-8 ${
                        star <= (hoverRating || rating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      } transition-colors`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-center mt-2 text-sm text-gray-600">
                  {rating === 1 && 'Malo'}
                  {rating === 2 && 'Regular'}
                  {rating === 3 && 'Bueno'}
                  {rating === 4 && 'Muy bueno'}
                  {rating === 5 && 'Excelente'}
                </p>
              )}
            </div>

            {/* Comentario */}
            <div className="mb-2">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                Tu comentario (opcional)
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Comparte tu experiencia con este servicio..."
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                disabled={isSubmitting}
              ></textarea>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="px-4 py-3 bg-gray-50 text-right border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 mr-2 border-t-2 border-r-2 border-white rounded-full animate-spin"></div>
                  Enviando...
                </div>
              ) : (
                'Enviar reseña'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReviewModal;