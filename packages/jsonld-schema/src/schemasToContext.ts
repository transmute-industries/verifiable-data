const getIntermediateFromDirectory = (files: any[]) => {
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
            intermediate[$classComment['@id']].classProperties[
              $propertyComment['@id']
            ] = {
              $comment: $propertyComment,
              title: prop.title,
              description: prop.description,
            };
          }
        });
      }
    }
  });
  return intermediate;
};

const getContextFromIntermediate = (intermediate: any) => {
  let partialContext = {};
  Object.values(intermediate).forEach((classDefinition: any) => {
    let propertDefinitionPartialContext = {};
    Object.values(classDefinition.classProperties).forEach(
      (classProperty: any) => {
        propertDefinitionPartialContext = {
          ...propertDefinitionPartialContext,
          [classProperty.$comment.term]: {
            '@id': classProperty.$comment['@id'],
          },
        };
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
  return {
    '@context': {
      '@version': 1.1,
      id: '@id',
      type: '@type',
      ...partialContext,
    },
  };
};

export const schemasToContext = (schemas: any[]) => {
  const intermediate = getIntermediateFromDirectory(schemas);
  return getContextFromIntermediate(intermediate);
};
