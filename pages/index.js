import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const [name, setName] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      router.push(`/chat?name=${name}`);  // نقوم بتمرير الاسم في الرابط
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>مرحبًا في الشات!</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="أدخل اسمك"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ padding: '10px', fontSize: '16px' }}
        />
        <button type="submit" style={{ padding: '10px', marginLeft: '10px' }}>
          دخول
        </button>
      </form>
    </div>
  );
}
