// 服务器节点(下标代表服务器, 值代表服务器处理任务的速度)
var SERVER_LIST = [1, 2, 3];
// 任务列表(下标代表任务, 值代表任务执行时长)
var TASK_LIST = [2, 4, 8, 13, 5, 2];
// 染色体复制比例
var COPY_RATE = 0.2;

/**
 * 初始化染色体(即可行方案)
 * @returns 生成的染色体数量, 即chromosomeMatrix的长度
 */
function initChromosome(num) {
    var chromosomeMatrix = [];
    var task_len = TASK_LIST.length;
    var server_len = SERVER_LIST.length;
    var copy_servers = [];
    Object.assign(copy_servers, SERVER_LIST);
    // 随机分配任务给任意的服务器
    for (var c=0; c<num; c++) {
        // 染色体, 下标代表任务编号, 值代表服务器, 如[1],代表编号为0的task,由1号服务器处理
        var chromosome = [];
        // 随机抽取一个任务给随机一台服务器处理
        copy_servers.sort(randomSort);
        for (var i=0; i<task_len; i++) {
            chromosome.push(randomInt(0, server_len - 1));
        }
        chromosomeMatrix.push(chromosome);
    }
    return chromosomeMatrix;
}


/**
 * 计算每条染色体的适应度(由最终执行的时长决定, 执行的时长越长, 适应度越低)
 * @param chromosomeMatrix 染色体矩阵
 * @returns 适应读度矩阵
 */
function calAdaptability(chromosomeMatrix) {
    var adaptabilityMatrix = [];
    var tasksTotalDuration = sum(TASK_LIST);
    // 遍历矩阵，计算出每条染色体执行任务的最终时长
    for (var i=0; i<chromosomeMatrix.length; i++) {
        // 下标代表任务编号, 值代表服务器编号
        var chromosome = chromosomeMatrix[i];
        var maxDuration = 0;
        // 建立一个数组, 用来保存每个服务器执行任务的总时长, 因为同个服务器可能会执行多个任务
        var temp = {};
        for (var j=0; j<chromosome.length; j++) {
            // 当前任务的执行时长
            var taskDuration = TASK_LIST[j];
            // 当前服务器的处理速度
            var dealSpeed = SERVER_LIST[chromosome[j]];
            // 当前服务器处理当前任务需要的总时间
            var curDuration = taskDuration / dealSpeed;
            // 当前服务器执行总时长
            temp[chromosome[j]] = (temp[chromosome[j]] || 0) + curDuration;

            if (temp[chromosome[j]] > maxDuration) {
                maxDuration = temp[chromosome[j]];
            }
        }
        // 适应度标准: 任务总时长 / 当前染色体执行任务的最终时长
        // console.log(maxDuration);
        adaptabilityMatrix.push(tasksTotalDuration / maxDuration);
    }
    return adaptabilityMatrix;
}


/**
 * 计算每条染色体的自然选择概率
 * @param adaptabilityMatrix 适应度矩阵
 */
function calSelectionProbability(adaptabilityMatrix) {
    var probabilityMatrix = [];
    var all = sum(adaptabilityMatrix);
    for (var i=0; i<adaptabilityMatrix.length; i++) {
        probabilityMatrix.push(adaptabilityMatrix[i] / all);
    }
    return probabilityMatrix;
}


/**
 * 生成下一代染色体
 * @param chromosomeMatrix 染色体矩阵
 * @param adaptabilityMatrix 适应度矩阵
 * @param probabilityMatrix 自然选择概率
 * @param iterNum 迭代次数
 */
function createGeneration(chromosomeMatrix, adaptabilityMatrix, probabilityMatrix, iterNum) {
    var chrMat;
    for (var i=0; i<iterNum; i++) {
        var chrLen = chromosomeMatrix.length;
        var copyNum = Math.floor(chrLen * COPY_RATE);
        var crossNum = chrLen - copyNum;
        // 复制
        chrMat = copy(chromosomeMatrix, adaptabilityMatrix, copyNum);
        // 交叉
        var crossResults = cross(chromosomeMatrix, probabilityMatrix, crossNum);
        pushAllElem(chrMat, crossResults);
        // 变异
        mutation(chrMat, 1);
        // console.log(`第${i+1}代适应度:`, calAdaptability(chrMat));
    }
    return chrMat;
}


/**
 * 复制N条适应性最好的染色体，让他们成为下一代,(N = 染色体数量 * copyRate)
 * @param chromosomeMatrix 染色体矩阵
 * @param adaptabilityMatrix 适应度矩阵
 * @param copyNum 复制数目
 * @return 新的染色体矩阵
 */
function copy(chromosomeMatrix, adaptabilityMatrix, copyNum) {
    var maxIdxs = getMaxN(adaptabilityMatrix, copyNum);
    var newChrMatrix = [];
    for (var i=0; i<maxIdxs.length; i++) {
        newChrMatrix.push(chromosomeMatrix[maxIdxs[i]].slice(0));
    }
    return newChrMatrix;
}


/**
 * 染色体交叉
 */
function cross(chromosomeMatrix, probabilityMatrix, crossNum) {
    var matrix = [];
    for (var i=0; i<crossNum; i++) {
        var mother = chromosomeMatrix[rws(probabilityMatrix)].slice(0);
        var father = chromosomeMatrix[rws(probabilityMatrix)].slice(0);
        var randomIndex = randomInt(0, mother.length - 1);

        mother.splice(randomIndex);
        var crossResult = mother.concat(father.slice(randomIndex));
        matrix.push(crossResult);
    }
    return matrix;
}

/**
 * 变异, 此方法在原有矩阵基础上作修改
 * @param chromosomeMatrix 染色体矩阵
 * @param num 变异次数
 */
function mutation(chromosomeMatrix, num) {

    for (var i=0; i<num; i++) {
        var randomIndex = randomInt(0, chromosomeMatrix.length - 1);
        var randomTask = randomInt(0, TASK_LIST.length - 1);
        var randomServer = randomInt(0, SERVER_LIST.length - 1);
        var mutationOrigin = chromosomeMatrix[randomIndex];
        // console.log('改变前:', chromosomeMatrix, '改变:', randomIndex, randomTask, randomServer);
        mutationOrigin[randomTask] = randomServer;
        // console.log('改变后:', chromosomeMatrix);
    }
}




/**
 * 轮盘赌算法获取染色体下标
 */
function rws(probabilityMatrix) {
    var rand = Math.random();
    var sum = 0;
    for (var i=0; i<probabilityMatrix.length; i++) {
        sum += probabilityMatrix[i];
        if (sum >= rand) {
            return i;
        }
    }
}