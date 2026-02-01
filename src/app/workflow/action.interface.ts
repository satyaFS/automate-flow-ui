export interface Action {
    url:string
    type:string
    data:any
    mapping?: { [key: string]: string }
}