import * as React from "react";

export const HelloWorldComponent: React.SFC<{ sayHello: boolean; onSayHello: () => void; anotherProp: string }> = ({ sayHello, onSayHello, anotherProp }) => (
  <div>
    <button onClick={onSayHello} />
    {sayHello && "Hello!"}
    {anotherProp}
  </div>
);
