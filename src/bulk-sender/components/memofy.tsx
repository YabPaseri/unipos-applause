import React, { FunctionComponent, NamedExoticComponent } from 'react';

/**
 * React.memo() & set displayName
 */
export const memofy = <P extends object>(
	Component: FunctionComponent<P>,
	name: string,
	propsAreEqual?: (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean
): NamedExoticComponent<P> => {
	const c = React.memo(Component, propsAreEqual);
	c.displayName = name;
	return c;
};
