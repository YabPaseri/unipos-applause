import { CardModalObserver } from './observer/card-modal-observer';
import { ClickObserver } from './observer/click-observer';
import { DisableObserver } from './observer/disable-observer';
import { HoverObserver } from './observer/hover-observer';
import { Observers } from './observer/observers';
import { PageObserver } from './observer/page-observer';
import { Options } from './options';
import { DEBUG } from './util';

(async () => {
	await Options.load();
	Options.p.save();
	DEBUG.log('extension loaded');

	const obss = new Observers() //
		.add(new DisableObserver())
		.add(new HoverObserver())
		.add(new CardModalObserver())
		.add(new ClickObserver())
		.add(new PageObserver());

	let failed = true;
	for (let i = 0; i < Options.p.TRY_LIMIT; i++) {
		if (i !== 0) await new Promise((ok) => setTimeout(ok, Options.p.TRY_INTERVAL));
		if (obss.observe()) {
			failed = false;
			break;
		}
	}
	if (failed) {
		obss.disconnect();
		DEBUG.log('extension stopped.');
	}
})();
