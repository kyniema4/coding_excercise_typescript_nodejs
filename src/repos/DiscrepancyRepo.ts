



// **** Functions **** //

import { readJSON, readJSONSync } from "fs-extra";

import { Player } from "@src/models/player";

/* #region Parse data for source.json */
function parseHomeAwayFromSource(data: any) {
    return {
        rushAttempts: 0,
        rushTds: 0,
        rushYdsGained: 0,
        rec: 0,
        receivingYards: 0,
    }
}

function parsePlayerFromSource(data: any) {
    var arrUser: Player[] = [];
    
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
        rushAttempts: 0,
        rushTds: 0,
        rushYdsGained: 0,
        rec: 0,
        receivingYards: 0,
    }
}

function parsePlayerFromExternal(data: any) {

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
        players: parsePlayerFromSource(statistics),
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
    return inputData;
}


/**
 * Get by mode0
 */
async function getDataByField(mode = 0) {
    const externalData = readJSONSync(__dirname + '/' + 'external.json');
    const sourceData = readJSONSync(__dirname + '/' + 'source.json');
    const newExternalData = parseSourceInputToCompareFormat(externalData , mode);
    const newSourceData = parseExternalInputToCompareFormat(sourceData , mode);

    return newSourceData;
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
