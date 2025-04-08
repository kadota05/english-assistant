import React, { useState, useEffect } from 'react';
import './styles/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';
import Header from './compenents/Header';
import { default as AdaptiveExercise } from './router/AdaptiveExercise';
import { default as SentenceEditor } from './router/SentenceEditor';
import { default as Navbar } from './router/Navbar'
import { ChatLog, getChatLog } from './store/chatLogService';

const App: React.FC = () => {
  const [chatResponse, setChatResponse] = useState<string>('');
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
  useEffect(() => {
    if (selectedChat) {
      console.log('chatResponse updated:', selectedChat.chatResponse);
    }
  }, [selectedChat]);
  
  
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
          <Route path="/" element={<SentenceEditor chatResponse={chatResponse} setChatResponse={setChatResponse} selectedChat={selectedChat} />} />
          <Route path="/chat" element={<AdaptiveExercise selectedChat={selectedChat} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;