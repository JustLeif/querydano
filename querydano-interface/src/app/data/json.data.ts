export type Tip = {
    block: number,
    epoch: number,
    era: string,
    hash: string,
    slot: number,
    syncProgress: string
}

export type Tx = {
    hash: string,
    ix: string,
    amount: string
}