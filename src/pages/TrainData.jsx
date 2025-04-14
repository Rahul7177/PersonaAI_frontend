// src/pages/TrainData.jsx
import React, { useState } from "react";
import TrainModelQuiz from "../components/TrainModel";
import TrainVoice from "../components/TrainVoice";

const TrainData = () => {
  const [selectedOption, setSelectedOption] = useState(null);

  return (
    <div className="min-h-screen p-6 bg-background text-text">
      <h1 className="text-4xl font-bold mb-6 text-center" style={{ color: "#89eb00" }}>
        Train Your AI Digital Twin
      </h1>
      <div className="flex justify-center gap-4 mb-8">
        <button
          className="cta-button"
          onClick={() => setSelectedOption("model")}
        >
          Train Model
        </button>
        <button
          className="cta-button"
          onClick={() => setSelectedOption("voice")}
        >
          Train Voice
        </button>
      </div>

      {selectedOption === "model" && <TrainModelQuiz />}
      {selectedOption === "voice" && <TrainVoice />}
    </div>
  );
};

export default TrainData;
