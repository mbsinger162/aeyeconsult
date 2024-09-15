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
    <div className={styles.overlay}>
    <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>X</button>
        <h2>Welcome to aeyeconsult.com!</h2>
              <p>
                I made this available for free for public testing but in order to keep it operational, I need to know more about users.<br /><br />
                <strong>I'd love to hear about your experience! Please share your background and how you're planning to use aeyeconsult.com.</strong><br /><br />
                You can also email me directly at mbsinger162@gmail.com. Thank you! - <DynamicLinks />
              </p>
        <form onSubmit={handleSubmit}>
        <textarea 
            value={response} 
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Your response..."
        />
        <button type="submit">Submit</button>
        </form>
    </div>
    </div>
  );
}
