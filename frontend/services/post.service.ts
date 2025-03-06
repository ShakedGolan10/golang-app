import { axiosService } from './axios.service';

export type Post = {
  author_id: string
  id: string
  title: string
  body: string
}

const getAll = async (): Promise<Post[]> => {
  const { posts } = await axiosService.get<{ posts: Post[] }>('protected/posts');
  return posts;
};

const update = async (postToUpdate: Post): Promise<Post> => {
  const { post } = await axiosService.put<{ post: Post }>(`protected/posts/${postToUpdate.id}`, postToUpdate);
  return post;
};

const create = async (data: Omit<Post, 'id'>): Promise<Post> => {
  const { post } = await axiosService.post<{ post: Post }>('protected/posts', data);
  return post;
};

const remove = async (id: string): Promise<void> => {
  await axiosService.delete<void>(`protected/posts/${id}`);
};



export const postService = { remove, update, create, getAll }