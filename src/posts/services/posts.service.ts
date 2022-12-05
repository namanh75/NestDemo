import { EntityManager, EntityRepository, MikroORM } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { Post } from '../entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
    @InjectRepository(Post)
    private postRepository: EntityRepository<Post>,
  ) {}
  posts = [
    {
      id: 1,
      title: 'Chúng tôi là ai?',
      description:
        'Sun Asterisk chứa đựng ước mơ và mục tiêu kiến tạo nên thật nhiều những điều tốt đẹp cho xã hội của tập thể những chiến binh mặt trời.',
      author: 'Sun*',
      url: 'https://sun-asterisk.vn/ve-chung-toi/',
    },
    {
      id: 2,
      title: 'Chúng tôi làm gì?',
      description:
        'Là một Digital Creative Studio, Sun* luôn đề cao tinh thần làm chủ sản phẩm, tư duy sáng tạo trong mỗi dự án để mang đến những trải nghiệm "Awesome" nhất cho end-user',
      author: 'Sun*',
      url: 'https://sun-asterisk.vn/creative-engineering/',
    },
  ];

  async getPosts(): Promise<Post[]> {
    return await this.postRepository.findAll();
  }

  async getPost(postId: Number): Promise<any> {
    let id = Number(postId);
    var data = await this.postRepository.findOne(id);
    return data;
  }

  async addPost(post: CreatePostDto): Promise<Post> {
    if (!post.id || !post.title) {
      throw new HttpException('ID or TITLE is emmty', HttpStatus.BAD_REQUEST);
    } else {
      const { id, title, description, author, url } = post;
      const data = new Post(id, title, description, author, url);
      await this.postRepository.persistAndFlush(data);
      return data;
    }
  }

  deletePost(postId): Promise<any> {
    let id = Number(postId);
    return new Promise((resolve) => {
      let index = this.posts.findIndex((post) => post.id === id);
      if (index === -1) {
        throw new HttpException('Post not found', 404);
      }
      this.posts.splice(index, 1);
      resolve(this.posts);
    });
  }
}
