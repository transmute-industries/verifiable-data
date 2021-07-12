class CheckResult {
  ok: boolean;
  error?: {
    type: string;
    details: string[];
  };
  constructor(ok: boolean, type = '', details = []) {
    this.ok = ok;
    if (!ok) {
      this.error = {
        type,
        details,
      };
    }
  }
}

export default CheckResult;
