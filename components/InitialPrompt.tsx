import { useState } from 'react';
import styles from '@/styles/InitialPrompt.module.css';
import dynamic from 'next/dynamic'

const DynamicLinks = dynamic(() => import('@/components/DynamicLinks'), { ssr: false })

export default function InitialPrompt({ onClose, onSubmit }: { onClose: () => void; onSubmit: () => void }) {
  const [response, setResponse] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ response }),
    });
    onSubmit();
  };

  return (
    <div className={`${styles.overlay} fixed inset-0 z-50 flex items-center justify-center`}>
      <div className={`${styles.modal} bg-white p-6 rounded-lg shadow-lg max-w-md w-full`}>
        <button className={`${styles.closeButton} absolute top-2 right-2 text-gray-500 hover:text-gray-700`} onClick={onClose}>X</button>
        <h2 className="text-xl font-bold mb-4">Welcome to aeyeconsult.com!</h2>
        <p className="mb-4">
          I made this available for free for public testing but in order to keep it operational, I need to know more about users.<br /><br />
          <strong>I&apos;d  love to hear about your experience! Please share your background and how you&apos;re planning to use aeyeconsult.com.</strong><br /><br />
          You can also email me directly at mbsinger162@gmail.com. <br />
          Thank you! - <DynamicLinks />
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea 
            value={response} 
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Your response..."
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Submit</button>
        </form>
      </div>
    </div>
  );
}