import { createSchema } from 'genson-js';

export const jsonldToSchema = (document: any, options: any) => {
  const clone = { ...document };
  const context = { ...clone['@context'] };
  delete clone['@context'];
  const schema: any = createSchema(clone);
  schema.$id = options.baseUrl + '/' + document.type + '.json';
  delete schema.required;

  schema.$comment = JSON.stringify({
    term: document.type,
    '@id': context[document.type]['@id'],
  });
  schema.title = '';
  schema.description = '';
  Object.keys(schema.properties).forEach((key: any) => {
    if (key === 'type') {
      return;
    }
    const prop = schema.properties[key];
    schema.properties[key] = {
      $comment: JSON.stringify({
        term: key,
        '@id': context[key]['@id'],
      }),
      title: '',
      description: '',
      ...prop,
    };
    return;
  });

  return {
    $id: schema.$id,
    $comment: schema.$comment,
    title: schema.title,
    description: schema.description,
    ...schema,
  };
};
