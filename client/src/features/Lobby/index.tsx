import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import {
  setError,
  selectError,
  selectRoomId,
  selectPlayerColor,
  selectOpponentConnected,
} from "@/store/gameSlice";
import { socketManager } from "@/socket/socket";
import { Copy, Check, Loader2, Users } from "lucide-react";

export const Lobby = () => {
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectError);
  const roomId = useAppSelector(selectRoomId);
  const playerColor = useAppSelector(selectPlayerColor);
  const opponentConnected = useAppSelector(selectOpponentConnected);

  const [joinRoomInput, setJoinRoomInput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCreateRoom = () => {
    dispatch(setError(null));

    const socket = socketManager.connect();

    if (!socket) {
      dispatch(setError("Not connected to server"));
      return;
    }

    socket.emit("create-room");
  };

  const handleJoinRoom = () => {
    if (!joinRoomInput.trim()) {
      dispatch(setError("Please enter a room code"));
      return;
    }

    dispatch(setError(null));

    const socket = socketManager.connect();

    if (!socket) {
      dispatch(setError("Not connected to server"));
      return;
    }

    socket.emit("join-room", { roomId: joinRoomInput.toUpperCase().trim() });
  };

  const handleCopyRoomCode = async () => {
    if (roomId) {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (roomId && !opponentConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
              <Users className="w-10 h-10 text-blue-600" />
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Waiting for Opponent
            </h2>

            <p className="text-slate-600 mb-6">
              Share this room code with your friend
            </p>

            <div className="bg-slate-50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center gap-3">
                <span className="text-3xl font-mono font-bold text-slate-800 tracking-wider">
                  {roomId}
                </span>
                <button
                  onClick={handleCopyRoomCode}
                  className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                  title="Copy room code"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <Copy className="w-5 h-5 text-slate-600" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-slate-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Waiting for player to join...</span>
            </div>

            <p className="text-sm text-slate-500 mt-4">
              You are playing as{" "}
              <span className="font-semibold">
                {playerColor === "w" ? "White" : "Black"}
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-8 text-slate-800">
          Chess Game
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleCreateRoom}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Create Room
          </button>

          <div className="space-y-2">
            <input
              type="text"
              value={joinRoomInput}
              onChange={(e) =>
                setJoinRoomInput(e.target.value.toUpperCase().slice(0, 6))
              }
              placeholder="Enter Room Code"
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:outline-none font-mono text-center text-lg tracking-wider uppercase"
              maxLength={6}
            />
            <button
              onClick={handleJoinRoom}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Join Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
