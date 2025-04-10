import React, { useState, useEffect } from 'react';
import './styles/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';
import Header from './compenents/Header';
import { default as AdaptiveExercise } from './router/AdaptiveExercise';
import { default as SentenceEditor } from './router/SentenceEditor';
import { default as Navbar } from './router/Navbar'
import { ChatLog, getChatLog } from './store/chatLogService';
import { exercise, getExercise } from './store/exerciseService';


const App: React.FC = () => {
  const [chatResponse, setChatResponse] = useState<string>('');
  const [selectedChat, setSelectedChat] = useState<ChatLog | null>(null);
  const [relatedExercise, setRelatedExercise] = useState<exercise | null>(null);

  // 過去ログ選択時
  const handlePastChat = async (logID: number) => {
    try{
      // pastCHatを得る → exerciseを得る
      const pastLog = await getChatLog(logID);
      setSelectedChat(pastLog);
      console.log(`過去のチャットの取得に成功しました`);

      const pastExercise = await getExercise(pastLog.chatResponse);
      setRelatedExercise(pastExercise);
      console.log(`過去のエクササイズも取得できました`);
    }catch(error){
      console.error('過去情報の取得に失敗しました(チャットかエクササイズ):', error);
    }
  };

  // useEffect(() => {
  //   if (selectedChat) {
  //     console.log('chatResponse updated:', selectedChat.chatResponse);
  //   }
  // }, [selectedChat]);
  
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
          <Route path="/" element={<SentenceEditor chatResponse={chatResponse} setChatResponse={setChatResponse} selectedChat={selectedChat} setSelectedChat={setSelectedChat}/>} />
          <Route path="/chat" element={<AdaptiveExercise selectedChat={selectedChat} relatedExercise={relatedExercise} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;