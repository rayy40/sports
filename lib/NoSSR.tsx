import dynamic from "next/dynamic";
import React, { PropsWithChildren } from "react";
const NoSSRWrapper = (props: PropsWithChildren) => (
  <React.Fragment>{props.children}</React.Fragment>
);
export default dynamic(() => Promise.resolve(NoSSRWrapper), {
  ssr: false,
});
