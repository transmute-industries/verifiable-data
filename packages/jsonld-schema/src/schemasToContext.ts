const embeddingAttributeNames = ['$comment', '$linkedData'];

const extractEmbedding = (embedding: any, attribute = '$comment') => {
  if (attribute === '$comment') {
    return JSON.parse(embedding[attribute]);
  }
  if (attribute === '$linkedData') {
    return embedding[attribute];
  }
  throw new Error('Cannot extract unsupported embedding: ' + attribute);
};

const defineAttributesFromLinkedData = (
  classProperties: any,
  linkedData: any,
  title: string,
  description: string
) => {
  if (classProperties[linkedData['@id']]) {
    classProperties[linkedData['@id']] = [
      ...classProperties[linkedData['@id']],
      {
        title: title,
        description: description,
        linkedData: linkedData,
      },
    ];
  } else {
    classProperties[linkedData['@id']] = [
      {
        title: title,
        description: description,
        linkedData: linkedData,
      },
    ];
  }
};

const handleClassEmbeddings = (
  file: any,
  intermediate: any,
  classEmbedding: string
) => {
  const embeddedLinkedDataClass = extractEmbedding(file, classEmbedding);
  if (!intermediate[embeddedLinkedDataClass['@id']]) {
    intermediate[embeddedLinkedDataClass['@id']] = {
      $id: file.$id,
      $schema: file.$schema,
      linkedData: embeddedLinkedDataClass,
      title: file.title,
      description: file.description,
      classProperties: {},
      schema: file,
    };
  }
  return embeddedLinkedDataClass;
};

const handlePropertyEmbeddings = (
  file: any,
  intermediate: any,
  classEmbedding: string,
  embeddedLinkedDataClass: any
) => {
  Object.values(file.properties).forEach((prop: any) => {
    embeddingAttributeNames.forEach(propertyEmbedding => {
      if (prop[propertyEmbedding]) {
        const embeddedLinkedDataProperty = extractEmbedding(
          prop,
          classEmbedding
        );
        defineAttributesFromLinkedData(
          intermediate[embeddedLinkedDataClass['@id']].classProperties,
          embeddedLinkedDataProperty,
          prop.title,
          prop.description
        );
      }
    });
  });
};

const handleFileEmbeddings = (file: any, intermediate: any) => {
  embeddingAttributeNames.forEach(classEmbedding => {
    if (file[classEmbedding]) {
      const embeddedLinkedDataClass = handleClassEmbeddings(
        file,
        intermediate,
        classEmbedding
      );

      // Need to handle anyOf and oneOf better...
      // if (file['anyOf']) {
      //   console.log('here!', file, embeddedLinkedDataClass);
      // }

      if (file.properties) {
        handlePropertyEmbeddings(
          file,
          intermediate,
          classEmbedding,
          embeddedLinkedDataClass
        );
      }
    }
  });
};

export const schemasToIntermediate = (files: any[]) => {
  const intermediate: any = {};
  files.forEach((file: any) => {
    handleFileEmbeddings(file, intermediate);
  });
  return intermediate;
};

export const intermediateToPartialContext = (intermediate: any) => {
  let partialContext = {};
  Object.values(intermediate).forEach((classDefinition: any) => {
    let propertDefinitionPartialContext = {};
    Object.values(classDefinition.classProperties).forEach(
      (classPropertyArray: any) => {
        classPropertyArray.forEach((classProperty: any) => {
          propertDefinitionPartialContext = {
            ...propertDefinitionPartialContext,
            [classProperty.linkedData.term]: {
              '@id': classProperty.linkedData['@id'],
            },
          };
        });
      }
    );

    partialContext = {
      ...partialContext,
      [classDefinition.linkedData.term]: {
        '@id': classDefinition.linkedData['@id'],
        '@context': {
          ...propertDefinitionPartialContext,
        },
      },
    };
  });
  return partialContext;
};

export const schemasToContext = (
  schemas: any[],
  {
    version = 1.1,
    vocab = 'https://w3id.org/traceability/#undefinedTerm',
    id = '@id',
    type = '@type',
    rootTerms = {},
  }: {
    version?: number;
    vocab?: string;
    id?: string;
    type?: string;
    rootTerms?: any;
  } = {}
) => {
  const intermediate = schemasToIntermediate(schemas);
  const partialContext = intermediateToPartialContext(intermediate);
  // console.log('handle AnyOf for ');
  // console.log(JSON.stringify(intermediate, null, 2));
  return {
    '@context': {
      '@version': version,
      '@vocab': vocab,
      id,
      type,
      ...rootTerms,
      ...partialContext,
    },
  };
};
