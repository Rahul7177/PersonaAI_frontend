// src/components/TrainVoice.jsx
import React, { useState, useRef } from "react";

const randomSentences = [
  "The quick brown fox jumps over the lazy dog.",
  "Artificial intelligence is revolutionizing the world.",
  "Voice cloning creates personalized and natural interactions.",
  "Our digital twin learns and adapts over time.",
  "Innovation drives progress in technology."
];

const TrainVoice = () => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [currentSentence, setCurrentSentence] = useState("");
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);

  const startRecording = async () => {
    recordedChunks.current = [];
    setCurrentSentence(randomSentences[Math.floor(Math.random() * randomSentences.length)]);
    setRecording(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunks.current.push(e.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunks.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        // Optionally, automatically download the file:
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = "voice_clip.webm";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      };
      mediaRecorderRef.current.start();

      // Stop recording after 1 minute
      setTimeout(() => {
        mediaRecorderRef.current.stop();
        setRecording(false);
      }, 60000);
    } catch (error) {
      console.error("Error accessing audio devices:", error);
      setRecording(false);
    }
  };

  return (
    <div className="p-6 bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-xl max-w-xl mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4" style={{ color: "#89eb00" }}>Train Voice</h2>
      <p className="mb-4 text-lg">Speak the following sentence:</p>
      <p className="mb-4 font-semibold text-xl">{currentSentence || "Press 'Record' to start"}</p>
      <button
        onClick={startRecording}
        className="cta-button"
        disabled={recording}
      >
        {recording ? "Recording..." : "Record for 1 Minute"}
      </button>
      {audioURL && (
        <div className="mt-4">
          <audio controls src={audioURL}></audio>
          <p className="mt-2">Your voice clip has been recorded and downloaded.</p>
        </div>
      )}
    </div>
  );
};

export default TrainVoice;
