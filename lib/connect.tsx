import { Store } from "./store";
import * as React from "react";
import { Subscription } from "rxjs";
import { Reducers } from "./reducer";
import { PayloadOfActionCreator } from "./action";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

type MapActionProps<TActionProps> = { [K in keyof TActionProps]: (payload: PayloadOfActionCreator<TActionProps[K]>) => void };

type SelectorProps<TState> = { [key: string]: (state: TState) => unknown };

const mapSelectorProps = <TState, TStateProps extends SelectorProps<TState>>(state: TState, stateProps: TStateProps) => {
  const props: any = {};

  for (const key in stateProps) {
    const selector = stateProps[key];
    props[key] = selector(state);
  }

  return props;
};

const mapActionProps = <TState, TReducers, TActionProps>(store: Store<TState, TReducers>, actionProps: TActionProps) => {
  const dispatchProps: any = {};

  for (const key in actionProps) {
    dispatchProps[key] = (payload) => {
      const action = (actionProps[key] as any)(payload);
      store.dispatch(action as any);
    };
  }

  return dispatchProps;
};

export const connect = <TState, TReducers extends Reducers<TState>>(store: Store<TState, TReducers>) => <
  TSelectorProps extends SelectorProps<TState>,
  TActionProps
>(
  stateProps: TSelectorProps,
  actionProps: TActionProps,
) => <
  TProps extends Pick<TProps, keyof TSelectorProps> & MapActionProps<TActionProps>,
  ExternalProps = Omit<TProps, keyof TSelectorProps | keyof TActionProps>
>(
  Component: React.ComponentType<TProps>,
): React.ComponentType<ExternalProps> => {
  const dispatchProps = mapActionProps(store, actionProps);

  return class extends React.Component<ExternalProps, { subscription: Subscription; stateProps: Pick<TProps, keyof TSelectorProps> }> {
    public constructor(props: ExternalProps) {
      super(props);
    }

    public componentDidMount(): void {
      store.state$.subscribe((state) => {
        this.setState({
          stateProps: mapSelectorProps(state, stateProps),
        });
      });
    }

    public componentWillMount(): void {
      if (this.state && this.state.subscription) {
        this.state.subscription.unsubscribe();
      }
    }

    public render(): JSX.Element {
      const WrappedComponent = (Component as unknown) as React.ComponentType<ExternalProps & Pick<TProps, keyof TSelectorProps> & MapActionProps<TActionProps>>;
      return this.state && <WrappedComponent {...this.props} {...this.state.stateProps} {...dispatchProps} />;
    }
  };
};
