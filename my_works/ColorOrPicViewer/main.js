
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


let elem = document.documentElement;

/* View in fullscreen */
function openFullscreen() {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
    }
}

/* Close fullscreen */
function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
    }
}

// 主程式
function main() {
    // 設定視窗
    let mainForm = document.getElementById("mainForm");
    let isOpened = true;

    // 設定視窗隱藏時點擊畫面可開啟
    document.addEventListener("click", function () {
        if (!isOpened) {
            mainForm.hidden = false;
            isOpened = true;
        }
    });

    // 全螢幕
    let fullScreenBtn = document.getElementById("fullScreenBtn");
    fullScreenBtn.onclick = function () {
        if (fullScreenBtn.value === "進入全螢幕") {
            fullScreenBtn.value = "離開全螢幕";
            openFullscreen();
        } else {
            fullScreenBtn.value = "進入全螢幕";
            closeFullscreen();
        }
    };

    // 上傳圖片
    document.getElementById("imgUploade").onchange = function () {
        if (this.files && this.files[0]) {
            let reader = new FileReader();
            reader.onload = function (e) {
                let img = document.getElementById("img");
                img.src = e.target.result;
                img.hidden = false;
            }
            reader.readAsDataURL(this.files[0]);
        }
    };

    // 按鈕隱藏設定視窗
    document.getElementById("hiddenBtn").onclick = function () {
        mainForm.hidden = true;
        setTimeout(() => isOpened = false);
    };

    // 解析網址參數
    const urlParams = new URLSearchParams(window.location.search);

    let color = urlParams.get("color");
    if (color) {
        mainForm.hidden = true;
        isOpened = false;

        // 更新樣式
        document.body.style.backgroundColor = color;
    }
}