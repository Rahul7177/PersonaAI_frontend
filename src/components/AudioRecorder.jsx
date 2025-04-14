import { useState } from "react";

const AudioRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);

  const startRecording = () => {
    setRecording(true);
  };

  const stopRecording = () => {
    setRecording(false);
    setAudioURL("sample-audio.mp3"); 
  };

  return (
    <div className="p-4 bg-gray-800 rounded mt-6">
      <h2 className="text-lg text-secondary">Push to Talk</h2>
      <button
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        className="bg-secondary text-black p-2 w-full mt-2"
      >
        {recording ? "Recording..." : "Hold to Record"}
      </button>
      {audioURL && <audio controls src={audioURL} className="mt-2 w-full"></audio>}
    </div>
  );
};

export default AudioRecorder;
