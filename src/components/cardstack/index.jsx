import React, { useState } from "react";
import { DndContext, useDraggable } from "@dnd-kit/core";
import { useSpring, animated } from "react-spring";

// Card Component
const Card = ({
  color,
  shape,
  index,
  id,
  zIndex,
  rotateDeg,
  text,
  isRemoved,
  setRemoved,
  position,
  onDrag,
  isDragging, // Track the drag state for each card
}) => {
  const { setNodeRef, attributes, listeners, isDragging: isCardDragging } = useDraggable({
    id,
  });

  // Spring properties for the card
  const springProps = useSpring({
    opacity: isRemoved ? 0 : 1, // Fade out when removed
    transform: isCardDragging
      ? "scale(1.5)" // Enlarge card when dragging
      : `rotate(${rotateDeg}deg)`, // Apply reduced rotation for non-dragging state
    left: position.x, // Dynamic position during drag
    config: { tension: 220, friction: 30 }, // Smoother drag effect
  });

  // After the animation, remove the card from the list
  if (isRemoved) {
    setRemoved(true); // Mark the card for removal after animation
  }

  return (
    <animated.div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        ...springProps,
        backgroundColor: color,
        width: "500px",
        height: "500px",
        margin: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "24px",
        color: "white",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        cursor: "grab",
        position: "absolute",
        zIndex: zIndex,
      }}
    >
      <div style={{ textAlign: "center", fontSize: "30px" }}>{text}</div>
    </animated.div>
  );
};

// Main Component for Stacked Cards
const StackCards = () => {
  const initialCards = [
    {
      background: "lightblue",
      shape: "square",
      text: "😊",
      title: "Behind The Scenes Making Moves: Designing Motion for 2022 Wrapped",
      id: "1",
    },
    {
      background: "lightgreen",
      shape: "hexagon",
      text: "😁",
      title: "Methods Navigating the Discovery Phase",
      id: "2",
    },
    {
      background: "lightcoral",
      shape: "circle",
      text: "😄",
      title: "Design Systems Can I get an Encore? Spotify’s Design System, Three Years On",
      id: "3",
    },
    {
      background: "lightpink",
      shape: "square",
      text: "😎",
      title: "Behind The Scenes From Web Page to Web Player: How Spotify Designed a New Homepage Experience",
      id: "4",
    },
    {
      background: "lightgoldenrodyellow",
      shape: "hexagon",
      text: "🥰",
      title: "Product Design Designing for the World: An Introduction to Localization",
      id: "5",
    },
  ];

  const [cards, setCards] = useState(initialCards);
  const [removedIndex, setRemovedIndex] = useState(null); // Only track the removed card index
  const [title, setTitle] = useState(
    "Behind The Scenes Collaboration Secrets: Design X Engineering"
  );

  const [positions, setPositions] = useState(
    initialCards.map(() => ({ x: 0, y: 0 })) // Initial positions for each card
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    // If the item is dropped at the same place, do nothing
    if (active.id === over?.id) return;

    const droppedCard = cards.find((card) => card.id === active.id);
    const newCards = cards.filter((card) => card.id !== active.id);
    setCards(newCards);

    setTitle(droppedCard.title);

    // Reset positions after the drag and drop action
    setPositions(initialCards.map(() => ({ x: 0, y: 0 })));  // Reset all card positions

    // After a 5-second delay, reset the title and restore the card to the list
    setTimeout(() => {
      setCards((prevCards) => [...prevCards, droppedCard]);
      setTitle("Behind The Scenes Collaboration Secrets: Design X Engineering");
    }, 5000);
  };


  const handleDragMove = (event) => {
    const { delta, active } = event;
    const newPositions = [...positions];
    const draggedCardIndex = cards.findIndex((card) => card.id === active.id);

    if (draggedCardIndex >= 0) {
      // Only update position of the dragged card
      newPositions[draggedCardIndex] = {
        x: newPositions[draggedCardIndex].x + delta.x, 
        y: newPositions[draggedCardIndex].y + delta.y,
      };
      setPositions(newPositions);
    }

    // Only remove the dragged card if moved past threshold
    if (newPositions[draggedCardIndex].x < -200 || newPositions[draggedCardIndex].x > 600) {
      setRemovedIndex(draggedCardIndex); // Remove only the dragged card
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-10">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 ml-16">
        <div className="col-span-1 lg:col-span-1">
          <div className="p-2 max-w-lg mx-auto">
            <div className="text-left grid grid-cols-1 place-items-center">
              {cards.length > 0 ? (
                <h1 className="text-3xl font-bold mb-4">{title}</h1>
              ) : (
                <h1 className="text-3xl font-bold mb-4"></h1>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <DndContext onDragEnd={handleDragEnd} onDragMove={handleDragMove}>
            <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 items-center gap-6">
              {cards.map((card, index) => {
                const rotateDeg = (index % 2 === 0 ? 1 : -1) * (index + 1); // Adjusted rotation
                return (
                  <Card
                    key={card.id}
                    color={card.background}
                    shape={card.shape}
                    id={card.id}
                    index={cards.indexOf(card)}
                    zIndex={cards.length - index}
                    rotateDeg={rotateDeg}
                    text={card.text}
                    isRemoved={removedIndex === index} // Only the removed card will be marked as removed
                    setRemoved={() => setRemovedIndex(null)} // Reset removal state
                    position={positions[index]} // Position passed to card
                    onDrag={handleDragMove} // Handle drag movement
                    isDragging={removedIndex === index} // Track drag state for each card
                  />
                );
              })}
            </div>
          </DndContext>
        </div>
      </div>
    </div>
  );
};

export default StackCards;
