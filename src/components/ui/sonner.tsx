import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      position="bottom-right"
      toastOptions={{
        unstyled: false,
        classNames: {
          toast:
            "group toast !rounded-none !border !border-foreground !bg-background !text-foreground !shadow-none !font-sans !p-5 !gap-3",
          title: "!font-sans !text-[14px] !font-medium !text-foreground !tracking-[-0.005em]",
          description: "!font-sans !text-[13px] !text-foreground !leading-[1.55] !mt-1",
          actionButton: "!bg-foreground !text-background !rounded-none !font-mono !text-[10px] !tracking-[0.12em] !uppercase",
          cancelButton: "!bg-transparent !text-foreground !rounded-none !font-mono !text-[10px] !tracking-[0.12em] !uppercase",
          closeButton: "!bg-background !border-foreground !text-foreground hover:!bg-foreground hover:!text-background !rounded-none",
          success: "!border-foreground !bg-background !text-foreground",
          error: "!border-foreground !bg-background !text-foreground",
          info: "!border-foreground !bg-background !text-foreground",
          warning: "!border-foreground !bg-background !text-foreground",
          icon: "!text-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
