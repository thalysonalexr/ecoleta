interface Region {
  id: number;
  sigla: string;
  nome: string;
}

export interface State {
  id: number;
  sigla: string;
  nome: string;
  regiao: Region;
}
