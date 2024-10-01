export class CreateBookListDto {
    readonly list_name: string;
    readonly description?: string;
    readonly user_id: number;
    readonly creation_date: Date = new Date();
}
