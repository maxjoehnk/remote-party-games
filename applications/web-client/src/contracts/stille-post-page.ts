export enum PageType {
  Text = 'text',
  Draw = 'draw',
}

export interface StillePostPage {
  type: PageType;
  bookId: string;
  previous: {
    type: PageType;
    bookId: string;
    content: string;
  };
}

export interface Book {
  id: string;
  pages: Page[];
}

export interface Page {
  playerId: string;
  type: PageType;
  content: string;
}
