import React, { useState } from "react";
import Sidebar from "../Navbar/Navbar";
import EmotionMap from "../EmotionMap/EmotionMap";

import "./RecordPage.scss";

export default function RecordPage() {
  const [activePage, setActivePage] = useState("record");

  const handleNavigate = (pageId) => {
    setActivePage(pageId);
    // Здесь можно добавить react-router или иное переключение страниц
  };

  return (
    <div className="record-page">
      <Sidebar activePage={activePage} onNavigate={handleNavigate} />
      <main className="record-content">
        <EmotionMap />
      </main>
    </div>
  );
}
