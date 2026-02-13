import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      position="top-center"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-charcoal group-[.toaster]:border-charcoal/10 group-[.toaster]:shadow-xl group-[.toaster]:rounded-2xl group-[.toaster]:font-body",
          description: "group-[.toast]:text-charcoal-light group-[.toast]:font-body",
          actionButton: "group-[.toast]:bg-gold group-[.toast]:text-charcoal group-[.toast]:font-body",
          cancelButton: "group-[.toast]:bg-cream group-[.toast]:text-charcoal-light group-[.toast]:font-body",
          success: "group-[.toaster]:!bg-green-50 group-[.toaster]:!border-green-200 group-[.toaster]:!text-green-800",
          error: "group-[.toaster]:!bg-red-50 group-[.toaster]:!border-red-200 group-[.toaster]:!text-red-800",
          info: "group-[.toaster]:!bg-blue-50 group-[.toaster]:!border-blue-200 group-[.toaster]:!text-blue-800",
        },
      }}
      richColors
      expand
      closeButton
      {...props}
    />
  );
};

export { Toaster, toast };
