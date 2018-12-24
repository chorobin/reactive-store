import { Store, Dispatch } from "./store";
import * as React from "react";
import { Subscription } from "rxjs";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export const connect = <TState extends {}>(store: Store<TState>) => <TStateProps, TDispatchProps>(
  mapStateToProps: (state: TState) => TStateProps,
  mapDispatchToProps: (dispatch: Dispatch<TState>) => TDispatchProps,
) => <TProps extends TStateProps & TDispatchProps, ExternalProps = Omit<TProps, keyof TStateProps | keyof TDispatchProps>>(
  Component: React.ComponentType<TProps>,
): React.ComponentType<ExternalProps> => {
  const dispatchProps = mapDispatchToProps(store.dispatch);
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
      const WrappedComponent = (Component as unknown) as React.ComponentType<ExternalProps & TStateProps & TDispatchProps>;
      return this.state && <WrappedComponent {...this.props} {...this.state.stateProps} {...dispatchProps} />;
    }
  };
};
