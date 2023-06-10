import jsonld from '@transmute/jsonld';
import CheckResult from './CheckResult';

import Ajv from 'ajv';

const ajv = new Ajv();

const check = async ({
  input,
  schema,
  documentLoader,
}: {
  input: string | object;
  schema?: any;
  documentLoader: (iri: string) => { document: any };
}) => {
  const customDocumentLoader = documentLoader;

  if (!documentLoader) {
    throw new Error('documentLoader is required when validating JSON-LD.');
  }

  try {
    let jsonldDoc: object;
    if (typeof input === 'string') {
      jsonldDoc = JSON.parse(input);
    } else {
      jsonldDoc = input;
    }

    if (schema) {
      const validate = ajv.compile(schema);
      const valid = validate(input);
      if (!valid) {
        return new CheckResult(
          false,
          'JSON_SCHEMA_VALIDATION_ERROR',
          validate.errors as any
        );
      }
    }

    const unmappedProperties: string[] = [];

    const expansionMap = (info: any) => {
      if (info) {
        if (info.activeProperty) {
          unmappedProperties.push(
            `${info.activeProperty}.${info.unmappedProperty}`
          );
        } else if (info.unmappedProperty) {
          unmappedProperties.push(info.unmappedProperty);
        }
      }
    };

    // Remove all keys not present in the jsonld context
    const expanded = await jsonld.expand(jsonldDoc, {
      documentLoader: customDocumentLoader,
      expansionMap,
    });
    await jsonld.compact(expanded, (jsonldDoc as any)['@context'], {
      documentLoader: customDocumentLoader,
    });

    if (unmappedProperties.length === 0) {
      return new CheckResult(true);
    }
    return new CheckResult(
      false,
      'MISSING_PROPERTIES_IN_CONTEXT',
      unmappedProperties as any
    );
  } catch (err) {
    return new CheckResult(false, err.name, err.message);
  }
};

export default check;
