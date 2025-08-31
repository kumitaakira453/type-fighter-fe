import { Route, Routes } from "react-router";
import BattleRoom from "./pages/battle-room";
import FirstPage from "./pages/first-page";
import MatchingRoom from "./pages/matching-room";

function App() {
  return (
    <Routes>
      <Route path="/" element={<FirstPage />} />
      <Route path="matching-room" element={<MatchingRoom />} />
      <Route path="battle-room" element={<BattleRoom />} />
    </Routes>
  );
}

export default App;
