export interface Message {
    id: number;
    senderId: number;
    senderKNownAs: string;
    senderPhotoUrl: string;
    recipientId: number;
    receipientKnownAs: string;
    receipientPhotoUrl: string;
    content: string;
    isRead: boolean;
    dateRead: Date;
    messageSent: Date;
}
