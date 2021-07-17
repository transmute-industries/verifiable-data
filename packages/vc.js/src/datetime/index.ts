import moment from "moment";

// thanks Mozilla... https://bugzilla.mozilla.org/attachment.cgi?id=351506&action=diff
// Killer regex to parse RFC3339 dates
export const RFC_3339 = new RegExp(
  "^([0-9]{4})-([0-9]{2})-([0-9]{2})" +
    "([Tt]([0-9]{2}):([0-9]{2}):([0-9]{2})(.[0-9]+)?)?" +
    "(([Zz]|([+-])([0-9]{2}):([0-9]{2})))?"
);

export const ISO_8601_FULL = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;

// https://www.w3.org/TR/NOTE-datetime-970915
export const isW3CDate = (datetime: string) => {
  try {
    const parsedDate = new Date(datetime);
    const str = parsedDate.toISOString();
    return str.substr(0, str.length - 5) + "Z" === datetime;
  } catch (e) {
    return false;
  }
};

export const isUnixTimestampStable = (datetime: string) => {
  const iso = moment(datetime)
    .utc()
    .format();
  const timestamp = moment(iso).unix();
  const backToIso = moment
    .unix(timestamp)
    .utc()
    .format();
  return backToIso === iso && iso === datetime;
};

// for the sake of safety, we check the date
// against RFC 3339 / ISO 8601 and moment.
// see also: https://github.com/w3c/vc-data-model/issues/782
export const checkDate = (
  datetime: string
): { valid: boolean; warnings: string[] } => {
  const res: { valid: boolean; warnings: string[] } = {
    valid: false,
    warnings: []
  };

  if (!ISO_8601_FULL.test(datetime)) {
    res.warnings.push(`${datetime} is not a legal ISO 8601 Date Time.`);
  }

  if (!RFC_3339.test(datetime)) {
    res.warnings.push(`${datetime} is not a legal RFC 3339 Date Time.`);
  }

  if (!isW3CDate(datetime)) {
    res.warnings.push(`${datetime} is not a W3C Date Time.`);
  }
  moment.suppressDeprecationWarnings = true;
  if (moment(datetime).toISOString() === null) {
    res.warnings.push(
      `${datetime} could not be parsed and serialized as ISO 8601 Date Time.`
    );
  }

  if (!isUnixTimestampStable(datetime)) {
    res.warnings.push(
      `${datetime} could not be converted to unix timestamp and back.`
    );
  }
  moment.suppressDeprecationWarnings = false;

  res.valid = res.warnings.length === 0;
  return res;
};
