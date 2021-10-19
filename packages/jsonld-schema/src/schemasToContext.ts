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
      }
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

export const intermediateToContext = (intermediate: any, version: number, rootTerms: any) => {
  let partialContext = {};
  Object.values(intermediate).forEach((classDefinition: any) => {
    let propertDefinitionPartialContext = {};
    Object.values(classDefinition.classProperties).forEach((classPropertyArray: any) => {
      classPropertyArray.forEach((classProperty: any) => {
        propertDefinitionPartialContext = {
          ...propertDefinitionPartialContext,
          [classProperty.$comment.term]: {
            '@id': classProperty.$comment['@id'],
          },
        };
      });
    });

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
      '@version': version,
      id: '@id',
      type: '@type',
      ...rootTerms,
      ...partialContext,
    },
  };
};

export const schemasToContext = (schemas: any[], version: number, rootTerms: any) => {
  const intermediate = schemasToIntermediate(schemas);
  return intermediateToContext(intermediate, version, rootTerms);
};
