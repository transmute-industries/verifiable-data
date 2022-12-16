import moment from "moment";

// https://www.w3.org/TR/xmlschema11-2/#dateTime
// Modified for leap seconds
const xmlDateSchemaRegex = /-?([1-9][0-9]{3,}|0[0-9]{3})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])T(([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)(\.[0-9]+)?|(24:00:00(\.0+)?))(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?/;

// Modified for leap seconds
export const ISO_8601_FULL = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5][0-9]([\.,]\d+)?|:60([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;

export const TIME_ZONE_OFFSET_MATCH = /[+-]\d\d:\d\d$/;

// for the sake of safety, we check the date
// against ISO 8601 and moment.
// see also: https://github.com/w3c/vc-data-model/issues/782
export const checkDate = (
  datetime: string,
  isJWT: boolean = false
): { valid: boolean; warnings: string[] } => {
  const res: { valid: boolean; warnings: string[] } = {
    valid: false,
    warnings: []
  };
  // open source vc, make sure validation tests date strings are the right format for the date
  if (!ISO_8601_FULL.test(datetime)) {
    res.warnings.push(`${datetime} is not a legal ISO 8601 Date Time.`);
  }

  if (!xmlDateSchemaRegex.test(datetime)) {
    res.warnings.push(
      `${datetime} is not a XMLSCHEMA11-2 date-time. See: https://www.w3.org/TR/vc-data-model/#issuance-date, https://www.w3.org/TR/xmlschema11-2/#dateTime`
    );
  }

  moment.suppressDeprecationWarnings = true;
  // If leap second (60 seconds) make it a valid date
  let newDatetime = datetime;
  let isLeapSecond = false;
  try {
    if (newDatetime.split(":")[2].substring(0, 2) === "60") {
      newDatetime = newDatetime.replace("60", "59");
      const newDate = new Date(newDatetime);
      newDate.setSeconds(new Date(newDatetime).getSeconds() + 1);
      newDatetime = newDate.toISOString();
      isLeapSecond = true;
    }
  } catch (err) {}
  if (moment(newDatetime).toISOString() === null) {
    res.warnings.push(
      `${datetime} could not be parsed and serialized as ISO 8601 Date Time.`
    );
  }

  if (isJWT) {
    if (isLeapSecond) {
      res.warnings.push(`${datetime} lost leap second information.`);
    }
    if (TIME_ZONE_OFFSET_MATCH.test(datetime)) {
      res.warnings.push(`${datetime} lost timezone offset information.`);
    }
    if (new Date(newDatetime).getMilliseconds()) {
      res.warnings.push(`${datetime} lost millisecond information.`);
    }
  }
  moment.suppressDeprecationWarnings = false;

  res.valid = res.warnings.length === 0;
  return res;
};
