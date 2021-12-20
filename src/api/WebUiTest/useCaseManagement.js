import request from '@/utils/request'


//用例内容
export function UseCase(method, data) {
    if (method == 'get') {
        return request({
            url: '/WebUiTest/UseCase/UseCase/',
            method: method,
            params: data
        })
    } else {
        return request({
            url: '/WebUiTest/UseCase/UseCase/',
            method: method,
            data
        })
    }
}

//用例操作步骤
export function UseCaseStep(method, data) {
    if (method == 'get') {
        return request({
            url: '/WebUiTest/UseCase/UseCaseStep/',
            method: method,
            params: data
        })
    } else {
        return request({
            url: '/WebUiTest/UseCase/UseCaseStep/',
            method: method,
            data
        })
    }
}

//用例调试
export function RunUseCase(method, data) {
    if (method == 'get') {
        return request({
            url: '/WebUiTest/UseCase/RunUseCase/',
            method: method,
            params: data
        })
    } else {
        return request({
            url: '/WebUiTest/UseCase/RunUseCase/',
            method: method,
            data
        })
    }
}


