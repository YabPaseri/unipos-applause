/**
 * JSON-RPCのレスポンス
 */
export type JSONRPCResult<T> = JSONRPCSuccess<T> | JSONRPCFailed;

/**
 * JSON-RPCの成功レスポンス
 */
export type JSONRPCSuccess<T> = {
	id: string;
	status: 'success';
	result: T;
};

/**
 * JSON-RPCの失敗レスポンス
 */
export type JSONRPCFailed = {
	id: string;
	status: 'failed';
	error: {
		code: number;
		message: string;
		data?: unknown;
	};
};
