import React, { useState } from "react";
import { DndContext, useDraggable } from "@dnd-kit/core";
import { useSpring, animated } from "react-spring";


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
  isDragging,
}) => {
  const { setNodeRef, attributes, listeners, isDragging: isCardDragging } = useDraggable({
    id,
  });


  const springProps = useSpring({
    opacity: isRemoved ? 0 : 1, 
    transform: isCardDragging
      ? "scale(1.5)"
      : `rotate(${rotateDeg}deg)`,
    left: position.x,
    config: { tension: 220, friction: 30 },
  });

  
  if (isRemoved) {
    setRemoved(true); 
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
  const [removedIndex, setRemovedIndex] = useState(null);
  const [title, setTitle] = useState(
    "Behind The Scenes Collaboration Secrets: Design X Engineering"
  );

  const [positions, setPositions] = useState(
    initialCards.map(() => ({ x: 0, y: 0 })) 
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    
    if (active.id === over?.id) return;

    const droppedCard = cards.find((card) => card.id === active.id);
    const newCards = cards.filter((card) => card.id !== active.id);
    setCards(newCards);

    setTitle(droppedCard.title);

    
    setPositions(initialCards.map(() => ({ x: 0, y: 0 }))); 

    
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
      
      newPositions[draggedCardIndex] = {
        x: newPositions[draggedCardIndex].x + delta.x, 
        y: newPositions[draggedCardIndex].y + delta.y,
      };
      setPositions(newPositions);
    }

    
    if (newPositions[draggedCardIndex].x < -200 || newPositions[draggedCardIndex].x > 600) {
      setRemovedIndex(draggedCardIndex); 
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
                const rotateDeg = (index % 2 === 0 ? 1 : -1) * (index + 1); 
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
                    isRemoved={removedIndex === index} 
                    setRemoved={() => setRemovedIndex(null)} 
                    position={positions[index]} 
                    onDrag={handleDragMove}
                    isDragging={removedIndex === index} 
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
