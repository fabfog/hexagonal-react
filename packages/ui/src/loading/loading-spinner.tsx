export interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = "Loading..." }: LoadingSpinnerProps) {
  return (
    <div className="text-center py-8 text-gray-500">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
}
