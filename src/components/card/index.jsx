import React, { useState } from "react";
import { useDraggable } from "@dnd-kit/core";

const Card = ({ color, shape, id, onClick, style }) => {
  const { setNodeRef, attributes, listeners, isDragging, transform } = useDraggable({
    id,
  });

  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(!isClicked); 
    onClick(id); 
  };


  const cardStyle = {
    backgroundColor: color,
    width: isClicked ? "30vw" : "18vw", 
    height: isClicked ? "30vw" : "18vw", 
    margin: "15px",
    borderRadius: shape === "circle" ? "50%" : "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: isClicked ? "10vw" : "5vw", 
    color: "white",
    boxShadow: "0 6px 15px rgba(0, 0, 0, 0.15)",
    cursor: isClicked ? "grabbing" : "pointer", 
    position: "absolute", 
    transition: "transform 0.3s ease, z-index 0.3s ease, width 0.3s ease, height 0.3s ease, font-size 0.3s ease", 
    transform: isDragging
      ? `translate(${transform.x}px, ${transform.y}px)` 
      : "", 
    zIndex: isClicked ? 10 : 1, 
    ...style,
  };

  
  const face = shape === "circle" ? "😊" : "💎";

  return (
    <div
      ref={setNodeRef} 
      {...attributes} 
      {...listeners} 
      style={cardStyle}
      onClick={handleClick} 
      className="transition-transform duration-300 ease-out transform"
    >
      {face}
    </div>
  );
};

export default Card;
