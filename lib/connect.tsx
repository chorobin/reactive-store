import { Store, Dispatch } from "./store";
import * as React from "react";
import { Subscription } from "rxjs";
import { Reducers } from "./reducer";
import { ActionCreator } from "./action";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type SelectorProps<TState> = { [key: string]: (state: TState) => unknown };
type ActionProps = { [key: string]: ActionCreator<string, unknown> };

const mapSelectorProps = <TState, TSelectorProps extends SelectorProps<TState>, TProps, TSelectorKeys extends keyof TProps>(
  state: TState,
  selectorProps: TSelectorProps,
) => {
  const stateProps = Object.keys(selectorProps).reduce(
    (stateProps, key) => {
      stateProps[key] = selectorProps[key](state);
      return stateProps;
    },
    {} as Pick<TProps, TSelectorKeys>,
  );
  return stateProps;
};

const mapActionProps = <TState, TReducers, TActionProps, TProps, TActionKeys extends keyof TProps>(
  store: Store<TState, TReducers>,
  actionProps: TActionProps,
) => {
  const dispatchProps = Object.keys(actionProps).reduce(
    (dispatchProps, key) => {
      dispatchProps[key] = (payload) => store.dispatch(actionProps[key](payload));
      return dispatchProps;
    },
    {} as Pick<TProps, TActionKeys>,
  );

  return dispatchProps;
};

export const connect = <TState, TReducers extends Reducers<TState>>(store: Store<TState, TReducers>) => <
  TSelectorProps extends SelectorProps<TState>,
  TActionProps extends ActionProps
>(
  stateProps: TSelectorProps,
  actionProps: TActionProps,
) => <
  TProps extends Pick<TProps, keyof TSelectorProps> & Pick<TProps, keyof TActionProps>,
  ExternalProps = Omit<TProps, keyof TSelectorProps | keyof TActionProps>
>(
  Component: React.ComponentType<TProps>,
): React.ComponentType<ExternalProps> => {
  const dispatchProps = mapActionProps<TState, TReducers, TActionProps, TProps, keyof TActionProps>(store, actionProps);

  return class extends React.Component<ExternalProps, { subscription: Subscription; stateProps: Pick<TProps, keyof TSelectorProps> }> {
    public constructor(props: ExternalProps) {
      super(props);
    }

    public componentDidMount(): void {
      store.state$.subscribe((state) => {
        this.setState({
          stateProps: mapSelectorProps<TState, TSelectorProps, TProps, keyof TSelectorProps>(state, stateProps),
        });
      });
    }

    public componentWillMount(): void {
      if (this.state && this.state.subscription) {
        this.state.subscription.unsubscribe();
      }
    }

    public render(): JSX.Element {
      const WrappedComponent = (Component as unknown) as React.ComponentType<
        ExternalProps & Pick<TProps, keyof TSelectorProps> & Pick<TProps, keyof TActionProps>
      >;
      return this.state && <WrappedComponent {...this.props} {...this.state.stateProps} {...dispatchProps} />;
    }
  };
};
