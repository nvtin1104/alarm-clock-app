import { useState, useEffect } from 'react';

const App = () => {
  const [interval, setInterval] = useState(30); // Khoảng thời gian lặp (phút)
  const [stopAfter, setStopAfter] = useState(0); // Thời gian dừng (phút, 0 = không dừng)
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState('');
  const audio = new Audio('https://www.soundjay.com/buttons/beep-01a.mp3');

  const showNotification = () => {
    if (window.electron?.sendNotification) {
      window.electron.sendNotification(
        'Báo thức!',
        `Đã đến giờ! (Cứ mỗi ${interval} phút)`
      );
    } else {
      console.log('Electron IPC không khả dụng, chạy trong trình duyệt.');
      alert(`Thông báo giả lập: Đã đến giờ! (Cứ mỗi ${interval} phút)`);
    }
    audio.play().catch(err => console.log('Audio error:', err));
  };
  

  useEffect(() => {
    let timer;
    if (isRunning && interval > 0) {
      showNotification();
      timer = setInterval(showNotification, interval * 60 * 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, interval]);

  useEffect(() => {
    let stopTimer;
    if (isRunning && stopAfter > 0) {
      stopTimer = setTimeout(() => {
        setIsRunning(false);
        alert('Báo thức đã dừng theo cài đặt thời gian!');
      }, stopAfter * 60 * 1000);
    }
    return () => clearTimeout(stopTimer);
  }, [isRunning, stopAfter]);

  const startAlarm = () => {
    if (interval <= 0) {
      setError('Thời gian lặp phải lớn hơn 0!');
      return;
    }
    setError('');
    setIsRunning(true);
  };

  const stopAlarm = () => {
    setIsRunning(false);
    setError('');
  };

  // Xử lý giá trị nhập để luôn là số, tránh undefined
  const handleIntervalChange = (e) => {
    const value = e.target.value;
    setInterval(value === '' ? 0 : Number(value)); // Nếu rỗng, đặt về 0
  };

  const handleStopAfterChange = (e) => {
    const value = e.target.value;
    setStopAfter(value === '' ? 0 : Number(value)); // Nếu rỗng, đặt về 0
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full h-full mx-auto mt-10">
      <h1 className="text-2xl text-dark font-bold text-center mb-4">Báo Thức Định Kỳ</h1>
      <div className="mb-4">
        <label className="block text-gray-700">Thời gian lặp (phút):</label>
        <input
          type="number"
          value={interval}
          onChange={handleIntervalChange}
          className="w-full p-2 border rounded mt-1"
          min="1"
          disabled={isRunning}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Dừng sau (phút, 0 = không dừng):</label>
        <input
          type="number"
          value={stopAfter}
          onChange={handleStopAfterChange}
          className="w-full p-2 border rounded mt-1"
          min="0"
          disabled={isRunning}
        />
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="flex justify-center space-x-4">
        <button
          onClick={startAlarm}
          className={`px-4 py-2 rounded text-white ${isRunning ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'}`}
          disabled={isRunning}
        >
          Bắt đầu
        </button>
        <button
          onClick={stopAlarm}
          className={`px-4 py-2 rounded text-white ${!isRunning ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'}`}
          disabled={!isRunning}
        >
          Dừng
        </button>
      </div>
    </div>
  );
};

export default App;