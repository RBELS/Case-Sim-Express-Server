export type CaseType = {
    _id: string
    id: number
    name: string
    avatar: string
    price: number
    ext: string
    show: boolean
    items: CaseItemType[]
}

export type CaseItemType = {
    id: number
    name: string
    price: number
    quality: number
    chance: number
}

export type SendItemType = CaseItemType & {
    avatar: string
    rowid: number
    sold: boolean
}