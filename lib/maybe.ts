export type Just<T> = { readonly isNothing: boolean; get: T };
export type Nothing = { readonly isNothing: boolean };
export type Maybe<T> = Just<T> | Nothing;

export const just: <T>(get: T) => Just<T> = <T>(get: T) => ({
  isNothing: false,
  get,
});

export const nothing: Nothing = { isNothing: true };

export function isJust<T>(maybe: Maybe<T>): maybe is Just<T> {
  return !maybe.isNothing;
}

export const foldMaybe = <T, U>(defaultValue: U, f: (get: T) => U) => (maybe: Maybe<T>) => {
  let result = defaultValue;
  if (isJust(maybe)) {
    result = f(maybe.get);
  }
  return result;
};

export const maybe = <T>(get: T) => (get ? just(get) : nothing);
export const mapMaybe = <T, U>(f: (get: T) => U) => foldMaybe(nothing as Maybe<U>, (get: T) => just(f(get)));
export const filterMaybe = <T>(f: (get: T) => boolean) => foldMaybe(nothing as Maybe<T>, (get: T) => (f(get) ? just(get) : nothing));
export const flatMapMaybe = <T, U>(f: (get: T) => Maybe<U>) => foldMaybe(nothing, f);
export const fromMaybe = <T>(defaultValue: T) => foldMaybe(defaultValue, (get: T) => get);
