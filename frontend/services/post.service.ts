import { axiosService } from './axios.service';

export type Post = {
  author_id: string
  id: string
  title: string
  body: string
}

const getAllPost = async (): Promise<Post[]> => {
  const posts = await axiosService.get<Post[]>('protected/posts');
  return posts;
};

const updatePost = async (post: Post): Promise<Post> => {
  const updatedPost = await axiosService.put<Post>(`protected/posts/${post.id}`, post);
  return updatedPost;
};

const createPost = async (data: Omit<Post, 'id'>): Promise<Post> => {
  const newPost = await axiosService.post<Post>('protected/posts', data);
  return newPost;
};

const deletePost = async (id: string): Promise<void> => {
  await axiosService.delete<void>(`protected/posts/${id}`);
};



export const postService = { deletePost, updatePost, createPost, getAllPost }