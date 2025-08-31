export default function LoadingDots() {
  return (
    <div className="mt-12 flex space-x-2">
      <span className="w-3 h-3 bg-white rounded-full animate-bounce delay-75"></span>
      <span className="w-3 h-3 bg-white rounded-full animate-bounce delay-150"></span>
      <span className="w-3 h-3 bg-white rounded-full animate-bounce delay-300"></span>
    </div>
  );
}
