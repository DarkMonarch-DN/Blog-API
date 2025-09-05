import { Post } from '@prisma/client';

export type TResponsePostList = {
  data: Post[];
  total: number;
  page: number;
  limit: number;
};
