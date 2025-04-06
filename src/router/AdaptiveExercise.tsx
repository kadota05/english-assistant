import React, { useState } from 'react';
import { fetchExerciseResponse } from '../services/aiService';

type AdaptiveExerciseProps = {
  chatResponse: string;
}

const AdaptiveExercise: React.FC<AdaptiveExerciseProps> = ( { chatResponse} ) => {
  const [exerciseResponse, setExerciseResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSend = async () => {
    setLoading(true);

    try {
      const exerciseText = await fetchExerciseResponse(chatResponse);
      setExerciseResponse(exerciseText);
    } catch (error) {
      setExerciseResponse('エラーが発生しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
    <div>まだ開発中だよ</div>
    {chatResponse ? (
      <div>作成できます！</div>
    )
    : (
      <div>chatResponseを得て下さい!</div>
    )
    }

    <button className="btn text-white" onClick={()=>{handleSend()}}>作成</button>

    {loading && (
      <div>作問しています</div>
    ) }
    {exerciseResponse !== '' && (
      <div>{exerciseResponse}</div>
    )}
    </>
    
  )
}

export default AdaptiveExercise;