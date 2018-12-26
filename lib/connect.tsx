import { Store } from "./store";
import * as React from "react";
import { Subscription } from "rxjs";
import { Reducers, PayloadOfReducer } from "./reducer";
import { ActionCreator, PayloadOfActionCreator } from "./action";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

type ActionProps<TState, TReducers extends Reducers<TState>> = { [key: string]: ActionCreator<string, PayloadOfReducer<TReducers[keyof TReducers]>> };

type MapActionProps<TState, TReducers extends Reducers<TState>, TDispatchProps extends ActionProps<TState, TReducers>> = {
  [K in keyof TDispatchProps]: (payload: PayloadOfActionCreator<TDispatchProps[K]>) => void
};

const mapActionProps = <TState, TReducers extends Reducers<TState>>(store: Store<TState, TReducers>, actionProps: ActionProps<TState, TReducers>) => {
  let dispatchProps: MapActionProps<TState, TReducers, ActionProps<TState, TReducers>> = {};

  for (const key in actionProps) {
    dispatchProps[key] = (payload) => {
      const action = actionProps[key](payload);
      store.dispatch(action as any);
    };
  }

  return dispatchProps;
};

export const connect = <TState, TReducers extends Reducers<TState>>(store: Store<TState, TReducers>) => <
  TStateProps,
  TActionProps extends ActionProps<TState, TReducers>
>(
  mapStateToProps: (state: TState) => TStateProps,
  actionProps: TActionProps,
) => <TProps extends TStateProps & MapActionProps<TState, TReducers, TActionProps>, ExternalProps = Omit<TProps, keyof TStateProps | keyof TActionProps>>(
  Component: React.ComponentType<TProps>,
): React.ComponentType<ExternalProps> => {
  const dispatchProps = mapActionProps(store, actionProps);

  return class extends React.Component<ExternalProps, { subscription: Subscription; stateProps: TStateProps }> {
    public constructor(props: ExternalProps) {
      super(props);
    }

    public componentDidMount(): void {
      store.state$.subscribe((state) => {
        this.setState({
          stateProps: mapStateToProps(state),
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
        ExternalProps & TStateProps & MapActionProps<TState, TReducers, ActionProps<TState, TReducers>>
      >;
      return this.state && <WrappedComponent {...this.props} {...this.state.stateProps} {...dispatchProps} />;
    }
  };
};
