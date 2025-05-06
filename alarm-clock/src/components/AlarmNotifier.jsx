import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from '@tauri-apps/plugin-notification';

const AlarmNotifier = () => {
  const [interval, setIntervalValue] = useState(30);
  const [message, setMessage] = useState('Nhắc nhở lịch hẹn!');
  const [isActive, setIsActive] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    let intervalId = null;

    const setupNotification = async () => {
      let granted = await isPermissionGranted();
      if (!granted) {
        const permission = await requestPermission();
        granted = permission === 'granted';
      }
      setPermissionGranted(granted);

      if (isActive && granted) {
        intervalId = setInterval(() => {
          sendNotification({ title: 'Nhắc nhở', body: message });
        }, interval * 60 * 1000);
      }
    };

    setupNotification();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isActive, interval, message]);

  const toggleAlarm = () => {
    setIsActive(!isActive);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-auto mt-6"
    >
      <h2 className="text-xl font-bold mb-4 text-center">Cài Đặt Nhắc Nhở</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Khoảng thời gian (phút)
        </label>
        <input
          type="number"
          value={interval}
          onChange={(e) => setIntervalValue(Math.max(1, Number(e.target.value)))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          min="1"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Nội dung thông báo
        </label>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleAlarm}
        className={`w-full p-2 rounded-md ${isActive ? 'bg-red-600' : 'bg-indigo-600'} text-white`}
      >
        {isActive ? 'Tắt Nhắc Nhở' : 'Bật Nhắc Nhở'}
      </motion.button>

      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-3 bg-gray-100 rounded-md text-center"
        >
          <p>Nhắc nhở đang chạy mỗi {interval} phút với nội dung: "{message}"</p>
        </motion.div>
      )}

      {!permissionGranted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-3 bg-red-100 rounded-md text-center text-red-700"
        >
          <p>Quyền thông báo chưa được cấp. Vui lòng cho phép!</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AlarmNotifier;
