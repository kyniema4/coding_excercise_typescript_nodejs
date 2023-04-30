



// **** Functions **** //

import { readJSON, readJSONSync } from "fs-extra";

import { Player } from "@src/models/player";

/* #region Parse data for source.json */

/**
 * 
 * @param data from statistic home/away
 * @returns 
 */
function parseHomeAwayFromSource(data: any) {
    var rushingObj = data.rushing.totals;
    var receivingObj = data.receiving.totals;
    return {
        id: data.id,
        rushAttempts: rushingObj.attempts,
        rushTds: rushingObj.touchdowns,
        rushYdsGained: rushingObj.yards,
        rec: receivingObj.receptions,
        receivingYards: receivingObj.yards,
    }
}

function checkPlayerExist(arr: Player[] , item: Player){
    for(var i = 0 ; i< arr.length;i++){
        if(arr[i].id === item.id){
            
            return i;
        } 
    }
    return -1;
}

function parsePlayerFromSource(data: any) {
    var arrUser: Player[] = [];
    
    var rushingPlayers = data.rushing.players;
    var receivingPlayers = data.receiving.players;

    for(var player of rushingPlayers){
        arrUser.push(player)
    }

    for(var player of receivingPlayers){
        var checkExist = checkPlayerExist(arrUser, player);
        
        if(checkExist>=0){
            arrUser[checkExist] = {...arrUser[checkExist] , ...player}
        }else{
            arrUser.push(player);
        }
    }

    return arrUser;
}

function parseGameFromSource(data: any) {
    return {
        gameId: data.id,
        attendance: data.attendance,
    }
}
/* #endregion */

/* #region Parse data for external.json */
function parseHomeAwayFromExternal(data: any) {
    
    return {
        id: data.id,
        rushAttempts: data.rushAttempts,
        rushTds: data.rushTds,
        rushYdsGained: data.rushYdsGained,
        rec: data.rec,
        receivingYards: data.receivingYards,
    }
}

function parsePlayerFromExternal(data: any) {
    var arrUser: Player[] = [];
    
    var rushingPlayers = data.rushing.players;
    var receivingPlayers = data.receiving.players;

    for(var player of rushingPlayers){
        arrUser.push(player)
    }

    for(var player of receivingPlayers){
        var checkExist = checkPlayerExist(arrUser, player);
        
        if(checkExist>=0){
            arrUser[checkExist] = {...arrUser[checkExist] , ...player}
        }else{
            arrUser.push(player);
        }
    }

    return arrUser;
}

function parseGameFromExternal(data: any) {
    return {
        gameId: data.id,
        attendance: data.attendance,
    }
}
/* #endregion */

/**
 * parse source data to new structure that can compare with external file
 * @param inputData data from source file
 * @returns 
 */
async function parseSourceInputToCompareFormat(inputData: any , mode = 0) {
    const { statistics, game } = inputData;

    var newStatistic = {
        home: parseHomeAwayFromSource(statistics.home),
        away: parseHomeAwayFromSource(statistics.away),
        homePlayers: parsePlayerFromSource(statistics.home),
        awayPlayers: parsePlayerFromSource(statistics.away),
        game: parseGameFromSource(game)
    };


    return newStatistic;
}



/**
 * 
 * @param inputData data from external file
 * @returns 
 */
async function parseExternalInputToCompareFormat(inputData: any, mode=0) {
    const { game } = inputData;

    var newStatistic = {
        home: parseHomeAwayFromExternal(game.home),
        away: parseHomeAwayFromExternal(game.away),
        homePlayers: parsePlayerFromExternal(game.home),
        awayPlayers: parsePlayerFromExternal(game.away),
        game: parseGameFromExternal(game)
    };


    return newStatistic;
}


/**
 * Get by mode0
 */
async function getDataByField(mode = 0) {
    const externalData = readJSONSync(__dirname + '/' + 'external.json');
    const sourceData = readJSONSync(__dirname + '/' + 'source.json');
    const newExternalData = parseExternalInputToCompareFormat (externalData , mode);
    const newSourceData = parseSourceInputToCompareFormat(sourceData , mode);

    return newExternalData;
}

/**
 * Get all.
 */
async function getAll() {

    return getDataByField();
}

async function filterByGame() {
    return getDataByField(1);
}

// **** Export default **** //

export default {
    getAll,
} as const;
