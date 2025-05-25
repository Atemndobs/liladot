import { useToast } from '@/hooks/use-toast';
import { Toast, ToastProvider, ToastViewport } from '@/components/ui/toaster';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <h3 className="font-medium">{title}</h3>}
              {description && (
                <p className="text-sm opacity-90">{description}</p>
              )}
            </div>
            {action}
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
