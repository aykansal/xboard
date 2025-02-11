export default function LoadingAnimation() {
  return (
    <div className="flex items-center space-x-2">
      <div className="text-sm font-mono">
        <span className="animate-pulse">{"{"}</span>
        <span className="animate-pulse delay-75">"loading"</span>
        <span className="animate-pulse delay-150">:</span>
        <span className="animate-pulse delay-300">"data"</span>
        <span className="animate-pulse delay-500">{"}"}</span>
      </div>
      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
    </div>
  );
} 