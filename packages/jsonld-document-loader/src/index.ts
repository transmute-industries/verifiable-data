import * as Factory from "factory.ts";

export type DidMethod = 'example' | 'key' | 'web' | 'photon' | 'elem' | 'elem:ropsten' | string;
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
  "@context": object | string | string[]
  [property: string]: any;
}

export type DocumentLoaderResponse = {
  document: Context | DidDocument | any
}

export type ContextContentType = 'application/json' | 'application/ld+json'
export type DidDocumentType = 'application/did+json' | 'application/did+ld+json'

export interface ContextResolutionOptions {
  accept: ContextContentType;
}

export interface DidResolutionOptions {
  accept:  DidDocumentType
}
export interface DocumentLoaderOptions {
  accept: ContextContentType | DidDocumentType
}

export type DidResolver = (iri: Did, options?:DidResolutionOptions) => Promise<DidResoluton>;
export type DidDereferencer = (iri: DidUrl, options?: DidResolutionOptions) => Promise<any>;
export type ContextResolver = (iri: Url, options?: ContextResolutionOptions) => Promise<Context>;

export type DocumentLoader = (iri: Iri, options?: DocumentLoaderOptions) => Promise<DocumentLoaderResponse>;


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

export type Iri = Did | DidUrl | Url



export const findFirstSubResourceWithId = (resource: any, id: Iri)=>{
  if (resource.id === id){
    return resource;
  }
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


const invokeByPrefix = (instance: ContextFactory | DidDereferencerFactory | DidResolverFactory, id: Iri, options?: DocumentLoaderOptions) => {

  if ((instance as any)[id]){
    return (instance as any)[id]
  } 

  const loaders = ['load', 'resolve', 'dereference'];
  const startsWithKeys = Object.keys(instance).filter((k)=> !loaders.includes(k))
  for (const startWithKey of startsWithKeys){
    if (id.startsWith(startWithKey)){
      return (instance as any)[startWithKey](id, options)
    }
  }

  throw new Error('Unsupported iri ' + id);
}


export const resolutionFactoryDefault = {
  resolve: async function (did: Did, options?: DidResolutionOptions)  {
    return invokeByPrefix(this, did, options)
  },
}

export interface DidResolverFactory extends ResolverMap, StartsWithDidResolver {}
export const resolverFactory = Factory.makeFactory<DidResolverFactory>(resolutionFactoryDefault);

export const dereferenceFactoryDefault = {
  dereference: async function (didUrl: DidUrl, options?: DidResolutionOptions)  {
    return invokeByPrefix(this,  didUrl, options)
  },
}

export interface DidDereferencerFactory extends DereferenceMap, StartsWithDidDereferencer {}
export const dereferencerFactory = Factory.makeFactory<DidDereferencerFactory>(dereferenceFactoryDefault);

export const contextFactoryDefault = {
  load: async function (iri: Url, options?: ContextResolutionOptions): Promise<Context>  {
    return invokeByPrefix(this,  iri, options)
  },
}

export interface ContextFactory extends ContextMap, ContextMapResolver {}
export const contextFactory = Factory.makeFactory<ContextFactory>(contextFactoryDefault);

export interface DocumentLoaderFactory extends 
ContextMapResolver, 
StartsWithDidResolver, 
StartsWithDidDereferencer {}

const iriToLoader = (iri:string): 'load' | 'resolve' => {
  if (iri.startsWith('http')){
    return 'load'
  }
  // we don't use resolve any more, dereference is a super set. 
  if (iri.startsWith('did')){
    return 'resolve' 
  }
  throw new Error('Unsupported iri: ' + iri)
}

const internalDocumentLoaderFactory:any = Factory.makeFactory<DocumentLoaderFactory>({
  ...contextFactoryDefault, 
  ...resolutionFactoryDefault, 
  ...dereferenceFactoryDefault
});
const originalBuilder = internalDocumentLoaderFactory.build;
internalDocumentLoaderFactory.build = function (args: ContextMap | ResolverMap | DereferenceMap ): DocumentLoader {
  const internal = originalBuilder(args);
  return async (iri: Iri, options?: DocumentLoaderOptions) => {
    const loader = iriToLoader(iri)
    const resource = await internal[loader](iri, options)

    if (!(iri.includes('/') &&  iri.includes('?') &&  iri.includes('#')))  {
      return { document: resource }
    }

    const subResource = await findFirstSubResourceWithId(resource, iri)
    if (options && options.accept.includes('ld+json')){
      subResource['@context'] = resource['@context'];
    }
    return { document: subResource }
    
  }
}
export const documentLoaderFactory = internalDocumentLoaderFactory