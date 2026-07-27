// Disjuntor técnico, não limite de produto — a landing promete "sem limite
// de itens" e nenhuma vendedora real chega perto disso (a maioria tem
// 10-50 itens). Só existe pra travar um bug ou script que tentasse criar
// itens sem fim, o que travaria o painel e a vitrine no celular.
export const LIMITE_ITENS_POR_LOJA = 1000
