import { useState, useEffect } from 'react';
import { ref, onValue, query, orderByChild, limitToLast } from 'firebase/database';
import { db } from '../firebase';
import type { Message } from '@anon-chat/shared';

export function useMessages(enabled = true) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const messagesRef = query(ref(db, 'messages'), orderByChild('createdAt'), limitToLast(100));
    
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          const msgs: Message[] = Object.entries(data).map(([id, val]: [string, any]) => ({
            ...val,
            id
          }));
          
          setMessages(msgs.sort((a, b) => b.createdAt - a.createdAt));
        } else {
          setMessages([]);
        }
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    }, (err) => {
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [enabled]);

  return { messages, loading, error };
}
