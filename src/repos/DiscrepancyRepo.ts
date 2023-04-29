



// **** Functions **** //

import { readJSON, readJSONSync } from "fs-extra";

async function parseSourceInputToCompareFormat(inputData:any){
    const {statistics} = inputData;
    return statistics;
}

async function parseExternalInputToCompareFormat(inputData:any){
    return inputData;
}


/**
 * Get by mode0
 */
async function getDataByField(mode =0){
    const externalData = readJSONSync(__dirname + '/' +'external.json');
    const sourceData = readJSONSync(__dirname + '/' +'source.json');
    const newExternalData = parseSourceInputToCompareFormat(externalData);
    const newSourceData = parseExternalInputToCompareFormat(sourceData);

    return newSourceData;
}

/**
 * Get all.
 */
async function getAll() {
  
  return getDataByField();
}



// **** Export default **** //

export default {
    getAll,
} as const;
