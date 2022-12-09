import { Controller } from '@nestjs/common';
import { Get, Param, Post, Body, Delete, Query } from '@nestjs/common';
import { PostsService } from '../services/posts.service';
import { PostDto } from '../dto/post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Get()
  async getPosts() {
    const posts = await this.postService.getPosts();
    return posts;
  }
  @Get(':postId')
  async getCourse(@Param('postId') postId) {
    const post = await this.postService.getPost(postId);
    return post;
  }

  @Post()
  async addPost(@Body() CreatePostDto: PostDto) {
    const post = await this.postService.addPost(CreatePostDto);
    return post;
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    const post = await this.postService.deletePost(id);
    return post;
  }
}
