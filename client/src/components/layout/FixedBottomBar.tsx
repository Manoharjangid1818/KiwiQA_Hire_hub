import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
interface FixedBottomBarProps {
  leftButton?: ReactNode;
  centerContent?: ReactNode;
  rightButton?: ReactNode;
  fullWidth?: boolean;
  className?: string;
}

export function FixedBottomBar({
  leftButton,
  centerContent,
  rightButton,
  fullWidth = false,
  className,
}: FixedBottomBarProps) {
  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border shadow-2xl",
      "supports-[padding:safe]:pb-[env(safe-area-inset-bottom)] pb-8 md:pb-6 px-4 md:px-8",
      fullWidth && "px-4 md:px-8",
      className
    )}>
      <div className="max-w-4xl mx-auto flex items-center gap-3 h-16 md:h-14">
        {leftButton && (
          <div className="flex-shrink-0">
            {leftButton}
          </div>
        )}
        
        {centerContent && (
          <div className="flex-1 flex items-center justify-center min-w-0">
            {centerContent}
          </div>
        )}
        
        {rightButton && (
          <div className="flex-shrink-0 ml-auto">
            {rightButton}
          </div>
        )}
      </div>
    </div>
  );
}

