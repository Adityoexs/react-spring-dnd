import React, { useState } from "react";
import { useDraggable } from "@dnd-kit/core";

const Card = ({ color, shape, id, onClick, style }) => {
  const { setNodeRef, attributes, listeners, isDragging, transform } = useDraggable({
    id,
  });

  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(!isClicked); // Toggle isClicked state when clicked
    onClick(id); // Optional: execute callback if needed in parent
  };

  // Define the card style
  const cardStyle = {
    backgroundColor: color,
    width: isClicked ? "30vw" : "18vw", // Increase the size when clicked
    height: isClicked ? "30vw" : "18vw", // Increase the size when clicked
    margin: "15px",
    borderRadius: shape === "circle" ? "50%" : "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: isClicked ? "10vw" : "5vw", // Larger font size when clicked
    color: "white",
    boxShadow: "0 6px 15px rgba(0, 0, 0, 0.15)",
    cursor: isClicked ? "grabbing" : "pointer", // Change cursor when card is clicked
    position: "absolute", // Absolute positioning to allow dragging
    transition: "transform 0.3s ease, z-index 0.3s ease, width 0.3s ease, height 0.3s ease, font-size 0.3s ease", // Smooth transition for size and transform
    transform: isDragging
      ? `translate(${transform.x}px, ${transform.y}px)` // Apply drag transform when dragging
      : "", // Apply drag translation
    zIndex: isClicked ? 10 : 1, // Bring the clicked card to the front
    ...style,
  };

  // Define the face of the card based on its shape
  const face = shape === "circle" ? "😊" : "💎";

  return (
    <div
      ref={setNodeRef} // Attach draggable node reference
      {...attributes} // Attach drag-and-drop attributes
      {...listeners} // Attach drag-and-drop listeners
      style={cardStyle}
      onClick={handleClick} // Toggle dragging on click
      className="transition-transform duration-300 ease-out transform"
    >
      {face}
    </div>
  );
};

export default Card;
