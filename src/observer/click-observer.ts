import { ClapPlus } from '../components';
import { Options } from '../options';
import { UniposAPI } from '../unipos';
import Util, { DEBUG } from '../util';
import { ApplauseObserver } from './applause-observer';

export class ClickObserver extends ApplauseObserver {
	constructor() {
		super();
		this.clickListener = this.click.bind(this);
	}

	protected start(): boolean {
		document.body.addEventListener('click', this.clickListener);
		DEBUG.log('click observer started');
		return true;
	}
	protected stop(): void {
		document.body.removeEventListener('click', this.clickListener);
		DEBUG.log('click observer stopped');
	}

	private booked: string | undefined;

	private clickListener: (ev: MouseEvent) => void;
	private click(ev: MouseEvent) {
		if (!(ev.target instanceof HTMLElement) || !ClapPlus.is(ev.target)) return;

		ev.preventDefault();
		ev.stopPropagation();

		const card = Util.ancestor(ev.target, (e) => {
			return e.classList.contains('cardModal') || e.classList.contains('card');
		});
		if (!card) return;

		const card_id = (() => {
			if (card.id && card.id.length !== 0) return card.id;
			const id = card.querySelector('[id]')?.id;
			if (!id) return void 0;
			// classが「_base」で終わる要素は、idの末尾に「_clap_base」がついている
			return id.replace(/_clap_base$/, '');
		})();
		if (!card_id) return;

		// 非同期処理に入るので、終わるまで後続を無視する
		if (!this.booked) this.booked = card_id;
		else return;

		this.prepare().then(() => {
			this.booked = void 0;
		});
	}

	private async prepare() {
		if (!this.booked) return;

		let life = 60;

		// 送れるか否かをチェック。
		if (!Options.p.NO_CHECK) {
			const [profile, card] = await Promise.all([UniposAPI.getProfile(), UniposAPI.getCard(this.booked)]);

			// 残ポイントが0はもちろん、1でも送れない
			const available = profile.result.member.pocket?.available_point;
			if (!available || available < 2) return;

			const uid = profile.result.member.id;
			const praise = card.result.praises.find((p) => p.member.id === uid);
			if (praise) {
				if (praise.count === 60) return;
				life -= praise.count; // 上限を調整
			}
			if (life < 1) return;
		}

		const input = (() => {
			let helper: string | undefined;
			// eslint-disable-next-line no-constant-condition
			while (true) {
				const message = [`拍手をいくつ送りますか?（上限：${life}）`, helper].join('\n');
				const s = prompt(message);
				if (s === null) return null;
				const num = Util.parseInt(Util.halve(s));
				if (Number.isNaN(num)) {
					helper = '※数値を入力してください。';
					continue;
				} else if (num < 1) {
					helper = '※1以上の数値を入力してください。';
					continue;
				} else if (num > life) {
					helper = '※上限を超えています。';
					continue;
				} else {
					return num;
				}
			}
		})();
		if (!input) return;

		const divide = !Options.p.NO_SPLIT ? Util.divide(input, [5, 3, 1]) : { [input]: 1 };
		for (const d of Object.entries(divide)) {
			if (d[1] < 1) continue;
			const n = parseInt(d[0]);
			for (let i = 0; i < d[1]; i++) {
				UniposAPI.praise(this.booked, n);
			}
		}

		this.booked = void 0;
	}
}
