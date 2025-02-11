export default function LoadingAnimation() {
  return (
    <div className="flex items-center space-x-3">
      <div className="text-lg font-['VT323']">
        <span className="animate-pixel">LOADING</span>
        <span className="animate-pulse">...</span>
      </div>
      <div className="w-3 h-3 bg-current animate-bounce pixel-borders" />
    </div>
  );
} 