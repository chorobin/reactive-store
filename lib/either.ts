export type Right<T> = { readonly isLeft: false; readonly get: T };
export type Left<T> = { readonly isLeft: true; readonly get: T };
export type Either<TLeft, TRight> = Left<TLeft> | Right<TRight>;

export function isLeft<TLeft, TRight>(either: Either<TLeft, TRight>): either is Left<TLeft> {
  return either.isLeft;
}

export function isRight<TLeft, TRight>(either: Either<TLeft, TRight>): either is Right<TRight> {
  return !isLeft(either);
}

export const right: <TRight>(right: TRight) => Right<TRight> = <TRight>(right: TRight) => ({
  isLeft: false,
  get: right,
});

export const left: <TLeft>(left: TLeft) => Left<TLeft> = <TLeft>(left: TLeft) => ({
  isLeft: true,
  get: left,
});

export const foldEither = <TLeft, TRight, TSeed>(mapLeft: (left: TLeft) => TSeed, mapRight: (right: TRight) => TSeed) => (either: Either<TLeft, TRight>) => {
  if (isRight(either)) {
    return mapRight(either.get);
  } else if (isLeft(either)) {
    return mapLeft(either.get);
  }
};

export const mapEither = <TRight1, TRight2>(f: (val: TRight1) => TRight2) => <TLeft>(either: Either<TLeft, TRight1>) => {
  if (isRight(either)) {
    return right(f(either.get));
  } else if (isLeft(either)) {
    return either;
  }
};

export const flatMapEither = <TRight1, TRight2, TLeft>(f: (val: TRight1) => Either<TLeft, TRight2>) => (either: Either<TLeft, TRight1>) => {
  if (isRight(either)) {
    return f(either.get);
  } else if (isLeft(either)) {
    return either;
  }
};
