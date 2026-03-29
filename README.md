# attestation-report

Provider-agnostic TEE attestation report types for Rust and TypeScript.

This library defines a single `AttestationReport` type that works across TEE providers — Intel TDX (via dstack), AWS Nitro Enclaves, AMD SEV-SNP, and others. It is intentionally minimal: serialisable data only, with no verification logic. Pair it with a provider-specific verifier for full attestation workflows.

## Quick Start

### Rust

```toml
# Cargo.toml
[dependencies]
attestation-report = "0.1"
serde_json = "1"
```

```rust
use attestation_report::AttestationReport;

let report = AttestationReport {
    provider: "dstack".to_string(),
    quote: vec![0x01, 0x02, 0x03],
    measurement: vec![0xab; 48],
    timestamp: 1_700_000_000,
};

let json = serde_json::to_string(&report).unwrap();
let decoded: AttestationReport = serde_json::from_str(&json).unwrap();
assert_eq!(report, decoded);
```

```sh
cargo add attestation-report
```

### TypeScript

```sh
npm install attestation-report
```

```typescript
import { AttestationReport, AttestationReportSchema } from "attestation-report";

const untrustedInput = {
  provider: "dstack",
  quote: new Uint8Array([0x01, 0x02, 0x03]),
  measurement: new Uint8Array(48).fill(0xab),
  timestamp: 1_700_000_000,
};

const result = AttestationReportSchema.safeParse(untrustedInput);
if (!result.success) {
  console.error("Invalid attestation report:", result.error);
} else {
  const report: AttestationReport = result.data;
  console.log("Provider:", report.provider);
}
```

## Field Reference

| Field | Rust type | TypeScript type | Description |
|---|---|---|---|
| `provider` | `String` | `string` | TEE provider identifier. Common values: `"dstack"`, `"nitro"`, `"sev"`. |
| `quote` | `Vec<u8>` | `Uint8Array` | Raw attestation quote bytes as produced by the hardware or hypervisor. |
| `measurement` | `Vec<u8>` | `Uint8Array` | Measurement of the running code — MRTD for TDX, PCR values for TPM, etc. |
| `timestamp` | `u64` | `number` | Unix timestamp (seconds since epoch) when the attestation was generated. |

### Provider values

| `provider` | Platform |
|---|---|
| `"dstack"` | Intel TDX via dstack guest agent |
| `"nitro"` | AWS Nitro Enclaves |
| `"sev"` | AMD SEV-SNP |

## See Also

- [prisma-ra-tls](https://github.com/TeeSQL/prisma-ra-tls) — TDX/dstack RA-TLS verifier for Prisma/PostgreSQL connections
- [ra-tls-proxy](https://github.com/TeeSQL/ra-tls-proxy) — RA-TLS terminating proxy for TEE services

## License

Apache-2.0. Copyright 2026 TeeSQL.
