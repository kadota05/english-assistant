import React, { useState } from 'react';
import './styles/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';
import Header from './compenents/Header';
import { default as AdaptiveExercise } from './router/AdaptiveExercise';
import { default as SentenceEditor } from './router/SentenceEditor';
import { default as Navbar } from './router/Navbar'
import { ChatLog, getChatLog } from './store/chatLogService';

const App: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<ChatLog | null>(null);

  // 過去ログ選択時
  const handlePastChat = async (logID: number) => {
    try{
      const pastLog = await getChatLog(logID);
      setSelectedChat(pastLog);
    }catch(error){
      console.error('過去のチャットの取得に失敗しました:', error);
    }
  };

  return (
    <div className="App bg-dark text-white min-vh-100">
      {/* ヘッダー */}
      <Header handlePastChat={handlePastChat} />
      {/*
        メインコンテンツ 
        marginTop: ヘッダーの高さ分(70px)を確保
      */}
      <main className="container pt-4 pb-5" style={{ marginTop: '70px' }}>
      <div className="pb-5">
        <Navbar />
      </div>
      <Routes>
          <Route path="/" element={<SentenceEditor selectedChat={selectedChat} />} />
          {/* ChatPageに選択されたチャット情報を渡す */}
          <Route path="/chat" element={<AdaptiveExercise />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;