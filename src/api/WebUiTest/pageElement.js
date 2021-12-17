import request from '@/utils/request'


//页面
export function Page(method, data) {
    if (method == 'get') {
        return request({
            url: '/WebUiTest/PageElement/Page/',
            method: method,
            params: data
        })
    } else {
        return request({
            url: '/WebUiTest/PageElement/Page/',
            method: method,
            data
        })
    }
}

//页面元素
export function PageElement(method, data) {
    if (method == 'get') {
        return request({
            url: '/WebUiTest/PageElement/PageElement/',
            method: method,
            params: data
        })
    } else {
        return request({
            url: '/WebUiTest/PageElement/PageElement/',
            method: method,
            data
        })
    }
}

