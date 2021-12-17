import request from '@/utils/request'


//元素操作
export function ElementAction(method, data) {
    if (method == 'get') {
        return request({
            url: '/WebUiTest/ElementAction/ElementAction/',
            method: method,
            params: data
        })
    } else {
        return request({
            url: '/WebUiTest/ElementAction/ElementAction/',
            method: method,
            data
        })
    }
}

