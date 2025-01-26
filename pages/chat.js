import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import io from 'socket.io-client';

let socket;

export default function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [file, setFile] = useState(null);
  const router = useRouter();
  const { name } = router.query;  // قراءة الاسم من query parameter في الرابط

  useEffect(() => {
    // إنشاء الاتصال عبر WebSocket
    socket = io('http://localhost:3000');  // تأكد من أن هذا العنوان يشير إلى خادمك

    // إرسال رسالة عند انضمام المستخدم
    socket.emit('join', { name });

    // استقبال الرسائل من الخادم
    socket.on('message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, [name]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() || file) {
      // إرسال الرسالة مع الاسم
      socket.emit('sendMessage', { name, message, file });
      setMessage('');
      setFile(null);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const createRoom = () => {
    const roomId = prompt("أدخل اسم الغرفة");
    if (roomId) {
      socket.emit('createRoom', roomId);
    }
  };

  return (
    <div style={{ margin: '50px' }}>
      <h1>مرحبا {name}!</h1>
      <div>
        <button onClick={createRoom}>إنشاء غرفة</button>
      </div>
      <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ccc', marginBottom: '20px' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
            <strong>{msg.name}: </strong>
            {msg.message}
            {msg.file && <a href={msg.file} target="_blank" rel="noopener noreferrer"> تحميل الملف </a>}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="اكتب رسالتك"
          style={{ padding: '10px', fontSize: '16px', width: '80%' }}
        />
        <input
          type="file"
          onChange={handleFileChange}
          style={{ padding: '10px', marginLeft: '10px' }}
        />
        <button type="submit" style={{ padding: '10px', marginLeft: '10px' }}>إرسال</button>
      </form>
    </div>
  );
}
