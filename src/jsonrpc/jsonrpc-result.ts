export type JSONRPCResult<T> = JSONRPCSuccess<T> | JSONRPCError;

export type JSONRPCSuccess<T> = {
	id: string;
	status: 'success';
	result: T;
};

export type JSONRPCError = {
	id: string;
	status: 'error';
	error: {
		code: number;
		message: string;
		data?: unknown;
	};
};
