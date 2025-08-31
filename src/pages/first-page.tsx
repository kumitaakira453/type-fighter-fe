import PrimaryButton from "@/components/PrimaryButton";
import { useNavigate } from "react-router";
import appLogo from "/logo_title.png";

export default function FirstPage() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-purple-700 via-pink-600 to-red-500 text-white p-4">
      <img src={appLogo} alt="" className="w-80 mb-6" />
      <p className="mb-6 text-lg md:text-xl text-gray-100/80">
        文字を素早く入力して対戦しよう！
      </p>
      <PrimaryButton
        onClick={() => {
          navigate("/matching-room");
        }}
      >
        Start Game
      </PrimaryButton>
    </div>
  );
}
