import { InternalServerError } from "../errors/internal-server-error";
import { db } from "../prisma/db";

export abstract class BaseRepository {
    protected db: typeof db;
    protected models: typeof db.orm.public;

    constructor() {
        this.db = db;
        this.models = db.orm.public;
    }

    protected handleError(e: unknown, message: string): never {
        console.error(e);
        throw new InternalServerError(message);
    }
}
