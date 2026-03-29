// Spec: docs/specs/open-source-libs.md

//! Provider-agnostic TEE attestation report types.
//!
//! This crate defines a common [`AttestationReport`] struct that works across
//! TEE providers — Intel TDX (via dstack), AWS Nitro, AMD SEV-SNP, and others.
//! It is intentionally minimal: just serialisable data with no verification logic.
//!
//! For verification, pair this with a provider-specific verifier such as
//! [`prisma-ra-tls`](https://github.com/TeeSQL/prisma-ra-tls) (TDX/dstack).
//!
//! # Example
//!
//! ```
//! use attestation_report::AttestationReport;
//!
//! let report = AttestationReport {
//!     provider: "dstack".to_string(),
//!     quote: vec![0x01, 0x02, 0x03],
//!     measurement: vec![0xab; 48],
//!     timestamp: 1_700_000_000,
//! };
//!
//! let json = serde_json::to_string(&report).unwrap();
//! let decoded: AttestationReport = serde_json::from_str(&json).unwrap();
//! assert_eq!(report, decoded);
//! ```

use serde::{Deserialize, Serialize};

/// A provider-agnostic TEE attestation report.
///
/// This struct captures the essential fields common across all major TEE
/// attestation formats, allowing code to work with attestations from different
/// providers without switching types.
///
/// # Providers
///
/// | `provider` value | TEE Platform |
/// |---|---|
/// | `"dstack"` | Intel TDX via dstack guest agent |
/// | `"nitro"` | AWS Nitro Enclaves |
/// | `"sev"` | AMD SEV-SNP |
///
/// # Serialization
///
/// This type implements `serde::Serialize` and `serde::Deserialize`. The
/// `quote` and `measurement` fields serialize as arrays of integers in JSON.
///
/// ```
/// use attestation_report::AttestationReport;
///
/// let report = AttestationReport {
///     provider: "dstack".to_string(),
///     quote: vec![1, 2, 3],
///     measurement: vec![0; 48],
///     timestamp: 0,
/// };
/// let json = serde_json::to_string(&report).unwrap();
/// assert!(json.contains("\"provider\":\"dstack\""));
/// ```
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct AttestationReport {
    /// The TEE provider that generated this report.
    /// Common values: `"dstack"`, `"nitro"`, `"sev"`.
    pub provider: String,
    /// Raw attestation quote bytes as produced by the hardware/hypervisor.
    pub quote: Vec<u8>,
    /// Measurement of the running code (e.g. MRTD for TDX, PCR values for TPM).
    pub measurement: Vec<u8>,
    /// Unix timestamp (seconds since epoch) when the attestation was generated.
    pub timestamp: u64,
}
