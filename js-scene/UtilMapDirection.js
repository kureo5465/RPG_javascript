'use strict';

class UtilMapDirection {
    // 方向の判定
    static check(x, y, w, h) {
        // 変数の初期化
        const rate = w / h //比率
        let direction = ''; //方向
        
        // 方向の判別 画面をxで分割して、上下のどこかを求める
        if (x / y > rate) {
            // 上か右 (Up or Right)
            if ((w - x) / y > rate) {
                direction = 'U'; // Up
            } else {
                direction = 'R'; // Right
            }
        } else {
            // 左か下 (Left or Down)
            if ((w - x) / y > rate) {
                direction = 'L'; // Left
            } else {
                direction = 'D'; // Down
            }
        }

        return direction;
    }
}



