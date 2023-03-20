export class TheChainError extends Error {
    errorIndex;

    /**
     *
     * @param {number} errorIndex
     */
    constructor (errorIndex) {
        super(`Error in the chain at index ${errorIndex}`);

        this.errorIndex = errorIndex;
    }
}