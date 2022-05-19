export interface ClientDto {
    id: number;
    name: string;
    remoteClientId: string;
    createdByUserId?: string;
    teamEmails?: string | string[];
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
