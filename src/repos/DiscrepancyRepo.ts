



// **** Functions **** //

import { readJSON, readJSONSync } from "fs-extra";

import { Player } from "@src/models/player";
import { FilterType } from "@src/models/FilterType";
import { ParsedType } from "@src/models/ParsedType";

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

function checkPlayerExist(arr: any[] , item: Player){
    for(var i = 0 ; i< arr.length;i++){
        if(arr[i].id === item.id){
            
            return i;
        } 
    }
    return -1;
}

function parsePlayerFromSource(data: any) {
    var arrUser = [];
    
    var rushingPlayers = data.rushing.players;
    var receivingPlayers = data.receiving.players;

    for(var player of rushingPlayers){
        arrUser.push({
            id: player.id,
            rushAttempts: player.attempts,
            rushTds: player.touchdowns,
            rushYdsGained: player.yards,
        })
    }

    for(var player of receivingPlayers){
        var checkExist = checkPlayerExist(arrUser, player);
        
        if(checkExist>=0){
            arrUser[checkExist] = {...arrUser[checkExist] , ...{
                rec: player.receptions,
                receivingYards: player.yards
            }}
        }else{
            arrUser.push({
                id: player.id,
                rec: player.receptions,
                receivingYards: player.yards,
            });
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
    

    for(var player of data.players){
        arrUser.push(player)
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

    var newStatistic:ParsedType = {
        home: undefined,
        away: undefined,
        homePlayers: undefined,
        awayPlayers: undefined,
        game: undefined
    };

    if(mode == FilterType.All || mode == FilterType.Team){
        newStatistic.home = parseHomeAwayFromSource(statistics.home);
        newStatistic.away = parseHomeAwayFromSource(statistics.away);
    }

    if(mode == FilterType.All || mode == FilterType.Player){
        newStatistic.homePlayers = parsePlayerFromSource(statistics.home);
        newStatistic.awayPlayers = parsePlayerFromSource(statistics.away);
    }

    if(mode == FilterType.All || mode == FilterType.Game){
        newStatistic.game = parseGameFromSource(game)
    }


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

// async function compareObject1Level(obj1:any, obj2:any){
//     var compare = {};
//     for(var key in obj1){

//     }

//     for(var key in obj2){

//     }

//     return compare;
// }


async function compareDiscrepancy(source:any, external:any , mode = 0){
    var discrepancies:any ={};
    discrepancies.id = source.game.id;
    // compare game and compare home/away statistic
    var arrToCompare = ['home','away', 'game'];
    for(var key in source){
        discrepancies[key] = {};
        if(arrToCompare.indexOf(key)>=0){
            for(var _subKey in source[key]){
                if(source[key][_subKey] != external[key][_subKey]){
                    
                    discrepancies[key][_subKey] = source[key][_subKey] +'-' + external[key][_subKey]
                }
            }
            for(var _subKey in external[key]){
                if(source[key][_subKey] != external[key][_subKey] && discrepancies[key][_subKey] == undefined ){
                    discrepancies[key][_subKey] = source[key][_subKey] +'-' + external[key][_subKey]
                }
            }
        }
    }


    // compare players
    arrToCompare = ['homePlayers','awayPlayers'];
    for(var key in source){
        
        if(arrToCompare.indexOf(key)>=0){
            discrepancies[key] = [];
            var sourceArr = source[key];
            var externalArr= external[key];
            // find player to compare
            for(var i = 0; i< sourceArr.length; i++){
                discrepancies[key].push({id:sourceArr[i].id})
                var length = discrepancies[key].length;
                for(var j = 0 ; j< externalArr.length ;j++ ){
                    if(sourceArr[i].id === externalArr[j].id){

                        for(var _subKey in sourceArr[i]){
                            if(sourceArr[i][_subKey] != externalArr[j][_subKey]){
                                discrepancies[key][length-1][_subKey] = sourceArr[i][_subKey] +'-' + externalArr[j][_subKey]
                            }
                        }

                        for(var _subKey in externalArr[j]){
                            if(sourceArr[i][_subKey] != externalArr[j][_subKey]&& discrepancies[key][length-1][_subKey]!=undefined ){
                                discrepancies[key][length-1][_subKey] = sourceArr[i][_subKey] +'-' + externalArr[j][_subKey]
                            }
                        }

                    }
                }
            }
        }
    }
    return discrepancies
}

/**
 * Get by mode0
 */
async function getDataByField(mode = 0) {
    const externalData = readJSONSync(__dirname + '/' + 'external.json');
    const sourceData = readJSONSync(__dirname + '/' + 'source.json');
    const newExternalData = await parseExternalInputToCompareFormat (externalData , mode);
    const newSourceData = await parseSourceInputToCompareFormat(sourceData , mode);
    const comparedDiscrepancies = await compareDiscrepancy(newSourceData ,newExternalData , mode);
    // return newExternalData;
    return {
        external:newExternalData,
        source: newSourceData,
        comparedDiscrepancies: comparedDiscrepancies
    };
}

/**
 * Get all.
 */
async function getAll() {

    return getDataByField();
}

async function filterByGame() {
    return getDataByField(FilterType.Game);
}

async function filterByPlayer() {
    return getDataByField(FilterType.Player);
}

async function filterByTeam() {
    return getDataByField(FilterType.Team);
}


// **** Export default **** //

export default {
    getAll,
    filterByGame,
    filterByPlayer,
    filterByTeam
} as const;
