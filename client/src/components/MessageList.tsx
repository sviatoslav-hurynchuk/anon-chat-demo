import type { Message } from '@anon-chat/shared';
import { MessageItem } from './MessageItem';

interface Props {
  messages: Message[];
  currentUid: string | undefined;
  loading: boolean;
}

export function MessageList({ messages, currentUid, loading }: Props) {
  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-gray-900 h-24 rounded-lg p-4 flex flex-col gap-2">
            <div className="h-4 bg-gray-800 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-800 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No messages yet. Be the first to say something!
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {messages.map((msg) => (
        <MessageItem
          key={msg.id}
          message={msg}
          isOwn={msg.uid === currentUid}
        />
      ))}
    </div>
  );
}
