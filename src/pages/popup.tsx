import React, { useState, CSSProperties } from "react";

interface PopupProps {
  onClose: () => void;
  onSave: (transcription: string, confidence: string) => void;
  style?: CSSProperties; // Allow passing custom styles
}

const Popup: React.FC<PopupProps> = ({ onClose, onSave, style }) => {
  const [transcription, setTranscription] = useState("");
  const [confidence, setConfidence] = useState("medium");

  const handleSave = () => {
    onSave(transcription, confidence);
    onClose();
  };

  return (
    <div
      style={{
        ...style, // Apply custom styles passed via props
        position: "absolute", // Position relative to parent container
        width: "400px",
        padding: "20px",
        backgroundColor: "white",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        borderRadius: "8px",
        zIndex: 1000,
      }}
    >
      <h2 style={{ marginBottom: "15px" }}>Edit Transcription</h2>

      {/* Transcription Textarea */}
      <textarea
        value={transcription}
        onChange={(e) => setTranscription(e.target.value)}
        placeholder="Enter transcription here..."
        style={{
          width: "100%",
          height: "100px",
          marginBottom: "15px",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          resize: "none",
          fontSize: "14px",
        }}
      />

      {/* Confidence Slider */}
      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          Confidence Level:
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span>Low</span>
          <input
            type="range"
            min="1"
            max="3"
            step="1"
            value={
              confidence === "low"
                ? 1
                : confidence === "medium"
                ? 2
                : 3
            }
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              setConfidence(
                value === 1
                  ? "low"
                  : value === 2
                  ? "medium"
                  : "high"
              );
            }}
            style={{ flex: 1 }}
          />
          <span>High</span>
        </div>
        <div style={{ textAlign: "center", marginTop: "5px", fontSize: "14px" }}>
          {confidence.charAt(0).toUpperCase() + confidence.slice(1)}
        </div>
      </div>

      {/* Buttons */}
      <div style={{ textAlign: "right" }}>
        <button
          onClick={onClose}
          style={{
            marginRight: "10px",
            padding: "8px 12px",
            border: "none",
            backgroundColor: "#ccc",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          style={{
            padding: "8px 12px",
            border: "none",
            backgroundColor: "#007BFF",
            color: "white",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default Popup;
