

let bannerIds = [
    "adunit-d95b777e0a0bd132",
]

let clickBanners = [];
let commonBanner = null;

let canCreateBanner = true;
let showBannerCount: number = 0;
let hideBannerCount: number = 0;
let clickBannerMax = 7;

function getBannerId() {
    return bannerIds[0]
}

function createBanner(adUnitId: string) {
    if (!window['wx']) return

    /* if (!userStore.enableBanner) {
        return {
            destroy() { },
        }
    } */
    let wx = window["wx"];
    if (adUnitId === null || adUnitId === undefined) return
    const { windowHeight, windowWidth } = wx.getSystemInfoSync()


    let banner = wx.createBannerAd({
        adUnitId,
        style: {
            top: 100,
            left: 50,
            width: windowWidth,
        },
    })

    banner.onResize((res) => {

        banner.style.top = windowHeight - res.height;

        banner.style.left = (windowWidth - res.width) / 2;
    })
    return banner
}

function create() {
    const banner = createBanner(getBannerId())
    // banner.hide()

    return banner
}

function showBannerInArr(index: number) {
    for (let i = 0; i < clickBanners.length; i++) {
        if (i != index) {
            clickBanners[i].hide();
        } else {
            clickBanners[i].show();
        }
    }
}

function commonShow() {
    console.log("/-----show commonBanner-----/", bannerIds, canCreateBanner);
    if (!window['wx'] || bannerIds.length === 0) return;
    if (canCreateBanner) {
        if (commonBanner != null) {
            commonBanner.destroy();
            commonBanner = null;
        }
        commonBanner = create();
        commonBanner.onLoad((res) => {
            console.log('onLoad', res)
        })
        commonBanner.onError((err) => {
            console.log('bannr onerror', err);
            canCreateBanner = false;
            commonBanner = null;
            commonShow();
        });

        commonBanner.show();

        showBannerCount++;
    } else {
        if (clickBanners.length > 0) {
            let index = showBannerCount % clickBanners.length;
            showBannerInArr(index);
            showBannerCount++;
        }
    }

    /* if (maxCreateNum === 0) return;

    if (noFresh === true && clickBanners.length > 0) {
        //showBannerCount小于maxCreateNum时会创建新的广告组件，为了不刷新，重新show上次的banner
        showBannerInArr(Math.floor((clickBanners.length - 1) * Math.random()));
        return;
    }

    let index = showBannerCount % maxCreateNum;
    if (canCreateBanner) {
        if (clickBanners.length < maxCreateNum) {
            addBannrToArr(index);
            showBannerInArr(index);
            console.log("可拉取广告时创建新广告", index, showBannerCount, maxCreateNum);
        } else {
            clickBanners[clickBanners.length - 1].destroy();
            addBannrToArr(clickBanners.length - 1);
            showBannerInArr(clickBanners.length - 1);
            console.log("可拉取广告时刷新末尾广告", index, showBannerCount, maxCreateNum);
        }
    } else {
        if (clickBanners[index]) {
            showBannerInArr(index);
        }
        console.log("不可拉取广告时轮播旧广告", index, showBannerCount, maxCreateNum);
    }
    showBannerCount++; */
}

function commonHide() {
    if (!window['wx'] || bannerIds.length === 0) return;

    if (canCreateBanner) {
        if (commonBanner) {
            commonBanner.hide();
            if (hideBannerCount <= clickBannerMax) {
                hideBannerCount++;
                clickBanners[clickBanners.length] = commonBanner;
                commonBanner = null;
            }
        }
    } else {
        for (let i = 0; i < clickBanners.length; i++) {
            clickBanners[i].hide();
        }
    }

    console.log("/------commonHide-------/", clickBanners);
}

function clickShow() {
    if (!window['wx'] || clickBanners.length === 0) return;
    clickBanners[0].show();
}

function clickHide() {
    if (!window['wx'] || clickBanners.length === 0) return;
    for (let i = 0; i < clickBanners.length; i++) {
        clickBanners[i].hide();
    }
}

function clickRemove() {
    if (!window['wx'] || clickBanners.length === 0) return;
    clickBanners[0].hide();
    clickBanners[0].destroy();
    clickBanners.splice(0, 1);

    console.log("/-------clickRemove--------/", clickBanners.length, clickBanners);
}

function moveBanner(addLeft?, addTop?, isCommon = true) {
    if (isCommon) {
        addTop && (commonBanner.style.top += addTop);
        addLeft && (commonBanner.style.left += addLeft);
    } else {
        addTop && (clickBanners[0].style.top += addTop);
        addLeft && (clickBanners[0].style.left += addLeft);
    }
}

function checkClick() {
    if (window["wx"]) {
        console.log("showCrazyClickDialog", clickBanners.length);
        return clickBanners.length > 0;
    } else {
        return true;
    }
}

function gatBannerInfo(serverBannerIds: string[]) {
    bannerIds = [...serverBannerIds];
    canCreateBanner = true;
}

export default {
    gatBannerInfo,
    commonShow,
    commonHide,
    clickShow,
    clickHide,
    clickRemove,
    moveBanner,
    checkClick,
}