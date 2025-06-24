import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend"; // Backend untuk drag-and-drop
import CardStack from "./components/cardstack"; // Komponen stack kartu

const App = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen max-h-screen bg-pink-100 p-8 fixed top-0 left-0 right-0 bottom-0">
        <CardStack />
      </div>
    </DndProvider>
  );
};

export default App;
