import { useAuth } from '../hooks/useAuth';
import { useMessages } from '../hooks/useMessages';
import { MessageInput } from './MessageInput';
import { MessageList } from './MessageList';

export function ChatRoom() {
  const { user, loading: authLoading, error: authError } = useAuth();
  const { messages, loading: messagesLoading, error: messagesError } = useMessages();

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-400">Loading anonymous session...</div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-400">Error connecting: {authError}</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col h-full">
      <header className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Anonymous Chat</h1>
        <p className="text-gray-400 text-sm">
          No sign-up. Everything you post appears instantly for everyone.
        </p>
      </header>

      <main className="flex-1 pb-8">
        <MessageInput />
        
        {messagesError && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded mb-4 text-sm">
            {messagesError}
          </div>
        )}
        
        <MessageList 
          messages={messages} 
          currentUid={user?.uid} 
          loading={messagesLoading} 
        />
      </main>
    </div>
  );
}
