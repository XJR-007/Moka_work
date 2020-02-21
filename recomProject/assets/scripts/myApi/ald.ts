

function sendEvent(event: string, params?: any) {
    const wx = window['wx']
    if (wx && wx.aldSendEvent) {
        if (params) {
            wx.aldSendEvent(event, params);
        } else {
            wx.aldSendEvent(event);
        }
    } else {
        console.log('analytics:', event, params)
    }
}

function onStageStart(stageId: string, stageName: string) {
    const wx = window['wx'];
    if (wx && wx.aldStage) {
        wx.aldStage.onStart({
            stageId: stageId,     //关卡ID 该字段必传
            stageName: stageName, //关卡名称  该字段必传
        })
    }
}

function onStageRunning(stageId: string, stageName: string, event: string, params: any) {
    const wx = window['wx'];
    if (wx && wx.aldStage) {
        if (params) {
            wx.aldStage.onRunning({
                stageId: stageId,     //关卡ID 该字段必传
                stageName: stageName, //关卡名称  该字段必传
                event: event,  //发起支付 关卡进行中，用户触发的操作    该字段必传
                params: params   //参数
            });
        } else {
            wx.aldStage.onRunning({
                stageId: stageId,     //关卡ID 该字段必传
                stageName: stageName, //关卡名称  该字段必传
                event: event,  //发起支付 关卡进行中，用户触发的操作    该字段必传
            });
        }
    }
}

function onStageEnd(stageId: string, stageName: string, event: string, desc: string) {
    const wx = window['wx'];
    if (wx && wx.aldStage) {
        wx.aldStage.onEnd({
            stageId: stageId,    //关卡ID 该字段必传
            stageName: stageName, //关卡名称  该字段必传
            event: event,   //关卡完成  关卡进行中，用户触发的操作    该字段必传
            params: {
                desc: desc   //描述
            }
        })
    }
}

function sendOpenid(openid: string) {
    const wx = window['wx']
    if (wx && wx.aldSendOpenid) {
        wx.aldSendOpenid(openid);
    } else {
        console.log('aldSendOpenid', openid)
    }
}

export default {
    sendEvent,
    sendOpenid,
    onStageStart,
    onStageRunning,
    onStageEnd
}