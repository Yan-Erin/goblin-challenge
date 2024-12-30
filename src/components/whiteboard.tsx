import React, { useState } from "react";
import Popup from "./popup";
import { useUser } from "../content/userContext";

interface Whiteboard {
  id: string;
  image_url: string;
}

interface GraphQLData {
  allWhiteboardsCsv: {
    edges: {
      node: Whiteboard;
    }[];
  };
}

const Whiteboards: React.FC<{ data: GraphQLData }> = ({ data }) => {
  if (!data || !data.allWhiteboardsCsv) {
    return <div>Loading whiteboards...</div>; // Placeholder during SSR
  }

  const whiteboards = data.allWhiteboardsCsv.edges.map((edge) => edge.node);
  const [index, setIndex] = useState(0);
  const { user } = useUser();
  
  const [start, setStart] = useState<{ x: number; y: number } | null>(null);
  const [current, setCurrent] = useState<{ x: number; y: number } | null>(null);
  const [box, setBox] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState<{ top: number; left: number } | null>(null);

  const [boxes, setBoxes] = useState<
    { image: string; top: number; left: number; width: number; height: number; transcription: string; confidence: string }[]
  >([]);
  const [boxesRelativeForImage, setBoxesRelativeForImage] = useState<
    { top: number; left: number; width: number; height: number; transcription: string; confidence: string }[]
  >([]);

  const handleMouseDown = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    const rect = (e.target as HTMLImageElement).getBoundingClientRect();
    const x = e.clientX - rect.left; // X coordinate relative to the image
    const y = e.clientY - rect.top; // Y coordinate relative to the image

    if (!start) {
      // First click: Set the starting point (top-left corner)
      setStart({ x, y });
      setCurrent({ x, y });
    } else {
        // Second click: Finalize the box
        const top = Math.min(start.y, y);
        const left = Math.min(start.x, x);
        const width = Math.abs(x - start.x);
        const height = Math.abs(y - start.y);

        // Determine popup position
        const popupTop = top + height + 10; // Align top of popup with below the box
        const popupLeft = left + width + 10;  // Align left popup with the right edge of the box 
        setPopupPosition({ top: popupTop, left: popupLeft });

        setBox({ top, left, width, height });
        setStart(null); // Reset start point
        setCurrent(null); // Reset current point

        setShowPopup(true); // Show the popup
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    if (start) {
      const rect = (e.target as HTMLImageElement).getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update current mouse position while dragging
      setCurrent({ x, y });
    }
  };
  /* Saves absolute px in cvs file */
  const handleSave = (transcription: string, confidence: string) => {
    if (box) {
      const img = document.querySelector("img") as HTMLImageElement;
      const rect = img.getBoundingClientRect();

      // Calculate absolute dimensions based on the original image size
      const absoluteBox = {
        top: (box.top / rect.height) * img.naturalHeight,
        left: (box.left / rect.width) * img.naturalWidth,
        width: (box.width / rect.width) * img.naturalWidth,
        height: (box.height / rect.height) * img.naturalHeight,
      };

      // Save the finalized box with transcription and confidence
      setBoxes((prev) => [
        ...prev,
        { ...absoluteBox, image: whiteboards[index].id, transcription, confidence },
      ]);
      
      // This is for the UI box history 
      setBoxesRelativeForImage((prev) => [
        ...prev,
        { ...box,transcription, confidence },
      ])

      setBox(null); // Reset the temporary box
    }
  };

  const nextImage = () => {
    setIndex((prevIndex) => (prevIndex < whiteboards.length - 1 ? prevIndex + 1 : prevIndex));
    resetBox();
  };

  const resetBox = () => {
    setStart(null);
    setCurrent(null);
    setBox(null);
    setShowPopup(false);
    setBoxesRelativeForImage([])
  };

  const downloadBoxes = () => {
    const boxesWithUser = boxes.map((box) => ({
      ...box,
      user,
    }));
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(boxesWithUser));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = dataStr;
    downloadAnchor.download = "transcript.json";
    downloadAnchor.click();
  };

  return (
    <div className="relative text-center p-4">
      <h1 className="font-gotham-rounded-bold text-2xl text-green-700 mb-4">Whiteboard {index + 1}</h1>
      <div
        style={{ position: "relative", display: "inline-block" }}
        onMouseMove={handleMouseMove} // Track mouse movement
        onMouseLeave={() => setCurrent(null)} // Clear current point when mouse leaves
      >
        {/* Image */}
        <img
          src={whiteboards[index].image_url}
          alt={`Whiteboard ${index + 1}`}
          style={{ width: "80%", height: "auto", cursor: "crosshair" }}
          onClick={handleMouseDown} 
        />

        {/* Dynamic Box */}
        {start && current && (
          <div
            style={{
              position: "absolute",
              top: start.y,
              left: start.x,
              width: current ? current.x - start.x : 0,
              height: current ? current.y - start.y : 0,
              border: "2px dashed blue",
              pointerEvents: "none", 
            }}
          ></div>
        )}

        {/* Finalized Boxes relative */}
        {boxesRelativeForImage.map((b, idx) => {
          
  // Determine border color based on confidence
  const borderColor =
    b.confidence === "high"
      ? "green"
      : b.confidence === "low"
      ? "red"
      : "orange";

  return (
    <div
      key={idx}
      style={{
        position: "absolute",
        top: b.top,
        left: b.left,
        width: b.width,
        height: b.height,
        border: `2px solid ${borderColor}`,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-20px",
          left: "0",
          backgroundColor: "white",
          fontSize: "12px",
          padding: "2px 4px",
          border: "1px solid #ccc",
        }}
      >
        {b.transcription} ({b.confidence})
      </div>
    </div>
  );
})}
      </div>

      {/* Popup */}
      {showPopup && popupPosition && (
        <Popup
          style={{
            position: "absolute",
            top: `${popupPosition.top}px`,
            left: `${popupPosition.left}px`,
          }}
          onClose={() => setShowPopup(false)}
          onSave={(transcription, confidence) => {
            handleSave(transcription, confidence);
            setShowPopup(false); // Close the popup after saving
          }}
        />
      )}

<div className="mt-4 flex justify-center gap-4">
    <button  className="bg-blue-500 font-gotham-rounded-medium text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-600"
        onClick={nextImage} disabled={index >= whiteboards.length - 1}>
          Next
        </button>
        <button  className="bg-blue-500 font-gotham-rounded-medium text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-600"
        onClick={resetBox}>Clear Boxes</button>
        <button className="bg-blue-500 font-gotham-rounded-medium text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-600"
        onClick={downloadBoxes}>Download Boxes</button>
      </div>
    </div>
  );
};

export default Whiteboards;
   