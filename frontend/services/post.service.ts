import { axiosService } from './axios.service';

export type Post = {
  author_id: string
  id: string
  title: string
  body: string
}

const getAll = async (): Promise<Post[]> => {
  const posts = await axiosService.get<Post[]>('protected/posts');
  return posts;
};

const update = async (post: Post): Promise<Post> => {
  const updatedPost = await axiosService.put<Post>(`protected/posts/${post.id}`, post);
  return updatedPost;
};

const create = async (data: Omit<Post, 'id'>): Promise<Post> => {
  const newPost = await axiosService.post<Post>('protected/posts', data);
  return newPost;
};

const remove = async (id: string): Promise<void> => {
  await axiosService.delete<void>(`protected/posts/${id}`);
};



export const postService = { remove, update, create, getAll }