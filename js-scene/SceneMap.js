'use strict';

class SceneMap {

    static options = {
        // 変数の初期化
        keepDown: false,  //押下維持
        direction: null, //方向
        lastMove: 0, //最終移動時間
        unitTime: 300 //移動時間端子
    }
        
    // 開始
    static start(gameData, userData) {
        //("SceneMap started", { gameData, userData }); // 追加

        GameView.add(this.tap.bind(this, gameData));  // タップの再生
        GameAnim.add(this.anim.bind(this, gameData, userData)); //アニメの登録

        GameSound.playBGM('bgmMap'); //マップBGM再生
        UtilLevel.calc(gameData, userData); //計算
        UtilUrlData.save(userData); //保存
    }

    // タップ クリックの処理
    static tap(gameData, x, y, type) {
        //("Tap event", { x, y, type }); // 追加

        // 変数の初期化
        const options = this.options; //設定

        // タップの制御 押しっぱなし用の処理
        if (type === 'down') { 
            options.keepDown = true;
            //("Keep down activated"); // 追加
        }
        if (type === 'up' || type === 'leave') { 
            options.keepDown = false;
            //("Keep down deactivated"); // 追加
        }

        // 方向の判定
        options.direction = UtilMapDirection.check(x, y, gameData.w, gameData.h);
        //("Direction checked", { direction: options.direction }); // 追加
    }

    static anim(gameData, userData, time) {
        //("Animation frame", { time }); // 追加

        // 変数の初期化
        const options = this.options; //設定

        //処理と描画の実行
        UtilMapMove.move(gameData, userData, options, time); //移動
        //("Map moved", { gameData, userData, options, time }); // 追加

        UiMap.draw(gameData, userData, time); //マップと自キャラ描画
        //("Map drawn", { gameData, userData, time }); // 追加

        UiMapFull.draw(gameData, userData, time); //全体マップの描画
        //("Full map drawn", { gameData, userData }); // 追加

        UiStatus.draw(gameData, userData); //ステータスの描画
        //("Status drawn", { gameData, userData }); // 追加

        UiItem.draw(gameData, userData); //アイテムの装備
        //("Items drawn", { gameData, userData }); // 追加
    }
}
