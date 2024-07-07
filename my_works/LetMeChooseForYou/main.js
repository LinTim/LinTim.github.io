
// 網頁字跟隨頁面自動變化
function setRem() {
    // 獲取當前頁面的寬度
    let width = window.innerWidth;
    let height = window.innerHeight;
    // 設定頁面的字型大小
    let nowFont = height / 32;
    let minValue = 768 / 32; // width / 32
    if (width / nowFont < minValue) {
        nowFont = width / minValue;
    }
    // 通過標籤名稱來獲取元素
    let elementList = [];
    let tagNameList = ["html", "select", "button", "input"];
    tagNameList.forEach(tagName => {
        let elements = document.getElementsByTagName(tagName);
        for (let i = 0, len = elements.length; i < len; ++i) {
            elementList.push(elements[i]);
        }
    });

    // 給獲取到的元素的字型大小賦值
    elementList.forEach(c => c.style.fontSize = nowFont + "px");
};
setRem();
window.onresize = setRem;  // 監聽螢幕變化

// 更新樣式
function updateStyle(styleType) {
    if (!styleType) {
        return;
    }

    let setBGColor = (element, colorStr) => element.style.backgroundColor = colorStr;

    // 目前只有多一種樣式
    setBGColor(document.body, "#DC143C");
    setBGColor(document.getElementById("waitList"), "rgb(196, 173, 128)");
    setBGColor(document.getElementById("theButton"), "gold");
    setBGColor(document.getElementById("result"), "#FF0000");
    setBGColor(document.getElementById("doneList"), "rgb(196, 173, 128)");
};

// 隨機抽取的主程式
function main() {
    const urlParams = new URLSearchParams(window.location.search);

    // 更新樣式
    updateStyle(urlParams.get("style"));

    // 要抽選的選項們
    let opts = urlParams.get("opts");
    opts = opts ? opts.split(",") : [];

    let numRange;
    if (opts.length) {
        if (opts.length > 1) {
            numRange = opts.length;
        }
        else {
            numRange = opts[0];
            opts.length = 0;
        }
    }
    else {
        numRange = 100;
    }

    console.log("opts = ", opts);

    let canRepeat = false;

    let waitOptsNum = numRange;
    let waitListElement = document.getElementById("waitList");
    for (let i = 0; i < numRange; ++i) {
        let option = document.createElement("option");
        option.value = i + 1;
        option.innerText = opts[i] || ("選項" + option.value);
        waitListElement.appendChild(option);
    }


    let haveNumStringElement = document.getElementById("haveNum");
    haveNumStringElement.setHaveNum = num => haveNumStringElement.innerHTML = "有哪些可以抽 (剩餘數量" + num + ")";
    haveNumStringElement.setHaveNum(waitOptsNum);

    let pickedNumStringElement = document.getElementById("pickedNum");
    pickedNumStringElement.setPickedNum = num => pickedNumStringElement.innerHTML = "抽過的紀錄 (數量" + num + ")";
    pickedNumStringElement.setPickedNum(0);


    let resultElement = document.getElementById("result");
    let theButtonElement = document.getElementById("theButton");
    theButtonElement.onclick = () => {
        theButtonElement.disabled = true;

        // Generate a random time range from 290ms to 310ms
        let totalWaitTime = 290 + Math.floor(Math.random() * 20);

        // last one
        if (waitOptsNum === 1) {
            waitListElement.selectedIndex = 0;
            resultElement.innerText = "　" + waitListElement.selectedOptions[0].innerText + "　";

            var optElement = waitListElement.selectedOptions[0].cloneNode(true);
            !canRepeat && waitListElement.remove(0);
            doneListElement.appendChild(optElement);
            waitOptsNum--;
            haveNumStringElement.setHaveNum(waitOptsNum);
            pickedNumStringElement.setPickedNum(numRange);
            return
        }

        let nowWait = 10;
        let unselectFunc = (cb) => {
            waitListElement.selectedIndex = -1;
            resultElement.innerText = "　";
            setTimeout(cb, 10);
        };
        let selectFunc = () => {
            // random choose
            let randNum = Math.floor(Math.random() * waitOptsNum);
            waitListElement.selectedIndex = randNum;
            resultElement.innerText = "　" + waitListElement.selectedOptions[0].innerText + "　";

            // if wait time less than 300ms, keep going
            if (nowWait < totalWaitTime) {
                nowWait += 10;
                setTimeout(unselectFunc, ++nowWait, selectFunc);
            }
            else {
                theButtonElement.disabled = false;
                resultElement.innerText = "~=>" + resultElement.innerText + "<=~"
                var optElement = waitListElement.selectedOptions[0].cloneNode(true);
                !canRepeat && waitListElement.remove(randNum);
                doneListElement.appendChild(optElement);
                doneListElement.selectedIndex = doneListElement.options.length - 1;
                waitOptsNum--;
                haveNumStringElement.setHaveNum(waitOptsNum);
                pickedNumStringElement.setPickedNum(numRange - waitOptsNum);
            }
        };
        setTimeout(selectFunc, nowWait);
    };

    let doneListElement = document.getElementById("doneList");
}