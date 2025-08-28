import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';

const BingoCard = () => {
  const [cells, setCells] = useState(() => {
    const initialCells = Array(25).fill('');
    initialCells[12] = ''; // 真ん中は空欄
    return initialCells;
  });
  const [textSizes, setTextSizes] = useState(Array(25).fill('14px'));
  const cardRef = useRef(null);

  const calculateFontSize = (text) => {
    if (!text) return '14px';
    const length = text.length;
    if (length <= 10) return '14px';
    if (length <= 20) return '12px';
    if (length <= 30) return '10px';
    if (length <= 50) return '8px';
    return '6px';
  };

  const handleCellChange = (index, value) => {
    const newCells = [...cells];
    newCells[index] = value;
    setCells(newCells);
    
    // 文字サイズを更新
    const newTextSizes = [...textSizes];
    newTextSizes[index] = calculateFontSize(value);
    setTextSizes(newTextSizes);
  };

  const saveAsImage = async () => {
    if (cardRef.current) {
      try {
        const canvas = await html2canvas(cardRef.current, {
          backgroundColor: '#ffffff',
          scale: 2
        });
        
        const link = document.createElement('a');
        link.download = 'bingo-card.png';
        link.href = canvas.toDataURL();
        link.click();
      } catch (error) {
        console.error('画像の保存に失敗しました:', error);
        alert('画像の保存に失敗しました');
      }
    }
  };

  const clearCard = () => {
    const newCells = Array(25).fill('');
    newCells[12] = ''; // 真ん中は空欄のまま
    setCells(newCells);
    
    // 文字サイズもリセット
    setTextSizes(Array(25).fill('14px'));
  };

  return (
    <div className="flex flex-col items-start p-4">
      <div className="flex items-center gap-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">ビンゴカード作成</h1>
        <div className="flex gap-4">
          <button
            onClick={saveAsImage}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded transition duration-200"
          >
            画像として保存
          </button>
          <button
            onClick={clearCard}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded transition duration-200"
          >
            クリア
          </button>
        </div>
      </div>
      
      <div ref={cardRef}>
        <div className="grid grid-cols-5 gap-2 w-[28rem] h-[20rem]">
          {cells.map((cell, index) => (
            <div
              key={index}
              className={`border-2 border-gray-300 rounded p-3 ${
                index === 12 ? 'bg-gray-100' : 'bg-white'
              }`}
            >
              {index === 12 ? (
                <span className="text-gray-400 text-sm font-bold text-center w-full block">FREE</span>
              ) : (
                <textarea
                  value={cell}
                  onChange={(e) => handleCellChange(index, e.target.value)}
                  className="w-full h-full resize-none focus:outline-none focus:border-blue-500 overflow-hidden p-1"
                  placeholder="入力"
                  rows={3}
                  style={{ fontSize: textSizes[index] }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BingoCard;
