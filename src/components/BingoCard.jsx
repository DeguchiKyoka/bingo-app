import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';

const BingoCard = () => {
  const [activeTab, setActiveTab] = useState('create'); // 'create', 'play'
  const [cells, setCells] = useState(() => {
    const initialCells = Array(25).fill('');
    initialCells[12] = ''; // 真ん中は空欄
    return initialCells;
  });
  const [textSizes, setTextSizes] = useState(Array(25).fill('14px'));
  const [markedCells, setMarkedCells] = useState(Array(25).fill(false));
  const [bingoStatus, setBingoStatus] = useState(''); // 'bingo', 'reach', ''
  const [highlightedCells, setHighlightedCells] = useState([]); // ハイライト対象のセル
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

  const handleCellClick = (index) => {
    if (index === 12) return; // 真ん中はクリック不可
    
    const newMarkedCells = [...markedCells];
    newMarkedCells[index] = !newMarkedCells[index];
    setMarkedCells(newMarkedCells);
    
    // ビンゴ判定
    checkBingo(newMarkedCells);
  };

  const checkBingo = (markedCellsArray) => {
    // 縦横斜めのラインをチェック
    const lines = [
      // 横
      [0, 1, 2, 3, 4],
      [5, 6, 7, 8, 9],
      [10, 11, 12, 13, 14],
      [15, 16, 17, 18, 19],
      [20, 21, 22, 23, 24],
      // 縦
      [0, 5, 10, 15, 20],
      [1, 6, 11, 16, 21],
      [2, 7, 12, 17, 22],
      [3, 8, 13, 18, 23],
      [4, 9, 14, 19, 24],
      // 斜め
      [0, 6, 12, 18, 24],
      [4, 8, 12, 16, 20]
    ];

    // ビンゴチェック
    const bingoLines = lines.filter(line => {
      // FREEマスを含むラインは4マス埋まればビンゴ、それ以外は5マス
      const requiredMarks = line.includes(12) ? 4 : 5;
      const markedCount = line.filter(index => markedCellsArray[index]).length;
      return markedCount === requiredMarks;
    });

    if (bingoLines.length > 0) {
      setBingoStatus('bingo');
      // すべてのビンゴラインをハイライト
      const allBingoCells = bingoLines.flat();
      setHighlightedCells(allBingoCells);
      return;
    }

    // リーチチェック
    const reachLines = [];
    const highlightedCells = [];

    lines.forEach(line => {
      const markedCount = line.filter(index => markedCellsArray[index]).length;
      
      // 中央マスを含むラインは3マス埋まればリーチ、それ以外は4マス
      const requiredMarks = line.includes(12) ? 3 : 4;
      
      if (markedCount === requiredMarks) {
        reachLines.push(line);
        // リーチラインの埋まったセルをハイライト（ビンゴマスは除く）
        const lineHighlightedCells = line.filter(index =>
          markedCellsArray[index] && !highlightedCells.includes(index)
        );
        highlightedCells.push(...lineHighlightedCells);
      }
    });

    if (reachLines.length > 0) {
      setBingoStatus('reach');
      // 重複するセルを削除してハイライト
      const uniqueHighlightedCells = [...new Set(highlightedCells)];
      setHighlightedCells(uniqueHighlightedCells);
    } else {
      setBingoStatus('');
      setHighlightedCells([]);
    }
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

  const renderCreateTab = () => (
    <div className="flex flex-col items-start p-4">
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

  const renderPlayTab = () => (
    <div className="flex flex-col items-start p-4">
      {bingoStatus === 'bingo' && (
        <div className="mb-3 px-4 py-2 bg-yellow-100 border border-yellow-300 rounded">
          <span className="text-lg font-bold text-yellow-800">ビンゴ！</span>
        </div>
      )}
      
      {bingoStatus === 'reach' && (
        <div className="mb-3 px-4 py-2 bg-blue-100 border border-blue-300 rounded">
          <span className="text-lg font-bold text-blue-800">リーチ！</span>
        </div>
      )}
      
      <div className="grid grid-cols-5 gap-2 w-[28rem] h-[20rem]">
        {cells.map((cell, index) => (
          <div
            key={index}
            onClick={() => handleCellClick(index)}
            className={`border-2 border-gray-300 rounded p-3 cursor-pointer transition-all duration-200 ${
              index === 12
                ? 'bg-gray-100'
                : highlightedCells.includes(index)
                  ? bingoStatus === 'bingo'
                    ? 'bg-yellow-200 border-yellow-500'
                    : 'bg-blue-200 border-blue-500'
                  : markedCells[index]
                    ? 'bg-green-200 border-green-500'
                    : 'bg-white hover:bg-gray-50'
            }`}
          >
            {index === 12 ? (
              <span className="text-gray-400 text-sm font-bold text-center w-full block">FREE</span>
            ) : (
              <textarea
                value={cell}
                readOnly
                className="w-full h-full resize-none focus:outline-none focus:border-blue-500 overflow-hidden p-1 cursor-pointer"
                placeholder="クリックしてマーク"
                rows={3}
                style={{ fontSize: textSizes[index] }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-start p-4">
      {/* タブUI */}
      <div className="flex items-center gap-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">ビンゴツール</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-6 py-3 rounded-lg font-bold transition-all duration-200 border-2 ${
              activeTab === 'create'
                ? 'bg-purple-500 text-white border-purple-500 shadow-lg'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
            }`}
          >
            作成
          </button>
          <button
            onClick={() => setActiveTab('play')}
            className={`px-6 py-3 rounded-lg font-bold transition-all duration-200 border-2 ${
              activeTab === 'play'
                ? 'bg-green-500 text-white border-green-500 shadow-lg'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
            }`}
          >
            プレイ
          </button>
        </div>
        <div className="flex gap-4 ml-auto">
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

      {/* タブコンテンツ */}
      {activeTab === 'create' && renderCreateTab()}
      {activeTab === 'play' && renderPlayTab()}
    </div>
  );
};

export default BingoCard;
