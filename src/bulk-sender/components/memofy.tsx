import React, { FunctionComponent, NamedExoticComponent } from 'react';

export const memofy = <P extends object>(
	Component: FunctionComponent<P>,
	displayName: string,
	propsAreEqual?: (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean
): NamedExoticComponent<P> => {
	const c = React.memo(Component, propsAreEqual);
	c.displayName = displayName;
	return c;
};
