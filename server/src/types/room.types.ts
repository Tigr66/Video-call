import { db } from "../prisma/db";

export type Room = NonNullable<
    Awaited<ReturnType<typeof db.orm.public.Room.first>>
>;
