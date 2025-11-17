import { PropsWithChildren } from "react";

export type AlertSeverity = "error" | "info" | "success" | "warning";

export interface AlertProps extends PropsWithChildren {
  severity?: AlertSeverity;
  onClose?: () => void;
}

const severityStyles: Record<AlertSeverity, string> = {
  error: "bg-red-50 border-red-500 text-red-700",
  info: "bg-blue-50 border-blue-500 text-blue-700",
  success: "bg-green-50 border-green-500 text-green-700",
  warning: "bg-yellow-50 border-yellow-500 text-yellow-700",
};

const closeButtonStyles: Record<AlertSeverity, string> = {
  error: "text-red-500 hover:text-red-700",
  info: "text-blue-500 hover:text-blue-700",
  success: "text-green-500 hover:text-green-700",
  warning: "text-yellow-500 hover:text-yellow-700",
};

export function Alert({ severity = "error", onClose, children }: AlertProps) {
  return (
    <div className={`p-4 border-l-4 ${severityStyles[severity]}`}>
      <div className="flex justify-between items-center">
        <div className="flex-1">{children}</div>
        {onClose && (
          <button
            onClick={onClose}
            className={`ml-4 font-bold ${closeButtonStyles[severity]}`}
            aria-label="Close"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
