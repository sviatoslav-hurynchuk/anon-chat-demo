import { useState, KeyboardEvent } from 'react';
import { auth } from '../firebase';
import { MAX_MESSAGE_LENGTH } from '@anon-chat/shared';

export function MessageInput() {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const charsRemaining = MAX_MESSAGE_LENGTH - text.length;
  const isOverLimit = charsRemaining < 0;
  const isEmpty = text.trim().length === 0;
  const isDisabled = isEmpty || sending || isOverLimit;

  const handleSubmit = async () => {
    if (isDisabled) return;
    
    setSending(true);
    setError(null);
    
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');
      
      const token = await user.getIdToken();
      
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: text.trim() })
      });
      
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || 'Failed to post message');
      }
      
      setText('');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col gap-2 mb-6">
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          if (error) setError(null);
        }}
        onKeyDown={handleKeyDown}
        placeholder="Say something anonymously..."
        className="w-full bg-gray-900 border border-gray-800 rounded-lg p-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none h-24"
      />
      <div className="flex justify-between items-center">
        <span className={`text-sm ${charsRemaining <= 20 ? 'text-red-400' : 'text-gray-500'}`}>
          {charsRemaining}
        </span>
        <div className="flex items-center gap-3">
          {error && <span className="text-red-400 text-sm">{error}</span>}
          <button
            onClick={handleSubmit}
            disabled={isDisabled}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-400 text-white px-4 py-1.5 rounded font-medium transition-colors"
          >
            {sending ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
}
