import request from '@/router/axios';

export function getBillTrack(billId){
    return request({
        url: '/nursing/billtrack/listByBillId',
        method: 'get',
        params: {billId}
    });
}
export function getTaskTrack(taskId){
    return request({
        url: '/nursing/billtrack/listByTaskId',
        method: 'get',
        params: {taskId}
    });
}


export function getTrackDetail(trackId){
    return request({
        url: '/nursing/billtrack/' + trackId,
        method: 'get'
    });
}

