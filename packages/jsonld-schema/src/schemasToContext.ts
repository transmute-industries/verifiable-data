//  const $propertyComment = JSON.parse(prop.$comment);
//  const $propertyId = $propertyComment['@id'];
//  let entity =
//    intermediate[$classComment['@id']].classProperties[$propertyId];
//  if (entity) {
//    console.log('collision!', prop);
//  } else {
//  }

//  entity = {
//    $comment: $propertyComment,
//    title: prop.title,
//    description: prop.description,
//  };
const defineClassPropertiesFromComment = (
  classProperties: any,
  comment: any,
  title: string,
  description: string
) => {
  if (classProperties[comment['@id']]) {
    console.warn('collission');
    if (Array.isArray(classProperties[comment['@id']])) {
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
        classProperties[comment['@id']],
        {
          $comment: comment,
          title: title,
          description: description,
        },
      ];
    }
  } else {
    classProperties[comment['@id']] = {
      $comment: comment,
      title: title,
      description: description,
    };
  }
};

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

const getContextFromIntermediate = (intermediate: any) => {
  let partialContext = {};
  Object.values(intermediate).forEach((classDefinition: any) => {
    let propertDefinitionPartialContext = {};
    Object.values(classDefinition.classProperties).forEach(
      (classProperty: any) => {
        if (Array.isArray(classProperty)) {
          classProperty.forEach(classProp => {
            propertDefinitionPartialContext = {
              ...propertDefinitionPartialContext,
              [classProp.$comment.term]: {
                '@id': classProp.$comment['@id'],
              },
            };
          });
        } else {
          propertDefinitionPartialContext = {
            ...propertDefinitionPartialContext,
            [classProperty.$comment.term]: {
              '@id': classProperty.$comment['@id'],
            },
          };
        }
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
  console.log(JSON.stringify(intermediate, null, 2));
  return getContextFromIntermediate(intermediate);
};
