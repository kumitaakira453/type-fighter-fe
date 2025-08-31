import PrimaryButton from "@/components/PrimaryButton";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import appLogo from "/logo_title.png";

const targetText = "hello world this is a typing battle game";

function TypingBattle() {
  const navigate = useNavigate();
  const [playerInput, setPlayerInput] = useState("");
  const [opponentInput, setOpponentInput] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState<"win" | "lose" | null>(null);
  const [countdown, setCountdown] = useState(3); // 開始前カウント

  // カウントダウン
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // キー入力
  useEffect(() => {
    if (countdown > 0 || gameOver) return; // カウント中は無効
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.length === 1) {
        setPlayerInput((prev) => prev + e.key);
      } else if (e.key === "Backspace") {
        setPlayerInput((prev) => prev.slice(0, -1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [countdown, gameOver]);

  // ダミー相手入力
  useEffect(() => {
    if (countdown > 0 || gameOver) return;
    const interval = setInterval(() => {
      if (opponentInput.length < targetText.length) {
        setOpponentInput((prev) => prev + targetText[prev.length]);
      }
    }, 60);
    return () => clearInterval(interval);
  }, [opponentInput, countdown, gameOver]);

  // 勝敗判定
  useEffect(() => {
    if (playerInput === targetText) {
      setGameOver(true);
      setResult("win");
    } else if (opponentInput === targetText) {
      setGameOver(true);
      setResult("lose");
    }
  }, [playerInput, opponentInput]);

  // 入力済み部分の色付け
  const renderText = (input: string) => {
    return targetText.split("").map((char, idx) => {
      if (idx < input.length) {
        const isCorrect = input[idx] === char;
        return (
          <span
            key={idx}
            className={isCorrect ? "text-green-400" : "text-red-400"}
          >
            {char}
          </span>
        );
      } else {
        return <span key={idx}>{char}</span>;
      }
    });
  };

  // カウントダウン中は大きく表示
  if (countdown > 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-800 via-purple-700 to-pink-600 text-white">
        <span className="text-[10rem] md:text-[15rem] font-extrabold animate-pulse drop-shadow-lg">
          {countdown}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-800 via-purple-700 to-pink-600 p-6 text-white">
      <img src={appLogo} alt="" className="w-80 mb-6" />

      <div className="flex flex-col md:flex-row w-full max-w-4xl gap-6">
        {/* 自分 */}
        <div className="flex-1 bg-white/10 p-4 rounded-lg shadow-md flex flex-col">
          <h2 className="text-lg font-semibold mb-2">You</h2>
          <div className="text-xl tracking-wide">{renderText(playerInput)}</div>
        </div>

        {/* 相手 */}
        <div className="flex-1 bg-white/10 p-4 rounded-lg shadow-md flex flex-col">
          <h2 className="text-lg font-semibold mb-2">Opponent</h2>
          <div className="text-xl tracking-wide">
            {renderText(opponentInput)}
          </div>
        </div>
      </div>

      {/* 結果 */}
      {gameOver && result && (
        <div className="flex flex-col items-center">
          <div className="mt-12 mb-12 text-3xl font-bold animate-pulse">
            {result === "win" ? (
              <span className="text-green-400">You Win! 🎉</span>
            ) : (
              <span className="text-red-400">You Lose! 💀</span>
            )}
          </div>
          <PrimaryButton
            onClick={() => {
              navigate("/");
            }}
          >
            Top
          </PrimaryButton>
        </div>
      )}
    </div>
  );
}

export default TypingBattle;
