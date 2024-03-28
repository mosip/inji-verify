const { Resolver } = await import('did-resolver');
const { getResolver } = await import('web-did-resolver');

export const resolveDid = async (did) => {
    const webResolver = getResolver();
    let didResolver = new Resolver({
        ...webResolver
    });

    return await didResolver.resolve(did);
}

// let didDoc = await resolveDid("did:web:0.0.0.0%3A3332:c7afd624-a18e-4716-85d9-7a0f37fd2420#key-0");

// console.log(didDoc);
