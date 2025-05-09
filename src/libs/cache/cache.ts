export function getCachedValidators(chainName: string) {
    const locals = localStorage.getItem(`validators-${chainName}`);
    return locals;
}