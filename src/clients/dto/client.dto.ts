export interface ClientDto {
    id: number;
    name: string;
    remoteClientId: string;
    createdByUserId?: string;
    teamEmails?: string[];
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
