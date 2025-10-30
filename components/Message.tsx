import { Message as MessageType } from '@/types/chat';

interface MessageProps {
  message: MessageType;
  isOwnMessage: boolean;
}

export default function Message({ message, isOwnMessage }: MessageProps) {
  const formattedTime = new Date(message.timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`flex w-full ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[70%] rounded-lg px-4 py-2 ${
          isOwnMessage
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100'
        }`}
      >
        {!isOwnMessage && (
          <div className="mb-1 text-xs font-semibold">{message.username}</div>
        )}
        <div className="break-words">{message.content}</div>
        <div
          className={`mt-1 text-xs ${
            isOwnMessage ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          {formattedTime}
        </div>
      </div>
    </div>
  );
}
