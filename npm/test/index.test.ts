import { describe, it, expect } from "vitest";
import { AttestationReportSchema } from "../src/index";

const validReport = {
  provider: "dstack",
  quote: new Uint8Array([0x01, 0x02, 0x03]),
  measurement: new Uint8Array(48).fill(0xab),
  timestamp: 1_700_000_000,
};

describe("AttestationReportSchema", () => {
  it("parses a valid attestation report", () => {
    const result = AttestationReportSchema.parse(validReport);
    expect(result.provider).toBe("dstack");
    expect(result.quote).toBeInstanceOf(Uint8Array);
    expect(result.measurement).toBeInstanceOf(Uint8Array);
    expect(result.timestamp).toBe(1_700_000_000);
  });

  it("fails when provider is an empty string", () => {
    const result = AttestationReportSchema.safeParse({
      ...validReport,
      provider: "",
    });
    expect(result.success).toBe(false);
  });

  it("fails when timestamp is negative", () => {
    const result = AttestationReportSchema.safeParse({
      ...validReport,
      timestamp: -1,
    });
    expect(result.success).toBe(false);
  });

  it("fails when quote is a plain array instead of Uint8Array", () => {
    const result = AttestationReportSchema.safeParse({
      ...validReport,
      quote: [0x01, 0x02, 0x03],
    });
    expect(result.success).toBe(false);
  });

  it("fails when measurement is missing", () => {
    const { measurement: _omitted, ...withoutMeasurement } = validReport;
    const result = AttestationReportSchema.safeParse(withoutMeasurement);
    expect(result.success).toBe(false);
  });
});
