import * as Factory from "factory.ts";

export type DidMethod = 'example' | 'key' | 'web';
export type DidMethodSpecificId = string
export type Did = `did:${DidMethod}:${DidMethodSpecificId}`;
export type DidPath = string;
export type DidQuery = string;
export type DidFragment = string;
export type DidUrl = `${Did}${DidPath}${DidQuery}${DidFragment}`
export type Url = `http${string}`;

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

export type Context = {
  "@context": object | string
  [property: string]: any;
}

export type DocumentLoaderResponse = {
  document: Context | DidDocument | any
}


export type DidResolver = (iri: Did) => Promise<DidResoluton>;
export type DidDereferencer = (iri: DidUrl) => Promise<any>;
export type ContextResolver = (iri: string) => Promise<Context>;
export type DocumentLoader = (iri: Did | DidUrl | string) => Promise<DocumentLoaderResponse>;


export interface ContextMapResolver  {
  load: ContextResolver;
};

export type ContextMap = {
  [contextUrl: Url]: ContextResolver;
}

export interface StartsWithDidResolver  {
  resolve: DidResolver;
};

export interface ResolverMap  {
  [startsWith: Did]: DidResolver;
};

export interface StartsWithDidDereferencer  {
  dereference: DidDereferencer;
};

export interface DereferenceMap  {
  [startsWith: Did]: DidDereferencer;
};


const invokeByPrefix = (instance: any, id: Did | DidUrl | string)=>{

  if (instance[id]){
    return instance[id]
  } 

  const loaders = ['load', 'resolve', 'dereference'];
  const startsWithKeys = Object.keys(instance).filter((k)=> !loaders.includes(k))
  for (const startWithKey of startsWithKeys){
    if (id.startsWith(startWithKey)){
      return instance[startWithKey](id)
    }
  }
  throw new Error('Unsupported iri ' + id);
}

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

export const resolutionFactoryDefault = {
  resolve: async function (did: Did)  {
    return invokeByPrefix(this, didUrlToDid(did as any))
  },
}

export interface DidResolverFactory extends ResolverMap, StartsWithDidResolver {}
export const resolverFactory = Factory.makeFactory<DidResolverFactory>(resolutionFactoryDefault);

export const dereferenceFactoryDefault = {
  dereference: async function (didUrl: DidUrl)  {
    return invokeByPrefix(this,  didUrl)
  },
}

export interface DidDereferencerFactory extends DereferenceMap, StartsWithDidDereferencer {}
export const dereferencerFactory = Factory.makeFactory<DidDereferencerFactory>(dereferenceFactoryDefault);

export const contextFactoryDefault = {
  load: async function (iri: string): Promise<Context>  {
    return invokeByPrefix(this,  iri)
  },
}

export interface ContextFactory extends ContextMap, ContextMapResolver {}
export const contextFactory = Factory.makeFactory<ContextFactory>(contextFactoryDefault);

export interface DocumentLoaderFactory extends 
ContextMapResolver, 
StartsWithDidResolver, 
StartsWithDidDereferencer {}

const iriToLoader = (iri:string): 'load' | 'resolve' | 'dereference' => {
  if (iri.startsWith('http')){
    return 'load'
  }
  // we don't use resolve any more, dereference is a super set. 
  if (iri.startsWith('did')){
    return 'dereference' 
  }
  throw new Error('Unsupported iri: ' + iri)
}

const internalDocumentLoaderFactory:any = Factory.makeFactory<DocumentLoaderFactory>({
  ...contextFactoryDefault, 
  ...resolutionFactoryDefault, 
  ...dereferenceFactoryDefault
});
const originalBuilder = internalDocumentLoaderFactory.build;
// this time, make the builder return a documentLoader that is ready for use.
internalDocumentLoaderFactory.build = function (args: ContextMap | ResolverMap | DereferenceMap ): DocumentLoader {
  const internal = originalBuilder(args);
  return async (iri:string) => {
    const loader = iriToLoader(iri)
    const document = await internal[loader](iri)
    return { document }
  }
}
export const documentLoaderFactory = internalDocumentLoaderFactory