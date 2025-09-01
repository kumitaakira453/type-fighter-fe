import PrimaryButton from "@/components/PrimaryButton";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { apiUrl, wsApiUrl } from "@/constants/urls";
import appLogo from "/logo_title.png";

function TypingBattle() {
  const navigate = useNavigate();
  const params = useParams();

  const [playerIndex, setPlayerIndex] = useState(0); // 自分の現在テキスト番号
  const [opponentIndex, setOpponentIndex] = useState(0); // 相手の現在テキスト番号
  const [playerInput, setPlayerInput] = useState("");
  const [opponentInput, setOpponentInput] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState<"win" | "lose" | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [targetTexts, setTargetTexts] = useState<string[]>([]);

  const currentPlayerText = useMemo(() => {
    return targetTexts[playerIndex] ?? "";
  }, [targetTexts, playerIndex]);
  const currentOpponentText = useMemo(() => {
    return targetTexts[opponentIndex] ?? "";
  }, [targetTexts, opponentIndex]);

  const socketRef = useRef<WebSocket | null>(null);

  const setUpGame = async () => {
    const res = await fetch(`${apiUrl}/typing-texts`);
    const data = await res.json();
    setTargetTexts(
      data.texts.map((ob: { id: number; text: string }) => ob.text)
    );
    socketRef.current?.send(JSON.stringify({ type: "ready" }));
  };

  useEffect(() => {
    const websocket = new WebSocket(`${wsApiUrl}/battle-room/${params.roomId}`);
    socketRef.current = websocket;
    websocket.addEventListener("message", onMessage);
    // FIXME:本来は並列でfetchも行うべき
    websocket.addEventListener("open", () => {
      setUpGame();
    });
    websocket.addEventListener("close", () => {
      // TODO:相手が退出したことをまずは通知する
      navigate("/matching-room");
    });

    return () => {
      websocket.close();
      websocket.removeEventListener("message", onMessage);
    };
  }, []);

  const onMessage = (event: MessageEvent<string>) => {
    const data = JSON.parse(event.data);
    if (data.type === "start") {
      setCountdown(3);
    }
    if (data.type === "close") {
      console.log(data.message);
    }
  };

  // 開始前カウントダウン
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // キー入力
  useEffect(() => {
    if (countdown > 0 || gameOver) return;
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

  // // ダミー相手入力
  // useEffect(() => {
  //   if (countdown > 0 || gameOver) return;
  //   const interval = setInterval(() => {
  //     if (opponentInput.length < currentOpponentText.length) {
  //       setOpponentInput((prev) => prev + currentOpponentText[prev.length]);
  //     } else if (opponentIndex + 1 < targetTexts.length) {
  //       setOpponentIndex(opponentIndex + 1);
  //       setOpponentInput("");
  //     }
  //   }, 60);
  //   return () => clearInterval(interval);
  // }, [opponentInput, opponentIndex, countdown, gameOver, currentOpponentText]);

  // 自分の入力進捗管理
  useEffect(() => {
    if (playerInput === currentPlayerText) {
      if (playerIndex + 1 < targetTexts.length) {
        setPlayerIndex(playerIndex + 1);
        setPlayerInput("");
      }
    }

    // ゲーム終了判定
    if (
      (playerIndex === targetTexts.length - 1 &&
        playerInput === currentPlayerText) ||
      (opponentIndex === targetTexts.length - 1 &&
        opponentInput === currentOpponentText)
    ) {
      setGameOver(true);
      setResult(playerIndex >= opponentIndex ? "win" : "lose");
    }
  }, [
    playerInput,
    playerIndex,
    opponentInput,
    opponentIndex,
    currentPlayerText,
    currentOpponentText,
  ]);

  const renderText = (input: string, text: string) =>
    text.split("").map((char, idx) => {
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
      }
      return <span key={idx}>{char}</span>;
    });

  // if (countdown > 0) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-800 via-purple-700 to-pink-600 text-white">
  //       <span className="text-[10rem] md:text-[15rem] font-extrabold animate-pulse drop-shadow-lg">
  //         {countdown}
  //       </span>
  //     </div>
  //   );
  // }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-800 via-purple-700 to-pink-600 p-6 text-white">
      {countdown > 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
          <span className="text-[10rem] md:text-[15rem] font-extrabold animate-pulse drop-shadow-lg">
            {countdown}
          </span>
        </div>
      )}
      <img src={appLogo} alt="" className="w-80 mb-6" />

      {/* 進捗表示 */}
      <div className="flex justify-between w-full max-w-4xl mb-4 text-sm md:text-base text-gray-200">
        <span>
          You: {playerIndex + 1} / {targetTexts.length}
        </span>
        <span>
          Opponent: {opponentIndex + 1} / {targetTexts.length}
        </span>
      </div>

      <div className="flex flex-col md:flex-row w-full max-w-4xl gap-6">
        {/* 自分 */}
        <div
          className="flex-1 p-4 rounded-lg flex flex-col
                bg-white/20 shadow-lg border-2 border-yellow-400"
        >
          <h2 className="text-lg font-semibold mb-2">You</h2>
          <div className="text-xl tracking-wide">
            {renderText(playerInput, currentPlayerText)}
          </div>
        </div>

        {/* 相手 */}
        <div className="flex-1 bg-white/10 p-4 rounded-lg shadow-md flex flex-col">
          <h2 className="text-lg font-semibold mb-2">Opponent</h2>
          <div className="text-xl tracking-wide">
            {renderText(opponentInput, currentOpponentText)}
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
          <PrimaryButton onClick={() => navigate("/")}>Top</PrimaryButton>
        </div>
      )}
    </div>
  );
}

export default TypingBattle;
