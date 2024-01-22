import { Connection } from './Connection';

export abstract class ServiceWorkerBase {
	constructor(protected readonly connection: Connection) {}
	abstract setup(): this;
}
