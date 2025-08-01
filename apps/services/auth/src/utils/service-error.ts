import { PrismaClientKnownRequestError } from "@prisma/runtime/library";
import AuthResponse from "utils/response";

export const PrismaErrorCode = {
    ALREADY_EXISTS:      "P2002",
    NOT_FOUND:           "P2025",
    PERMISSION_DENIED:   "42501", // Postgres permission denied SQLSTATE
} as const;

export const PrismaErrorCodeReverse = {
    "P2002":   "ALREADY_EXISTS",
    "P2025":   "NOT_FOUND",
    "42501":   "PERMISSION_DENIED",
} as const;

export type OverrideMap = {
    [K in keyof typeof PrismaErrorCode]?: string;
};

export function HandleServiceErrors(
    err: unknown,
    resourceName: string | null,
    overrides?: OverrideMap
) {
    const name = resourceName || "Resource";

    if (err instanceof PrismaClientKnownRequestError) {
        const code = err.code as keyof typeof PrismaErrorCodeReverse;
        const key  = PrismaErrorCodeReverse[code];

        // If code is not in our reverse map, treat it as unhandled
        if (!key) {
            return AuthResponse.INTERNAL();
        }

        const msg = overrides?.[key];

        switch (code) {
            case "P2002":
                return AuthResponse.ALREADY_EXISTS(
                    null,
                    msg || `${name} already exists with provided unique field.`
                );
            case "P2025":
                return AuthResponse.NOT_FOUND(
                    null,
                    msg || `${name} does not exist or could not be found.`
                );
            case "42501":
                return AuthResponse.FORBIDDEN(
                    null,
                    msg || `${name} does not have permissions.`
                );
            default:
                return AuthResponse.INTERNAL();
        }
    }

    return AuthResponse.INTERNAL();
}
