import { RFC_3339, ISO_8601_FULL } from "./index";

import moment from "moment";

const validExamples = [
  // https://validator.w3.org/feed/docs/error/InvalidRFC3339Date.html
  "2002-10-02T10:00:00-05:00",
  "2002-10-02T15:00:00Z",
  "2002-10-02T15:00:00.05Z",
  // https://datatracker.ietf.org/doc/html/rfc3339#section-5.8
  "1985-04-12T23:20:50.52Z",
  "1996-12-19T16:39:57-08:00",
  "1990-12-31T23:59:60Z",
  "1937-01-01T12:00:27.87+00:20",

  // https://medium.com/easyread/understanding-about-rfc-3339-for-datetime-formatting-in-software-engineering-940aa5d5f68a
  "2019-10-12 07:20:50.52Z",

  // https://github.com/openlink/virtuoso-opensource/issues/619
  "2016-12-31T24:00:00"
];

// https://w3c.github.io/vc-data-model/#issuance-date

describe("valid", () => {
  validExamples.forEach(datetime => {
    it(`${datetime} MUST validate`, () => {
      expect(RFC_3339.test(datetime)).toBe(true);
    });
  });
});

describe("ISO_8601 vs RFC_3339", () => {
  it("with T", () => {
    const example = "2019-10-12T07:20:50.52Z";
    expect(RFC_3339.test(example)).toBe(true);
    expect(ISO_8601_FULL.test(example)).toBe(true);
    // note the extra appended 0.
    expect(moment(example).toISOString()).toBe("2019-10-12T07:20:50.520Z");
  });

  it("without T", () => {
    const example = "2019-10-12 07:20:50.52Z";
    expect(RFC_3339.test(example)).toBe(true);
    expect(ISO_8601_FULL.test(example)).toBe(false); // proof that RFC 3339 is NOT a profile of ISO_8601
    // note the extra appended 0.
    expect(moment(example).toISOString()).toBe("2019-10-12T07:20:50.520Z");
  });

  it("invalid month and day.", () => {
    const example = "2013-99-99T04:13:00+00:00";
    expect(RFC_3339.test(example)).toBe(true);
    expect(ISO_8601_FULL.test(example)).toBe(false); // only because of fancy regex...
    expect(moment(example).toISOString()).toBe(null);
  });

  it("without capital T & Z", () => {
    const example = "2019-10-12t07:20:50.52z";
    expect(RFC_3339.test(example)).toBe(true);
    expect(ISO_8601_FULL.test(example)).toBe(false); // proof that RFC 3339 is NOT a profile of ISO_8601
    // note the extra appended 0.
    console.warn = () => {}; // obviously moment complains when asked to handle this....
    expect(moment(example).toISOString()).toBe("2019-10-12T07:20:50.520Z");
  });
});
