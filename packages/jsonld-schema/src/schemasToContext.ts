const defineClassPropertiesFromComment = (
  classProperties: any,
  comment: any,
  title: string,
  description: string
) => {
  if (classProperties[comment['@id']]) {
    classProperties[comment['@id']] = [
      ...classProperties[comment['@id']],
      {
        $comment: comment,
        title: title,
        description: description,
      },
    ];
  } else {
    classProperties[comment['@id']] = [
      {
        $comment: comment,
        title: title,
        description: description,
      },
    ];
  }
};

export const schemasToIntermediate = (files: any[]) => {
  const intermediate: any = {};

  files.forEach((file: any) => {
    if (file.$comment) {
      const $classComment = JSON.parse(file.$comment);
      if (!intermediate[$classComment['@id']]) {
        intermediate[$classComment['@id']] = {
          $id: file.$id,
          $schema: file.$schema,
          $comment: $classComment,
          title: file.title,
          description: file.description,
          classProperties: {},
          schema: file,
        };
      }

      if (file.properties) {
        Object.values(file.properties).forEach((prop: any) => {
          if (prop.$comment) {
            const $propertyComment = JSON.parse(prop.$comment);
            defineClassPropertiesFromComment(
              intermediate[$classComment['@id']].classProperties,
              $propertyComment,
              prop.title,
              prop.description
            );
          }
        });
      }
    }
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
            [classProperty.$comment.term]: {
              '@id': classProperty.$comment['@id'],
            },
          };
        });
      }
    );

    partialContext = {
      ...partialContext,
      [classDefinition.$comment.term]: {
        '@id': classDefinition.$comment['@id'],
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
