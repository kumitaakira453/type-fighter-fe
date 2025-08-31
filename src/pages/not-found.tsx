import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/"), 1500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center
                    bg-gradient-to-br from-blue-800 via-purple-700 to-pink-600
                    text-white p-6"
    >
      <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
        404
      </h1>
      <p className="text-xl md:text-2xl mb-6 drop-shadow-md">
        ページが見つかりません
      </p>
      <p className="text-lg md:text-xl text-gray-200/80">
        トップページに戻ります…
      </p>
    </div>
  );
}
