export interface ClientDto {
    id: number;
    name: string;
    remoteClientId: string;
    createdByUserId?: string;
    teamEmails?: Array;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
