export const getSuite = async (
  keyJson: any,
  KeyClass: any,
  SuiteClass: any
): Promise<any> => {
  return new SuiteClass({
    key: await KeyClass.from(keyJson)
  });
};
