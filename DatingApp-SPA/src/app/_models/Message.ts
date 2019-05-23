export interface Message {
    id: number;
    senderId: number;
    senderKnownAs: string;
    senderPhotoUrl: string;
    receipientId: number;
    receipientKnownAs: string;
    receipientPhotoUrl: string;
    content: string;
    isRead: boolean;
    dateRead: Date;
    messageSent: Date;
}
