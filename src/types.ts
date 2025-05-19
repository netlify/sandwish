export interface Creation {
  title: string;
  author: string;
  bread: string;
  fillings: string[];
}

export type State = Creation & {
  slug: string;
};
