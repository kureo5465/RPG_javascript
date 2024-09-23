'use strict';

class SceneEvent {
    // 変数の初期化
    static options = {};

    //------------------------------------------------------------
    // 開始
    static start(gameData, userData, options) {
        this.options = options;
        GameView.add(this.tap.bind(this, gameData, userData));   // タップの登録
        GameAnim.add(this.anim.bind(this, gameData));            // アニメの登録

        if (options.town) { GameSound.play('seTown') }           // 街到着
        if (options.win) { GameSound.playBGM('bgmWin') }         // 戦闘勝利
        if (options.lose) { GameSound.playBGM('bgmLose') }       // 戦闘敗北
        if (options.winLast) { GameSound.playBGM('bgmFin') }     // 最終勝利
    }

    //------------------------------------------------------------
    // タップ
    static tap(gameData, userData, x, y, type) {
        const options = this.options;

        if (type === 'down') {
            const w = gameData.w;    // 横幅
            const h = gameData.h;    // 高さ
            const layerId = gameData.layerIds.front;   // 描画対象
            const context = gameData.canvasArr[layerId].context;  // コンテキスト
            context.clearRect(0, 0, w, h);            // 描画領域をクリア

            // 処理の分岐
            if (options.battle) {
                SceneBattle.start(gameData, userData, options.battleType);   // 戦闘開始
            } else if (options.win || options.lose) {
                SceneMap.start(gameData, userData);    // マップ
            } else if (options.winLast) {
                SceneTitle.start(gameData, userData);  // タイトル
            } else {
                SceneMap.start(gameData, userData);    // マップ開始
            }
        }
    }

    //------------------------------------------------------------
    // アニメーション
    static anim(gameData) {
        const options = this.options;
        const w = gameData.w;
        const h = gameData.h;
        const chipSize = gameData.chipSize;

        const layerId = gameData.layerIds.front;   // 描画対象
        const context = gameData.canvasArr[layerId].context;
        context.clearRect(0, 0, w, h);  // 描画領域をクリア

        // 背景描画
        context.fillStyle = '#000';    // 黒背景
        let backY = 0;
        if (options.town || options.battle) {
            backY = h * 0.1 | 0;  // 背景Yの位置変更
        }
        context.fillRect(0, backY, w, h - backY * 2);  // 塗り潰し

        // 描画用関数
        let y = h * 0.3 | 0;
        const draw = (txt, fontW) => {
            UiText.drawCenter(context, txt, w / 2 | 0, y, fontW, 'white');
            y += h * 0.2 | 0;  // Y位置移動
        };

        //------------------------------------------------------------
        // イベントごとのテキスト描画
        if (options.town) {
            // 街到着
            draw('Town', 20);
            if (options.heal) {
                draw("I healed up my HP, haha!", 10);
            }
            if (options.item !== undefined) {
                draw(`"${gameData.treasureArr[options.item]}"Getdaze! `, 10);
            }
        }
        if (options.battle) {
            // 戦闘開始
            draw('Ganba!!', 20);
            draw(gameData.enemyData[options.battleType].name + '!!!', 15);
            if (options.battleType === 'last') {
                draw('ganbaritamae', 10);
            }
        }
        if (options.win) {
            // 勝利
            y = h * 0.4 | 0;
            draw('ome----', 30);
            if (options.levelUp) {
                draw('Level UP!!', 15);
            }
        }
        if (options.lose) {
            // 敗北
            y = h * 0.4 | 0;
            draw('aho', 30);
        }
        if (options.winLast) {
            // 最終勝利
            draw('Well done!', 15);
            draw('Why are you taking this game so seriously!', 15);

            // キャラ描画
            const charaImage = GameImage.images['chara'];
            const charaSize = chipSize * 4;
            UiChip.draw(context, charaImage, chipSize, charaSize, 0, 0, (w - charaSize) / 2, y - chipSize * 1.5);
        }
    }
}
