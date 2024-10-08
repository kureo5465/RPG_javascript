'use strict';

class UtilBattleProcess {
	// 進行
	static next(gameData, userData, options) {
		// 変数の初期化
		const enemy = options.enemyData;

		// 分岐処理
		if (options.state === 'select') {
			// 自分が選択した後
			options.state = 'enemy';	// 進行を「敵」に

			// 死亡判定
			if (enemy.hp === 0) {
				// 敵死亡時
				this.next(gameData, userData, options);		// 次の処理に送る
				return;
			}

			options.actionType  = enemy.skill;			// 技
			options.actionLevel = enemy.level;			// レベル
			options.selectTime = GameAnim.time.sum;		// 選択時間

			UtilBattleData.calc(gameData, userData, options, 'enemy');	// 敵計算
			GameSound.play('seAt');		// 攻撃SE

		} else if (options.state === 'enemy') {
			// 敵が行動した後

			// 処理の分岐
			if (userData.hp === 0) {
				// 自分のHPが0
				options.state = 'end';	// 進行を「終了」に

				// 経験値の獲得
				const levelUp = UtilLevel.addExp(gameData, userData,
						enemy.hpMax / 20 | 0);

				// 敗北から復帰時の値
				userData.hp = 20;	// HP
				userData.mp = 20;	// MP

				// 一定時間後にイベントに移行
				const eventOpt = {lose: 1, levelUp: levelUp};		// 敗北
				setTimeout(() => SceneEvent.start(gameData, userData, eventOpt), 800);

			} else if (enemy.hp === 0) {
				// 敵のHPが0
				options.state = 'end';	// 進行を「終了」に
				let eventOpt;		// イベント用設定

				if (options.type === 'last') {
					// 最終戦闘で勝利した
					userData.setStart(gameData);	// 初期状態に
					UtilUrlData.save(userData);		// 保存
					eventOpt = {winLast: 1};		// 最終勝利
				} else {
					// 通常戦闘で勝利した

					// 経験値の獲得
					const levelUp = UtilLevel.addExp(gameData, userData,
							enemy.hpMax / 10 | 0);
					eventOpt = {win: 1, levelUp: levelUp};	// 勝利
				}

				// 一定時間後にイベントに移行
				setTimeout(() => SceneEvent.start(gameData, userData, eventOpt), 800);

			} else {
				// 戦闘継続
				options.state = 'menu';	// メニュー受け付け
			}
		}
	};
}
