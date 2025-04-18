import React, { useState, useRef } from 'react';
import '../stylesheets/Clone_Voice.css';

export default function Clone_Voice() {
  const [transcription, setTranscription] = useState('');
  const [audioURL, setAudioURL] = useState('');
  const [textInput, setTextInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const fileInputRef = useRef(null);

  const handleAudioUpload = async () => {
    const file = fileInputRef.current.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("audio", file);
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/clone-audio", {
        method: "POST",
        body: formData
      });
      if (!res.ok) throw new Error("Audio clone API error");
      const blob = await res.blob();
      const audioUrl = URL.createObjectURL(blob);
      setAudioURL(audioUrl);
      setTranscription("Audio processed (transcription may not be returned from this endpoint).");
    } catch (err) {
      console.error("Error cloning from audio:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTextClone = async () => {
    if (!textInput.trim()) return alert("Please enter some text.");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/clone-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textInput }),
      });
      if (!res.ok) throw new Error("Text clone error");
      const blob = await res.blob();
      const audioUrl = URL.createObjectURL(blob);
      setAudioURL(audioUrl);
      new Audio(audioUrl).play();
    } catch (err) {
      console.error("Error cloning text:", err);
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setRecordedChunks([]);
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) setRecordedChunks((prev) => [...prev, e.data]);
      };
      recorder.onstop = async () => {
        const audioBlob = new Blob(recordedChunks, { type: 'audio/webm' });
        const tempURL = URL.createObjectURL(audioBlob);
        setAudioURL(tempURL);
        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.wav");
        setLoading(true);
        try {
          const res = await fetch("http://localhost:5000/api/clone-audio", {
            method: "POST",
            body: formData
          });
          if (!res.ok) throw new Error("Recording clone error");
          const cloneBlob = await res.blob();
          const cloneURL = URL.createObjectURL(cloneBlob);
          setAudioURL(cloneURL);
          setTranscription("Audio processed (transcription may not be returned).");
        } catch (err) {
          console.error("Error cloning recorded audio:", err);
        } finally {
          setLoading(false);
        }
      };
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access error:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="clone-voice-container">
      <h2 className="clone-voice-header">🎙️ Clone Your Voice</h2>

      <div className="clone-voice-options">
        {/* Upload */}
        <div className="clone-voice-card">
          <label className="clone-voice-label">Upload Audio</label>
          <input ref={fileInputRef} type="file" accept="audio/*" className="clone-voice-file-input" />
          <button className="clone-voice-button" onClick={handleAudioUpload}>Submit Audio</button>
        </div>

        {/* Record */}
        <div className="clone-voice-card">
          <label className="clone-voice-label">Record Audio</label>
          {!isRecording ? (
            <button className="clone-voice-button" onClick={startRecording}>Start Recording</button>
          ) : (
            <button className="clone-voice-button" onClick={stopRecording}>Stop Recording</button>
          )}
        </div>

        {/* Text */}
        <div className="clone-voice-card">
          <label className="clone-voice-label">Enter Text</label>
          <textarea
            className="clone-voice-textarea"
            rows="3"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />
          <button onClick={handleTextClone} className="clone-voice-button">Clone Voice from Text</button>
        </div>
      </div>

      {/* Output */}
      {loading && <p className="clone-voice-loading">Processing...</p>}

      {transcription && (
        <div className="clone-voice-result">
          <p className="clone-voice-subheader">📝 Transcription:</p>
          <p className="clone-voice-content">{transcription}</p>
        </div>
      )}

{audioURL && (
 <div className="clone-voice-result">
  <p className="clone-voice-subheader">🔊 Cloned Voice Output:</p>
  <audio controls src={audioURL} className="clone-voice-audio" />
  <a
   href={audioURL}
   download="cloned_voice.webm"
   className="clone-voice-download-button"
  >
   ⬇️ Download Audio
  </a>
 </div>
)}

    </div>
  );
}
