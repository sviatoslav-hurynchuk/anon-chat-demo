/** A single chat message stored in Firebase Realtime DB */
export interface Message {
  /** Firebase push key */
  id: string;
  /** Message body (max 280 chars) */
  text: string;
  /** Firebase anonymous UID of the author */
  uid: string;
  /** Unix timestamp in milliseconds (ServerValue.TIMESTAMP) */
  createdAt: number;
}

/** POST /api/messages request body */
export interface CreateMessageRequest {
  text: string;
}

/** POST /api/messages response */
export interface CreateMessageResponse {
  id: string;
  message: string;
}

/** Error response shape */
export interface ApiError {
  error: string;
}

/** Raw message record as stored in Realtime DB (before adding `id`) */
export type MessageRecord = Omit<Message, 'id'>;

/** Max message length */
export const MAX_MESSAGE_LENGTH = 280;
