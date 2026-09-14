import { AppError } from "./app-error";

export class BadRequestError extends AppError {
    constructor(message: string) {
        super(400, message);
        this.name = "BadRequestError";
    }
}
