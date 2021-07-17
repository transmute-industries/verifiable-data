// strict expansion map disallows dropping properties when expanding by default
export default (info: any) => {
  if (info.unmappedProperty) {
    throw new Error(
      `The property "${info.unmappedProperty}" in the input was not defined in the context.`
    );
  }
};
