import type { Message } from '@anon-chat/shared';
import { timeAgo } from '../utils/timeAgo';

interface Props {
  message: Message;
  isOwn: boolean;
}

export function MessageItem({ message, isOwn }: Props) {
  return (
    <div className={`p-4 rounded-lg flex flex-col gap-2 ${isOwn ? 'bg-gray-800 border-l-4 border-blue-500' : 'bg-gray-900'}`}>
      <p className="text-gray-100 whitespace-pre-wrap break-words">{message.text}</p>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-gray-500 text-sm">{timeAgo(message.createdAt)}</span>
        {isOwn && (
          <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
            you
          </span>
        )}
      </div>
    </div>
  );
}
