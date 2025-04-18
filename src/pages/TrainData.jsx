// src/pages/TrainData.jsx
import React, { useState } from "react";
import TrainModelQuiz from "../components/TrainModel";
import TrainVoice from "../components/TrainVoice";

const TrainData = () => {
 const [selectedOption, setSelectedOption] = useState(null);

 const cardStyle =
  "bg-card text-text p-6 rounded-2xl shadow-lg w-full max-w-md hover:scale-105 transition-transform duration-300 border border-muted";

 const titleStyle = "text-2xl font-semibold mb-2 text-primary";
 const descriptionStyle = "text-sm text-muted-foreground mb-4";

 return (
  <div className="min-h-screen p-6 bg-background text-text flex flex-col items-center">
   <h1 className="text-4xl font-bold mb-10 text-center" style={{ color: "#89eb00" }}>
    Train Your AI Digital Twin
   </h1>

   <div className="flex flex-col md:flex-row gap-8 items-center justify-center mb-10">
    <div className={cardStyle} onClick={() => setSelectedOption("model")}>
     <h2 className={titleStyle}>Train Model</h2>
     <p className={descriptionStyle}>
      Personalize your AI’s knowledge base with responses trained from your behavior, preferences, and thinking style.
     </p>
     <button className="cta-button mt-2 w-full">Start Training</button>
    </div>

    <div className={cardStyle} onClick={() => setSelectedOption("voice")}>
     <h2 className={titleStyle}>Train Voice</h2>
     <p className={descriptionStyle}>
      Clone your voice to let the AI sound just like you. Provide samples and fine-tune speech dynamics.
     </p>
     <button className="cta-button mt-2 w-full">Upload Voice</button>
    </div>
   </div>

   {selectedOption === "model" && <TrainModelQuiz />}
   {selectedOption === "voice" && <TrainVoice />}
  </div>
 );
};

export default TrainData;
