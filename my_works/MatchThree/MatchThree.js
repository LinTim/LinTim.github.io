// 可以再更新的東西
// 1. 換成 class 分門別類
// 2. 加入一些選項 (e.g. 調整寬高數量、調整顏色數量、...)
// 3. 要判斷目前還能不能動，不能動的時候應該要可以重置
// 4. ...


/*===== 基本參數 =====*/
let theWidth = 7;     /* 陣列寬 */
let theHeight = 7;    /* 陣列高 */

// 動畫時間 ms
const ANIM_TIME = 500;

function getTDSize() {
    // 目前畫面大小
    let resultWidth = window.innerWidth / 10;
    let resultheight = window.innerHeight / 9;

    return resultWidth > resultheight ? resultheight : resultWidth
}
let resultTDSize = getTDSize();

// 格子大小
let TD_SIZE = {
    WIDTH: resultTDSize,
    HEIGHT: resultTDSize
};

// 格與格之間的間距
let TD_GAP = resultTDSize / 6;

let TD_OFFSET_SIZE = {
    WIDTH: TD_SIZE.WIDTH + TD_GAP,
    HEIGHT: TD_SIZE.HEIGHT + TD_GAP,
}

let TD_ELAPSED_SIZE = {
    WIDTH: TD_OFFSET_SIZE.WIDTH / ANIM_TIME,
    HEIGHT: TD_OFFSET_SIZE.HEIGHT / ANIM_TIME,
}

// table 的 css class 名稱們
const TABLE_CSS_CLASS_NAME = {
    SELECTABLE_TABLE: "selectableTable",
    COLOR_TABLE: "colorTable",
    ANIM_TABLE: "animTable",
};

// td 的 css class 名稱們
const TD_CSS_CLASS_NAME = {
    // 是否選擇
    SELECTED: "selected",
    UNSELECTED: "unselected",

    // TD 內部顏色
    RED: "red",
    YELLOW: "yellow",
    GREEN: "green",
    BLUE: "blue",
    AQUA: "Aqua"
};

let colorClassNameList = [
    TD_CSS_CLASS_NAME.RED,
    // TD_CSS_CLASS_NAME.YELLOW,
    TD_CSS_CLASS_NAME.GREEN,
    TD_CSS_CLASS_NAME.BLUE,
    // TD_CSS_CLASS_NAME.AQUA
]

let numOfColor = colorClassNameList.length;

// 無限模式 (TODO: 還能有至少連續 n 次的選項?)
let isInfiniteMode = false;

// 拿來存遊戲的 div
let baseDiv;

// 存各個 td 的 array
let tdObj2DArray;

// 拿來放置選項們
let checkboxObj = {};

let main = function () {
    // 重置整個頁面
    baseDiv = initAndGetBaseDiv();
    baseDiv.className = "baseDiv";

    // 初始化陣列
    tdObj2DArray = initDataArray();

    // 初始化表格
    initTable();

    // 填入顏色
    initColorTable();

    // 加入選項
    {
        // 先找目前上方高度
        let curTableHeight = document.getElementsByClassName(TABLE_CSS_CLASS_NAME.SELECTABLE_TABLE)[0].clientHeight;

        let checkboxDiv = document.createElement("div");
        baseDiv.append(checkboxDiv);

        // 先插入一個 div 調整尺寸，讓後面的東西可以放在表格的下方
        let spaceDiv = document.createElement("div");
        spaceDiv.style.height = curTableHeight + TD_GAP + "px";
        checkboxDiv.append(spaceDiv);

        // 是否為無限模式
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "infiniteMode";
        checkboxDiv.append(checkbox);

        let label = document.createElement("label");
        label.for = "infiniteMode";
        label.innerText = "Infinite Mode";
        label.style.fontSize = curTableHeight / 20 + "px";
        checkboxDiv.append(label);

        checkboxObj.infiniteMode = checkbox;
    }
}

/*===== 前置作業 =====*/
let initAndGetBaseDiv = function () {
    // 建立 css
    let myStyle = document.getElementById("myStyle");
    myStyle.textContent = `
        /* base div 設定 */
        div.baseDiv {
            display: flex;
            justify-content: center;
        }

        /* table 設定 */
        table {
            position: absolute;
        }
        table.${TABLE_CSS_CLASS_NAME.SELECTABLE_TABLE} {
            border: 1px solid #000000;
        }
        table.${TABLE_CSS_CLASS_NAME.COLOR_TABLE} {
            border: 1px solid #FFFFFF;
        }
        table.${TABLE_CSS_CLASS_NAME.ANIM_TABLE} {
            border: 1px solid #FFFFFF;
        }

        /* td 基本設定 */
        td {
            border: 3px solid #CCCCCC66;
            width: ${TD_SIZE.WIDTH}px;
            height: ${TD_SIZE.HEIGHT}px;
            text-align: center; 
            vertical-align: middle;
        }

        /* td 外框設定 */
        td.${TD_CSS_CLASS_NAME.UNSELECTED} {
        }
        td.${TD_CSS_CLASS_NAME.SELECTED} {
            border: 3px solid #000000;
        }

        /* td 內容顏色 */
        td.${TD_CSS_CLASS_NAME.RED} {
            background-color: #FF6666;
        }
        td.${TD_CSS_CLASS_NAME.YELLOW} {
            background-color: #FFFF66;
        }
        td.${TD_CSS_CLASS_NAME.GREEN} {
            background-color: #66FF66;
        }
        td.${TD_CSS_CLASS_NAME.BLUE} {
            background-color: #6666FF;
        }
        td.${TD_CSS_CLASS_NAME.AQUA} {
            background-color: #66FFFF;
        }
    `;

    let baseDiv = document.getElementById("baseDiv");
    baseDiv.innerText = "";

    return baseDiv;
};


/*===== 建立基本表格 =====*/

// 存 td 們的 2D array
let initDataArray = function () {
    let the2DArray = [];
    for (let i = 0; i < theHeight; i++) {
        the2DArray.push([]);
        for (let j = 0; j < theWidth; j++) {
            the2DArray[i].push({
                col: j,
                row: i,
            });
        }
    }
    return the2DArray;
};

// 要記錄的東西
let isRunning = false;  /* 判斷可否點擊 */
let isSelected = false; /* 是否已選擇某一個 td */
let lastCell = null;    /* 上一個選擇的 td */

// td 按下去要做的事
let tdClicked = function (theCell) {
    if (isRunning) {
        return;
    }

    let selectableTable = TABLE_CSS_CLASS_NAME.SELECTABLE_TABLE;

    theCell[selectableTable].className = TD_CSS_CLASS_NAME.SELECTED;

    if (isSelected) {
        // 這裡如果未來有 lastCell === undefined 的時候 要再另外處理 (目前表格不會改變所以不會有)
        if (lastCell.movableCellList.indexOf(theCell) === -1 || lastCell === theCell) {
            // 不是跟旁邊對換 或 一樣 就直接重置
            theCell[selectableTable].className = TD_CSS_CLASS_NAME.UNSELECTED;
            lastCell[selectableTable].className = TD_CSS_CLASS_NAME.UNSELECTED;
        }
        else {
            // 設置 flag
            isRunning = true;

            // 重置 & 開啟點擊
            let resetClickable = () => {
                theCell[selectableTable].className = TD_CSS_CLASS_NAME.UNSELECTED;
                lastCell[selectableTable].className = TD_CSS_CLASS_NAME.UNSELECTED;
                isRunning = false;
                // console.log("resetClickable");
            };

            // 動畫結束後要做的 callback
            let swapCallback = () => {
                // 檢查是否成功消除
                if (isMatched()) {
                    window.setTimeout(() => {
                        let cleanRecursive = () => {
                            // 先清掉消除的
                            let tableClassName = TABLE_CSS_CLASS_NAME.COLOR_TABLE;
                            tdObj2DArray.forEach(row => {
                                row.forEach(cell => {
                                    if (cell.readyToCleanFlag) {
                                        cell[tableClassName].className = "";
                                        cell.readyToCleanFlag = CLEAN_TYPE.NONE;
                                    }
                                });
                            });

                            // 讓上面的掉下來
                            doFallAnimation(() => {
                                window.setTimeout(() => {
                                    if (isMatched()) {
                                        // 確認是不是無限模式
                                        isInfiniteMode = checkboxObj.infiniteMode.checked;
            
                                        cleanRecursive();
                                    }
                                    else {
                                        // 都沒得消才重置
                                        resetClickable();
                                    }
                                }, ANIM_TIME / 2);
                            });
                        };

                        cleanRecursive();
                    }, ANIM_TIME / 2);
                }
                else {
                    // 失敗就 換回去 & 重置 & 開啟點擊
                    swapAnimation(theCell, lastCell, resetClickable, 2);
                }
            }

            // 做動畫
            swapAnimation(theCell, lastCell, swapCallback);
        }
    }
    else {
        // 非選過 要記下當前的 td
        lastCell = theCell;
    }

    // 反轉 flag
    isSelected = !isSelected;
}

let initTable = function () {
    let tableClassNameList = [
        TABLE_CSS_CLASS_NAME.COLOR_TABLE,
        TABLE_CSS_CLASS_NAME.ANIM_TABLE,
        TABLE_CSS_CLASS_NAME.SELECTABLE_TABLE
    ];
    tableClassNameList.forEach(tableClassName => {
        // 列表
        let table = document.createElement("table");
        table.className = tableClassName;
        baseDiv.append(table);

        // 建立 NxN 的表格
        tdObj2DArray.forEach((row, i) => {
            // 建立 tr
            let tr = document.createElement("tr");
            table.append(tr);

            // 建立 td
            row.forEach((cell, j) => {
                // 建立 td
                let td = document.createElement("td");
                tr.append(td);

                // 依照各類型設置 td
                switch (tableClassName) {
                    case TABLE_CSS_CLASS_NAME.COLOR_TABLE:
                        break;
                    case TABLE_CSS_CLASS_NAME.ANIM_TABLE:
                        break;
                    case TABLE_CSS_CLASS_NAME.SELECTABLE_TABLE:
                        td.className = TD_CSS_CLASS_NAME.UNSELECTED;
                        td.addEventListener("click", () => tdClicked(cell));

                        // 同時加入八個方位的 td
                        let lastRow = tdObj2DArray[i - 1];
                        let nextRow = tdObj2DArray[i + 1];
                        let aroundCellList = cell.aroundCellList = [];
                        aroundCellList[DIRECTION.TOP_LEFT] = lastRow && lastRow[j - 1];
                        aroundCellList[DIRECTION.TOP] = lastRow && lastRow[j];
                        aroundCellList[DIRECTION.TOP_RIGHT] = lastRow && lastRow[j + 1];
                        aroundCellList[DIRECTION.LEFT] = row[j - 1];
                        aroundCellList[DIRECTION.CENTER] = cell;
                        aroundCellList[DIRECTION.RIGHT] = row[j + 1];
                        aroundCellList[DIRECTION.DOWN_LEFT] = nextRow && nextRow[j - 1];
                        aroundCellList[DIRECTION.DOWN] = nextRow && nextRow[j];
                        aroundCellList[DIRECTION.DOWN_RIGHT] = nextRow && nextRow[j + 1];

                        // 另外加入 可移動的四個方位 td (方便後面運算)
                        cell.movableCellList = [
                            aroundCellList[DIRECTION.TOP],
                            aroundCellList[DIRECTION.LEFT],
                            aroundCellList[DIRECTION.RIGHT],
                            aroundCellList[DIRECTION.DOWN]
                        ];

                        // td.innerText = cell.row * 7 + cell.col; /* 測試用 */
                        break;
                }

                // 另外把 td 加入 cell
                cell[tableClassName] = td;
            });
        });
    });
};


/*===== 初始化有顏色的表格 =====*/
let initColorTable = function () {
    // 先初始化全部的 initRejectColorList
    tdObj2DArray.forEach(row => row.forEach(cell => cell.initRejectColorList = []));
    
    let tableClassName = TABLE_CSS_CLASS_NAME.COLOR_TABLE;
    tdObj2DArray.forEach(row => {
        row.forEach(cell => {
            let td = cell[tableClassName];

            // 先隨機選色
            let randomValue = Math.floor(Math.random() * numOfColor);
            let color = colorClassNameList[randomValue];

            // 如果是禁止的顏色 要更新顏色 (這裡直接往後選)
            for (let i = 1; i < numOfColor; i++) {
                if (cell.initRejectColorList.indexOf(color) === -1) {
                    break;
                }
                color = colorClassNameList[(randomValue + i) % numOfColor];
            }

            // 填上顏色
            td.className = color;

            // 設置 其他格子 在初始化時 不能成為某種顏色
            // 因為初始化的方向是 左至右 & 上至下，所以只要設定 RIGHT & DOWN，需要用來檢查的為 TOP, TOP_RIGHT & LEFT
            let aroundCellList = cell.aroundCellList;

            let leftCell = aroundCellList[DIRECTION.LEFT];
            let leftColorCell = leftCell && leftCell[tableClassName] || {};

            let topCell = aroundCellList[DIRECTION.TOP];
            let topColorCell = topCell && topCell[tableClassName] || {};

            let topRightCell = aroundCellList[DIRECTION.TOP_RIGHT];
            let topRightColorCell = topRightCell && topRightCell[tableClassName] || {};

            // 若 左與中為同色 或 上與右上與中為同色 則 右的禁止色加入該色
            if (leftColorCell.className === color || (topColorCell.className === color && topRightColorCell.className === color)) {
                let rightCell = aroundCellList[DIRECTION.RIGHT];
                rightCell && rightCell.initRejectColorList.push(color);
            }

            // 若 上與中為同色 則 下的禁止色加入該色
            if (topColorCell.className === color) {
                let downCell = aroundCellList[DIRECTION.DOWN];
                downCell && downCell.initRejectColorList.push(color);
            }
        });
    });
};


/*===== 執行動畫 =====*/
let swapAnimation = function (element, element2, finishCallback, speed = 1) {
    let start, previousTimeStamp;

    // 先取出要用的東西
    let rowDiff = element.row - element2.row;
    let colDiff = element.col - element2.col;

    let animObj = element[TABLE_CSS_CLASS_NAME.COLOR_TABLE];
    let animObj2 = element2[TABLE_CSS_CLASS_NAME.COLOR_TABLE];

    function step(timestamp) {
        if (start === undefined) {
            start = timestamp;
        }
        const elapsed = (timestamp - start) * speed;

        if (previousTimeStamp !== timestamp) {
            // Math.min() is used here to make sure the element stops at exactly ???px
            const widthCount = Math.min(TD_ELAPSED_SIZE.WIDTH * elapsed, TD_OFFSET_SIZE.WIDTH);
            const heightCount = Math.min(TD_ELAPSED_SIZE.HEIGHT * elapsed, TD_OFFSET_SIZE.HEIGHT);
            animObj.style.transform = `translate(${-colDiff * widthCount}px, ${-rowDiff * heightCount}px)`;
            animObj2.style.transform = `translate(${colDiff * widthCount}px, ${rowDiff * heightCount}px)`;
        }

        // Stop the animation after ???ms
        if (elapsed < ANIM_TIME) {
            previousTimeStamp = timestamp;
            window.requestAnimationFrame(step);
        }
        else {
            // 重置顏色
            let temp = animObj.className;
            animObj.className = animObj2.className;
            animObj2.className = temp;

            // 重置位置
            animObj.style.transform = "";
            animObj2.style.transform = "";

            // 做交換結束後要處理的事情
            finishCallback && finishCallback();
        }
    }

    window.requestAnimationFrame(step);
};

// 落下的動畫
let doFallAnimation = function (finishCallback) {
    let tableClassName = TABLE_CSS_CLASS_NAME.COLOR_TABLE;
    let animTableClassName = TABLE_CSS_CLASS_NAME.ANIM_TABLE;

    let animCount = 0;
    let animFunc = function (cell, offsetYCount, color, speed = 1) {
        let start, previousTimeStamp;
        animCount++;

        // 記下顏色，清空自己
        let fallingColor;
        let targetCell = cell;
        if (color) {
            fallingColor = color;
        }
        else {
            fallingColor = cell[tableClassName].className;
            cell[tableClassName].className = "";
            
            // 找到落點
            for (let i = offsetYCount; i > 0; i--) {
                targetCell = targetCell.aroundCellList[DIRECTION.DOWN];
            }
        }
        
        // 設置落點 顏色 & 位置
        let totalHeight = offsetYCount * TD_OFFSET_SIZE.HEIGHT;
        let elapsedHeight = totalHeight / ANIM_TIME / ANIM_TIME; // 改成等加速度，原本是 offsetYCount * TD_ELAPSED_SIZE.HEIGHT;
        let animObj = targetCell[animTableClassName];
        animObj.className = fallingColor;
        animObj.style.transform = `translateY(${-totalHeight}px)`;

        // 距離公式
        function calDistance (elapsed) {
            return totalHeight - Math.min(elapsedHeight * elapsed * elapsed, totalHeight); // 改成等加速度，原本是 elapsedHeight * elapsed
        }

        // 動畫
        function step (timestamp) {
            if (start === undefined) {
                start = timestamp;
            }
            const elapsed = (timestamp - start) * speed;
    
            if (previousTimeStamp !== timestamp) {
                const heightCount = calDistance(elapsed);
                animObj.style.transform = `translateY(${-heightCount}px)`;
            }

            // Stop the animation after ???ms
            if (elapsed < ANIM_TIME) {
                previousTimeStamp = timestamp;
                window.requestAnimationFrame(step);
            }
            else {
                targetCell[tableClassName].className = fallingColor;

                animObj.style.transform = "";
                animObj.className = "";

                if (!--animCount) {
                    finishCallback();
                }
            }

        }

        window.requestAnimationFrame(step);
    }

    // 無限模式直接到另一個算出不會停下的顏色
    let color2Darray;
    if (isInfiniteMode) {
        color2Darray = getInfiniteColor2DArray();
        
        // 要先清掉 flag & nextColor
        tdObj2DArray.forEach(row => {
            row.forEach(cell => {
                cell.readyToCleanFlag = CLEAN_TYPE.NONE;
                cell.nextColor = null;
            });
        });
    }

    // 先算出要落下多遠
    let fallingCountList = new Array(theWidth).fill(0);
    for (let i = theHeight - 1; i >= 0; i--) {
        for (let j = 0; j < theWidth; j++) {
            let cell = tdObj2DArray[i][j];
            if (!cell[tableClassName].className) {
                fallingCountList[j]++;
            }
            else if (fallingCountList[j]) {
                // 做落下的動作
                animFunc(cell, fallingCountList[j]);
            }
        }
    }
    
    // 被消除的要另外補上
    if (color2Darray) {
        fallingCountList.forEach((yCount, j) => {
            for (let i = 0; i < yCount; i++) {
                animFunc(tdObj2DArray[i][j], yCount, color2Darray[i][j]);
            }
        });
    }
    else {
        fallingCountList.forEach((yCount, j) => {
            for (let i = 0; i < yCount; i++) {
                animFunc(tdObj2DArray[i][j], yCount, colorClassNameList[Math.floor(Math.random() * numOfColor)]);
            }
        });
    }
};

// 確認 cell 是否有成功消除 (這裡直接進行全版面檢查，若是之後想要優化效能，再另外做單獨部分檢查)
let isMatched = function () {
    let tableClassName = TABLE_CSS_CLASS_NAME.COLOR_TABLE;

    let isSuccess = false;
    tdObj2DArray.forEach(row => {
        row.forEach(cell => {
            // 處理 row & col
            let directionList = [DIRECTION.LEFT, DIRECTION.TOP];
            let flagList = [CLEAN_TYPE.ROW, CLEAN_TYPE.COL];
            directionList.forEach((direction, i) => {
                let theFlag = flagList[i];
                let firstSameColorObj;

                // 持續 往左 or 往上 檢查
                for (let cur = cell; cur; cur = cur.aroundCellList[direction]) {
                    let nextCell = cur.aroundCellList[direction];
                    if (!nextCell) {
                        break;
                    }

                    if ((cur.nextColor || cur[tableClassName].className) === (nextCell.nextColor || nextCell[tableClassName].className)) {
                        if (nextCell.readyToCleanFlag & theFlag) {
                            cell.readyToCleanFlag |= theFlag;
                            break;
                        }
        
                        if (firstSameColorObj) {
                            if (!isSuccess) {
                                isSuccess = true;
                            }
                            cell.readyToCleanFlag |= theFlag;
                            firstSameColorObj.readyToCleanFlag |= theFlag;
                            nextCell.readyToCleanFlag |= theFlag;
                            break;
                        }
                        else {
                            firstSameColorObj = nextCell;
                        }
                    }
                    else {
                        break;
                    }
                }
            });

            // TODO: 處理方格(4個)的?
        });
    });
    return isSuccess;
};

// 取得可以持續消除不中斷的顏色
let getInfiniteColor2DArray = function () {
    let tableClassName = TABLE_CSS_CLASS_NAME.COLOR_TABLE;

    // 先算出要落下多遠
    let fallingCountList = new Array(theWidth).fill(0);
    for (let i = theHeight - 1; i >= 0; i--) {
        for (let j = 0; j < theWidth; j++) {
            let cell = tdObj2DArray[i][j];
            if (!cell[tableClassName].className) {
                fallingCountList[j]++;
            }
            else if (fallingCountList[j]) {                
                // 找到落點
                let targetCell = cell;
                for (let i = fallingCountList[j]; i > 0; i--) {
                    targetCell = targetCell.aroundCellList[DIRECTION.DOWN];
                }

                // 紀錄落下的顏色
                targetCell.nextColor = cell[tableClassName].className;
            }
        }
    }

    // 產生隨機落下的陣列
    fallingCountList.forEach((yCount, j) => {
        for (let i = 0; i < yCount; i++) {
            tdObj2DArray[i][j].nextColor = colorClassNameList[Math.floor(Math.random() * numOfColor)];
        }
    });

    // 有得消除，就回傳可消除的顏色
    if (isMatched()) {
        return tdObj2DArray.map(row => row.map(cell => cell.nextColor));
    }

    // 沒得消除，繼續算
    return getInfiniteColor2DArray();
};

const DIRECTION = {
    TOP_LEFT: 0,
    TOP: 1,
    TOP_RIGHT: 2,
    LEFT: 3,
    CENTER: 4,
    RIGHT: 5,
    DOWN_LEFT: 6,
    DOWN: 7,
    DOWN_RIGHT: 8
};

const CLEAN_TYPE = {
    NONE: 0,
    ROW: 1,
    COL: 1 << 1,
    BLOCK: 1 << 2
};

// 執行主程式
main();
