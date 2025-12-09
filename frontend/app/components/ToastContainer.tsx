/**
 * ToastContainer component renders all active toast notifications.
 * Implements Requirements 1.1, 2.1, 3.4, 4.4:
 * - Displays multiple toast notifications
 * - Manages toast positioning and stacking
 */

import Toast, { type ToastType } from './Toast';

interface ToastState {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContainerProps {
  toasts: ToastState[];
  onClose: (id: number) => void;
}

export default function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-4 pointer-events-none">
      <div className="space-y-2 pointer-events-auto">
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            style={{
              transform: `translateY(${index * 4}px)`,
              transition: 'transform 0.2s ease-out',
            }}
          >
            <Toast
              type={toast.type}
              message={toast.message}
              onClose={() => onClose(toast.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
