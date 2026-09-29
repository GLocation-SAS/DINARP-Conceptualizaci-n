import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  date: string;
  status?: "neutral" | "success" | "warning" | "danger" | "info" | "primary" | "error";
  statusLabel?: string; // Etiqueta semántica para mostrar en lugar del nombre del estado técnico
  icon?: React.ReactNode;
  user?: string;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn("flex flex-col w-full", className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const statusColor = getStatusColor(item.status);

        return (
          <div key={item.id} className={cn("relative flex gap-5 md:gap-6", !isLast && "pb-8")}>
            {/* Left column: Icon & Connecting Line */}
            <div className="relative flex flex-col items-center">
              <div className={cn(
                "relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full border bg-surface transition-colors",
                statusColor.border, statusColor.bg, statusColor.text
              )}>
                <div className={cn(
                  "flex items-center justify-center size-[38px] rounded-full",
                  statusColor.innerBg
                )}>
                  {item.icon ? (
                    <div className="flex items-center justify-center [&>svg]:size-[18px]">{item.icon}</div>
                  ) : (
                    <div className={cn("size-2 rounded-full", statusColor.iconFill)} />
                  )}
                </div>
              </div>

              {!isLast && (
                <div className="absolute top-12 bottom-[-8px] left-1/2 w-[1px] -translate-x-1/2 bg-border/40" />
              )}
            </div>

            {/* Right column: Content */}
            <div className="flex flex-col gap-1.5 flex-1 pt-1">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4">
                <div className="flex flex-col gap-1 flex-1 max-w-2xl">
                  {item.title && (
                    <h4 className="text-sm font-bold font-heading text-foreground">{item.title}</h4>
                  )}
                  {item.description && (
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0 mt-1 sm:mt-0">
                  {item.status && (
                    <Badge tone={item.status === 'neutral' ? 'neutral' : item.status} size="sm" appearance="soft" className="px-2 py-0 text-[10px] h-5 uppercase tracking-wider font-bold">
                      {item.statusLabel || item.status}
                    </Badge>
                  )}
                  <span className="text-[13px] text-muted-foreground whitespace-nowrap font-medium">{item.date}</span>
                </div>
              </div>

              {item.user && (
                <div className="flex items-center gap-2 mt-3">
                  <Avatar className="size-6">
                    <AvatarFallback className="bg-muted text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                      {item.user.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-[13px] font-medium text-foreground/80">{item.user}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function getStatusColor(status?: TimelineItem["status"]) {
  switch (status) {
    case "success": return { bg: "bg-success/5 border-success/20", innerBg: "bg-success/10", text: "text-success-700 dark:text-success-400", border: "border-success/20", iconFill: "bg-success-600" };
    case "warning": return { bg: "bg-warning/5 border-warning/20", innerBg: "bg-warning/10", text: "text-warning-700 dark:text-warning-400", border: "border-warning/20", iconFill: "bg-warning-600" };
    case "danger":
    case "error": return { bg: "bg-danger/5 border-danger/20", innerBg: "bg-danger/10", text: "text-danger-700 dark:text-danger-400", border: "border-danger/20", iconFill: "bg-danger-600" };
    case "info": return { bg: "bg-info/5 border-info/20", innerBg: "bg-info/10", text: "text-info-700 dark:text-info-400", border: "border-info/20", iconFill: "bg-info-600" };
    case "primary": return { bg: "bg-primary/5 border-primary/20", innerBg: "bg-primary/10", text: "text-primary-700 dark:text-primary-400", border: "border-primary/20", iconFill: "bg-primary-600" };
    default: return { bg: "bg-muted/10 border-border/50", innerBg: "bg-muted/30", text: "text-muted-foreground", border: "border-border/50", iconFill: "bg-muted-foreground/60" };
  }
}
