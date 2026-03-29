/**
 * @spec docs/specs/open-source-libs.md
 * Provider-agnostic TEE attestation report types.
 */
import { z } from "zod";

/**
 * A provider-agnostic TEE attestation report.
 *
 * Matches the Rust `AttestationReport` struct in the `attestation-report` crate.
 * Use {@link AttestationReportSchema} for runtime validation.
 */
export interface AttestationReport {
  /** The TEE provider. Common values: `"dstack"`, `"nitro"`, `"sev"`. */
  provider: string;
  /** Raw attestation quote bytes from the hardware/hypervisor. */
  quote: Uint8Array;
  /** Measurement of the running code (MRTD, PCR values, etc.). */
  measurement: Uint8Array;
  /** Unix timestamp (seconds) when the attestation was generated. */
  timestamp: number;
}

/**
 * Zod schema for runtime validation of {@link AttestationReport}.
 *
 * @example
 * ```typescript
 * import { AttestationReportSchema } from "attestation-report";
 *
 * const result = AttestationReportSchema.safeParse(untrustedInput);
 * if (!result.success) {
 *   console.error("Invalid attestation report:", result.error);
 * }
 * ```
 */
export const AttestationReportSchema: z.ZodType<AttestationReport> = z.object({
  provider: z.string().min(1),
  quote: z.instanceof(Uint8Array),
  measurement: z.instanceof(Uint8Array),
  timestamp: z.number().int().nonnegative(),
});
