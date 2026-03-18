"use client"

import { cn } from "@/lib/utils"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { type VariantProps, cva } from "class-variance-authority"
import * as React from "react"

const GlassSheet = SheetPrimitive.Root

const GlassSheetTrigger = SheetPrimitive.Trigger

const GlassSheetClose = SheetPrimitive.Close

const GlassSheetPortal = SheetPrimitive.Portal

const GlassSheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/70 backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "after:absolute after:inset-0 after:bg-[var(--widget-cyan)]/5 after:pointer-events-none",
      className
    )}
    {...props}
    ref={ref}
  />
))
GlassSheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const sheetVariants = cva(
  cn(
    "fixed z-50 gap-4 p-6",
    "bg-[#0a1628]/90 backdrop-blur-2xl",
    "border border-[var(--widget-cyan)]/30",
    "shadow-[0_0_30px_rgba(34,211,238,0.15),0_8px_32px_rgba(0,0,0,0.4)]",
    "transition ease-in-out duration-300",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "before:absolute before:inset-0",
    "before:bg-gradient-to-b before:from-[var(--widget-cyan)]/10 before:to-transparent before:pointer-events-none"
  ),
  {
    variants: {
      side: {
        top: cn(
          "inset-x-0 top-0 border-b rounded-b-2xl h-[60vh]",
          "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top"
        ),
        bottom: cn(
          "inset-x-0 bottom-0 border-t rounded-t-2xl h-[60vh]",
          "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom"
        ),
        left: cn(
          "inset-y-0 left-0 h-full w-[60vw] border-r rounded-r-2xl",
          "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left"
        ),
        right: cn(
          "inset-y-0 right-0 h-full w-[60vw] border-l rounded-l-2xl",
          "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right"
        ),
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
)

interface GlassSheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const GlassSheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  GlassSheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <GlassSheetPortal>
    <GlassSheetOverlay />
    <SheetPrimitive.Content ref={ref} className={cn(sheetVariants({ side }), className)} {...props}>
      <div className="relative z-10 h-full">{children}</div>
    </SheetPrimitive.Content>
  </GlassSheetPortal>
))
GlassSheetContent.displayName = SheetPrimitive.Content.displayName

const GlassSheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-2 text-left", className)} {...props} />
)
GlassSheetHeader.displayName = "GlassSheetHeader"

const GlassSheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-row justify-end gap-2", className)} {...props} />
)
GlassSheetFooter.displayName = "GlassSheetFooter"

const GlassSheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-white", className)}
    {...props}
  />
))
GlassSheetTitle.displayName = SheetPrimitive.Title.displayName

const GlassSheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("text-sm text-white/60", className)}
    {...props}
  />
))
GlassSheetDescription.displayName = SheetPrimitive.Description.displayName

export {
  GlassSheet,
  GlassSheetPortal,
  GlassSheetOverlay,
  GlassSheetTrigger,
  GlassSheetClose,
  GlassSheetContent,
  GlassSheetHeader,
  GlassSheetFooter,
  GlassSheetTitle,
  GlassSheetDescription,
}
