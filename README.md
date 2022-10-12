# Advanced Unipos

「Advanced Unipos」は、Unipos (https://unipos.me/) 用の Chrome 拡張機能です。

## 機能

### フッター

「Advanced Unipos」の操作の基点です。一括拍手とサポートのボタンが配置されています。
![footer](https://raw.githubusercontent.com/yabpaseri/advanced-unipos/resource/screenshot/readme/footer.png)

### サポートボタン

Unipos のサポートボタンを非表示にし、代わりのボタンをフッター上に表示します。ボタン押下によって表示されるダイアログに、違いはありません。

### 一括拍手

入力された条件に基づく投稿に対して、拍手を行います。
![window](https://raw.githubusercontent.com/yabpaseri/advanced-unipos/resource/screenshot/readme/window.png)
総使用ポイント数・各投稿に送るポイント数を設定して「送る」を押下することで、指定された分のポイントを使い切るまで、新着投稿から順に拍手を送ります。
対象とする投稿には、幾つかの条件を付けることができます。

## ビルド

0. `node.js@16.13.1` の導入
1. `git clone`
2. クローンしたフォルダ内で `npm install`
3. `npm run build`
