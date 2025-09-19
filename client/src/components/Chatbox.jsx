// client/src/components/Chatbox.jsx

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import TripCard from "./TripCard";
import Map from "./Map";

export default function Chatbox() {
  const [messages, setMessages] = useState([
    { role: "system", content: "Plan a trip!" },
  ]);
  const [input, setInput] = useState("");
  const [trip, setTrip] = useState(null);
  const [locations, setLocations] = useState([]);
  const scrollRef = useRef();

  // Health-check via proxy to confirm backend is reachable
  useEffect(() => {
    fetch("/")
      .then((res) => res.text())
      .then(console.log)
      .catch(console.error);
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await axios.post("/api/ai/chat", { messages: newMessages });
      const assistantContent = res.data.response;
      setMessages((prev) => [
        ...prev,
        userMsg,
        { role: "assistant", content: assistantContent },
      ]);

      // Attempt to parse JSON trip object
      try {
        const parsed = JSON.parse(assistantContent);
        setTrip(parsed);
      } catch {
        setTrip(null);
      }

      // Extract first capitalized phrase for place search
      const match = assistantContent.match(
        /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/
      );
      if (match) {
        searchPlaces(match[0]);
      }
    } catch (err) {
      console.error("Chat error:", err);
    }
  };

  const searchPlaces = async (query) => {
    try {
      const res = await axios.get(
        `/api/map/places?query=${encodeURIComponent(query)}`
      );
      if (res.data.results) {
        setLocations(res.data.results.slice(0, 5));
      }
    } catch (err) {
      console.error("Place search error:", err);
    }
  };

  const renderMessage = (m, i) => {
    let align = "text-left";
    let color = "text-black";
    if (m.role === "user") {
      align = "text-right";
      color = "text-blue-700";
    } else if (m.role === "system") {
      align = "text-center";
      color = "text-gray-500";
    }

    return (
      <div key={i} className={`${align} ${color} my-2`}>
        <strong>{m.role}:</strong>
        <br />
        {m.content}
      </div>
    );
  };

  return (
    <div className="max-w-4xl w-full mt-8 mx-auto">
      <div
        ref={scrollRef}
        className="bg-gray-100 p-4 min-h-[320px] h-80 overflow-y-scroll rounded"
      >
        {messages.map(renderMessage)}
      </div>
      <div className="flex mt-2">
        <input
          className="flex-1 border p-2 rounded-l"
          value={input}
          placeholder="Type your travel request…"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-700 text-white px-4 rounded-r"
        >
          Send
        </button>
      </div>

      {locations.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Places Found:</h3>
          <Map locations={locations} />
        </div>
      )}

      {trip && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Trip Itinerary:</h3>
          <TripCard trip={trip} />
        </div>
      )}
    </div>
  );
}
