import * as Factory from "factory.ts";

export type DidMethod = 'example' | 'key' | 'web';
export type DidMethodSpecificId = string
export type Did = `did:${DidMethod}:${DidMethodSpecificId}`;
export type DidPath = string;
export type DidQuery = string;
export type DidFragment = string;
export type DidUrl = `${Did}${DidPath}${DidQuery}${DidFragment}`

export type DidDocument = {
  id: Did;
  [property: string]: any;
};
export type DidResolutionMetadata = {
  [property: string]: any;
};
export type DidDocumentMetadata = {
  [property: string]: any;
};
export type DidResoluton = {
  didDocument: DidDocument;
  didDocumentMetadata?: DidDocumentMetadata;
  didResolutionMetadata?: DidResolutionMetadata;
};
export type DidResolver = (iri: Did) => Promise<DidResoluton>;
type DidDereferencer = (iri: DidUrl) => Promise<any>;


export type StartsWithDidResolver = {
  resolve: DidResolver;
  [startsWith: Did]: DidResolver;
};

export type StartsWithDidDereferencer = {
  dereference: DidDereferencer;
  [startsWith: Did]: DidDereferencer;
};


const invokeByPrefix = (instance: any, operation: 'resolve' | 'dereference', id: Did | DidUrl)=>{
  const startsWithKeys = Object.keys(instance).filter((k)=> k !== operation)
    for (const startWithKey of startsWithKeys){
      if (id.startsWith(startWithKey)){
        return (instance as any)[startWithKey](id)
      }
    }
    throw new Error('Unsupported iri ' + id);
}

export const resolutionFactoryDefault = {
  resolve: async function (did: Did)  {
    return invokeByPrefix(this, 'resolve', didUrlToDid(did as any))
  },
}

export const resolverFactory = Factory.makeFactory<StartsWithDidResolver>(resolutionFactoryDefault);

export const dereferenceFactoryDefault = {
  dereference: async function (didUrl: DidUrl)  {
    return invokeByPrefix(this, 'dereference', didUrl)
  },
}

export const dereferencerFactory = Factory.makeFactory<StartsWithDidDereferencer>(dereferenceFactoryDefault);

export const findFirstSubResourceWithId = (resource: any, id: string)=>{
  let subResource:any = null;
  function traverse(obj:any) {
    for (let k in obj) {
      if (typeof obj[k] === "object") {
        traverse(obj[k])
      } else {
        if (obj.id === id){
          subResource = obj
          return;
        }
      }
    }
  }
  traverse(resource)
  return subResource
}

export const didUrlToDid = (didUrl: DidUrl): Did =>{
  const didUrlRegex = new RegExp(/did:(?<method>[a-z0-9:]*):(?<idchar>([a-zA-Z0-9.\-_]+|%[0-9a-fA-F]{2})+)(?<path>(\/[^?]+))?(?<query>(\?[^#]+))?(?<fragment>(\#[^\n]+))?/);
  const match = didUrl.match(didUrlRegex)
  if (!match?.groups){
    throw new Error('Malformed did url: ' + didUrl)
  }
  const { method, idchar} = match?.groups
  return `did:${method}:${idchar}` as Did
}