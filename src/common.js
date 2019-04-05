/**
 * 用于数组随机排序
 * @param a
 * @param b
 * @returns {number}
 */
function randomSort(a, b) {
    return Math.random()>0.5 ? -1 : 1;
}


/**
 * 计算数组(一维)的总和
 */
function sum(array) {
    var len = array.length;
    var sum = 0;
    for (var i=0; i<len; i++) {
        sum += array[i];
    }
    return sum;
}


/**
 * 随机获取范围整数
 * @param start 开始(包括)
 * @param end 结束(包括)
 * @returns {number}
 */
function randomInt(start, end) {
    return Math.floor(Math.random() * (end - start + 1)) + start;
}


/**
 * 获取数组前N个最大值的下标数组
 * @param arr
 * @param N
 */
function getMaxN(arr, N) {
    var indexArr = [];
    var set = {};
    for(var i=0; i<N; i++) {
        var max = Number.NEGATIVE_INFINITY;
        var maxIdx = 0;
        for (var j=0; j<arr.length; j++) {
            if (arr[j] > max && !set[j]) {
                max = arr[j];
                maxIdx = j;
            }
        }
        set[maxIdx] = true;
        indexArr.push(maxIdx);
    }
    return indexArr;
}


/**
 * push所有someArray的元素到oriArray
 */
function pushAllElem(oriArray, someArray) {
    for(var i=0; i<someArray.length; i++) {
        oriArray.push(someArray[i]);
    }
}