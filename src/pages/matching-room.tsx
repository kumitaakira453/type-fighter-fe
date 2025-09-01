import LoadingDots from "@/components/LoadingDots";
import PrimaryButton from "@/components/PrimaryButton";
import { wsApiUrl } from "@/constants/urls";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import appLogo from "/logo_title.png";

export default function MatchingRoom() {
  const [matched, setMatched] = useState(false);
  const [opponentReady, setOpponentReady] = useState(false);
  const [selfReady, setSelfReady] = useState(false);
  const navigate = useNavigate();

  const socketRef = useRef<WebSocket | null>(null);

  const onMessage = (event: MessageEvent<string>) => {
    const data = JSON.parse(event.data);
    if (data.type === "matched") {
      // FIXME:matchした相手の情報も欲しいところ
      setMatched(true);
    }
    if (data.type === "ready") {
      setOpponentReady(true);
    }
    if (data.type === "start") {
      const roomId = data.room_id;
      navigate(`/battle-room/${roomId}`);
    }
    if (data.type === "close") {
      console.log(data.message);
    }
  };

  useEffect(() => {
    const websocket = new WebSocket(`${wsApiUrl}/matching-room`);
    socketRef.current = websocket;
    websocket.addEventListener("message", onMessage);

    return () => {
      websocket.close();
      websocket.removeEventListener("message", onMessage);
    };
  }, []);

  // 1秒後に相手も準備完了
  useEffect(() => {
    if (!selfReady) return;
    socketRef.current?.send(JSON.stringify({ type: "ready" }));
  }, [selfReady]);

  //相手の準備1秒後に画面遷移
  useEffect(() => {
    // if (!opponentReady) return;
    // const timer = setTimeout(() => {
    //   navigate("/battle-room");
    // }, 1000);
    // return () => clearTimeout(timer);
  }, [opponentReady]);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-800 via-purple-700 to-pink-600 text-white p-6 overflow-hidden">
      <img src={appLogo} alt="" className="w-80 mb-6" />

      {!matched && (
        <div className="flex flex-col items-center space-y-6">
          <p className="text-lg md:text-xl text-gray-200/80">
            対戦相手を待っています…
          </p>
          <LoadingDots />
        </div>
      )}

      <AnimatePresence>
        {matched && (
          <div className="relative flex flex-col items-center space-y-8">
            {/* プレイヤーカードエリア */}
            <div className="flex space-x-8">
              {/* 自分 */}
              <motion.div
                initial={{ x: "-100vw", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-100vw", opacity: 0 }}
                transition={{ type: "spring", stiffness: 70, damping: 20 }}
                className="w-80 h-52 bg-white/20 rounded-xl shadow-lg flex flex-col items-center justify-center p-4"
              >
                <p className="text-xl font-bold mb-2">You</p>
                <p
                  className={`px-3 py-1 rounded-lg text-sm ${
                    selfReady ? "bg-green-500" : "bg-gray-400"
                  }`}
                >
                  {selfReady ? "準備完了" : "待機中"}
                </p>
              </motion.div>

              {/* 相手 */}
              <motion.div
                initial={{ x: "100vw", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100vw", opacity: 0 }}
                transition={{ type: "spring", stiffness: 70, damping: 20 }}
                className="w-80 h-52 bg-white/20 rounded-xl shadow-lg flex flex-col items-center justify-center p-4"
              >
                <p className="text-xl font-bold mb-2">Opponent</p>
                <p
                  className={`px-3 py-1 rounded-lg text-sm ${
                    opponentReady ? "bg-green-500" : "bg-gray-400"
                  }`}
                >
                  {opponentReady ? "準備完了" : "待機中"}
                </p>
              </motion.div>
            </div>

            {/* 自分の準備ボタン */}
            <PrimaryButton
              onClick={() => setSelfReady(true)}
              disabled={selfReady}
            >
              {selfReady ? "準備完了！" : "準備完了"}
            </PrimaryButton>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
