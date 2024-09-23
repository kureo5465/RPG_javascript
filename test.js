'use strict';

// テスト用の仮データを用意
const gameData = {
    chipSize: 32,
    w: 640,
    h: 480,
    layerId: {
        middle: 0,
        front: 1,
    },
    canvasArr: [
        { context: document.getElementById('gameCanvas').getContext('2d') },
        { context: document.getElementById('gameCanvas').getContext('2d') }
    ]
};

const options = {
    enemyRect: {
        x: 100,
        y: 50,
        w: 320,
        h: 240
    },
    state: 'enemy',
    actionType: 'Attack',
    enemyData: {
        name: 'Goblin',
        level: 3,
        hp: 50,
        hpMax: 100,
        at: 10,
        df: 5,
        image: 0 // 仮のキャラ画像位置
    }
};

const time = {
    sum: 0
};

// UtilBattleBase クラスの定義
class UtilBattleBase {
    static draw(gameData, options, time) {
        // 変数の初期化
        const chipSize = gameData.chipSize; // チップサイズ
        const rect = options.enemyRect; // 敵矩形

        // 描画の初期化
        const layerId = gameData.layerId.middle; //描画対象
        const context = gameData.canvasArr[layerId].context; //コンテキスト
        context.save(); // 保存
        context.translate(rect.x, rect.y); //原点移動
        UiWin.drawWin(context, 0, 0, rect.w, rect.h); //ウィンドウ描画 (修正: rect.h)

        // 自ダメージ演出(赤くする)
        if (options.state == 'enemy') {
            context.globalAlpha = 0.5; // 半透明
            context.fillStyle = '#f00'; // ダメージ色の赤
            context.fillRect(0, 0, rect.w, rect.h); // 敵矩形内を塗りつぶし
            context.globalAlpha = 1; // 透明度を戻す
        }

        // 敵ステータスの描画
        const enemy = options.enemyData; // 敵値
        const text = `${enemy.name} Lv ${enemy.level}`
            + ` HP ${enemy.hp} / ${enemy.hpMax}`
            + ` AT ${enemy.at} DF ${enemy.df}`;
        Uitext.drawCenter(context, text, rect.w / 2 | 0, 12, 5, 'white'); // 文字列描画

        // 揺れ演出
        let moveX = 0; // 座標位置移動X
        let moveY = 0; // 座標位置移動Y
        if (options.state !== 'menu' && options.actionType !== 'Heal') {
            moveX = ((time.sum / 50 | 0) * 17 % 4) - 2; // 揺れX
            moveY = ((time.sum / 50 | 0) * 31 % 4) - 2; // 揺れY
        }

        // キャラクターの描画の初期化
        const refX = enemy.image; // キャラ参照位置X
        const refY = 1; // キャラ参照位置Y
        const charaImage = GameImage.image['chara'];
        const drawSize = chipSize * 9; // 敵描画サイズ
        const drawX = ((rect.w - drawSize) / 2 | 0) + moveX; // 敵描画X
        const drawY = ((rect.w - drawSize) / 2 | 0) + moveY; // 敵描画Y

        // キャラの描画
        UiChip.draw(
            context, charaImage, chipSize, drawSize, // 基本情報
            refX, refY, drawX, drawY // 座標情報
        );

        // 原点復帰
        context.restore();
    }
}

// 簡単な描画をテスト
function testDraw() {
    UtilBattleBase.draw(gameData, options, time);
}

// アニメーションループの設定
function gameLoop(timestamp) {
    time.sum = timestamp;
    testDraw();
    requestAnimationFrame(gameLoop);
}

// アニメーションを開始
requestAnimationFrame(gameLoop);

// 必要なクラス定義
class UiWin {
    static drawWin(context, x, y, w, h) {
        context.strokeStyle = 'blue';
        context.strokeRect(x, y, w, h);
    }
}

class Uitext {
    static drawCenter(context, text, x, y, size, color) {
        context.fillStyle = color;
        context.font = `${size * 4}px sans-serif`;
        context.textAlign = 'center';
        context.fillText(text, x, y);
    }
}

class UiChip {
    static draw(context, image, chipSize, drawSize, refX, refY, drawX, drawY) {
        context.fillStyle = 'green'; // 仮の色
        context.fillRect(drawX, drawY, drawSize, drawSize); // 仮の描画
    }
}

class GameImage {
    static image = {
        'chara': new Image() // 仮の画像データ
    };
}
