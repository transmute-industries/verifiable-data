import moment from "moment";

import { ISO_8601_FULL } from "./checkDate";

// https://w3c.github.io/vc-data-model/#issuance-date
describe("ISO_8601 vs RFC_3339", () => {
  it("with T", () => {
    const example = "2019-10-12T07:20:50.52Z";
    expect(ISO_8601_FULL.test(example)).toBe(true);
    // note the extra appended 0.
    expect(moment(example).toISOString()).toBe("2019-10-12T07:20:50.520Z");
  });

  it("without T", () => {
    const example = "2019-10-12 07:20:50.52Z";
    expect(ISO_8601_FULL.test(example)).toBe(false); // proof that RFC 3339 is NOT a profile of ISO_8601
    // note the extra appended 0.
    expect(moment(example).toISOString()).toBe("2019-10-12T07:20:50.520Z");
  });

  it("invalid month and day.", () => {
    const example = "2013-99-99T04:13:00+00:00";
    expect(ISO_8601_FULL.test(example)).toBe(false); // only because of fancy regex...
    expect(moment(example).toISOString()).toBe(null);
  });

  it("without capital T & Z", () => {
    const example = "2019-10-12t07:20:50.52z";
    expect(ISO_8601_FULL.test(example)).toBe(false); // proof that RFC 3339 is NOT a profile of ISO_8601
    // note the extra appended 0.
    console.warn = () => {}; // obviously moment complains when asked to handle this....
    expect(moment(example).toISOString()).toBe("2019-10-12T07:20:50.520Z");
  });
});
