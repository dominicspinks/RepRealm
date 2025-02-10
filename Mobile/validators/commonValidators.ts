import { z } from "zod";
import { uuidv7 } from "uuidv7";

// Generic UUIDv7 validator
export const UUIDv7Schema = z.string().uuid().optional().default(() => uuidv7());

// Generic function to validate UUID
export function validateUUID(id: string) {
    const result = UUIDv7Schema.safeParse(id);
    if (!result.success) {
        throw new Error("Invalid UUID format");
    }
    return result.data;
}
