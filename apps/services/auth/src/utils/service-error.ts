import { PrismaClientKnownRequestError } from "@prisma/runtime/library";
import AuthResponse from "utils/response";

export const PrismaErrorCode = {
    ALREADY_EXISTS:      "P2002",
    NOT_FOUND:           "P2025",
    PERMISSION_DENIED:   "42501",
    BAD_REQUEST : "400"
} as const;

export const PrismaErrorCodeReverse = {
    "P2002":   "ALREADY_EXISTS",
    "P2025":   "NOT_FOUND",
    "42501":   "PERMISSION_DENIED",
    "400"   : "BAD_REQUEST"
} as const;

export type OverrideMap = {
    [K in keyof typeof PrismaErrorCode]?: string;
};

export function HandleServiceErrors(
    err: any,
    resourceName: string | null,
    overrides?: OverrideMap
) {
    const name = resourceName || "Resource";

    if (err.details instanceof PrismaClientKnownRequestError) {
        const code = err.details.code as keyof typeof PrismaErrorCodeReverse;
        const key  = PrismaErrorCodeReverse[code];
        
        // If code is not in our reverse map, treat it as unhandled
        if (!key) {
            return AuthResponse.INTERNAL(err);
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
            case "400":
                return AuthResponse.UN_AUTHENTICATD(
                    null,
                    msg || `${name} is not authenticated.`
                );
            default:
                return AuthResponse.INTERNAL(err);
        }
    }

    return AuthResponse.INTERNAL(err);
}
