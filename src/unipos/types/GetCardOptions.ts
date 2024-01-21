/**
 * UniposAPI#getCards をする際の検索条件。  \
 * to_member_id と from_member_id が共存出来ないなど、制限はあるようだ。  \
 * しっかりとやるのであれば、JSONRPCResultのようなtype宣言が必要だが、  \
 * 調べるのも面倒くさいので全部コミコミ。
 */
export type GetCardOptions = {
	group_ids?: string[]; //       {id}の部署が関係する
	tag_name?: string; //          {name}のタグを持つ
	to_member_id?: string; //      {id}が受け取った
	from_member_id?: string; //    {id}が送った
	// 機能の提供が終了: https://support.unipos.me/hc/ja/articles/20356855590169
	// praised_member_id?: string; // {id}が拍手した
	duration?: {
		begin: number; //          {begin}から
		end: number; //            {end} までの期間
	};
};
