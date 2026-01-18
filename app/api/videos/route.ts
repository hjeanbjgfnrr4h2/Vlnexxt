import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { videoSchema } from '@/lib/validations/video';
import { generateUniqueSlug } from '@/lib/slug';
import { VideoStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const perPage = Math.min(100, Math.max(1, parseInt(searchParams.get('perPage') || '10')));
    const status = searchParams.get('status') as VideoStatus | null;
    const categoryId = searchParams.get('categoryId');
    const tagId = searchParams.get('tagId');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc';
    const search = searchParams.get('search');

    const skip = (page - 1) * perPage;

    interface WhereClause {
      status?: VideoStatus;
      categories?: {
        some: {
          categoryId: string;
        };
      };
      tags?: {
        some: {
          tagId: string;
        };
      };
      OR?: Array<{
        title?: { contains: string; mode: 'insensitive' };
        content?: { contains: string; mode: 'insensitive' };
        seoTitle?: { contains: string; mode: 'insensitive' };
      }>;
    }

    const where: WhereClause = {};

    if (status && ['DRAFT', 'PUBLISHED', 'SCHEDULED'].includes(status)) {
      where.status = status;
    }

    if (categoryId) {
      where.categories = {
        some: {
          categoryId,
        },
      };
    }

    if (tagId) {
      where.tags = {
        some: {
          tagId,
        },
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { seoTitle: { contains: search, mode: 'insensitive' } },
      ];
    }

    type OrderByField = 'createdAt' | 'updatedAt' | 'publishedAt' | 'viewCount' | 'title';
    const orderBy: Record<string, 'asc' | 'desc'> = {};
    if (['createdAt', 'updatedAt', 'publishedAt', 'viewCount', 'title'].includes(sortBy)) {
      orderBy[sortBy as OrderByField] = sortOrder;
    } else {
      orderBy.createdAt = 'desc';
    }

    const [videos, total] = await Promise.all([
      prisma.video.findMany({
        where,
        include: {
          tags: {
            include: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
          categories: {
            include: {
              category: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
        orderBy,
        skip,
        take: perPage,
      }),
      prisma.video.count({ where }),
    ]);

    const transformedVideos = videos.map((video) => ({
      ...video,
      tags: video.tags.map((vt) => vt.tag),
      categories: video.categories.map((vc) => vc.category),
    }));

    return NextResponse.json({
      data: transformedVideos,
      pagination: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validation = videoSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      );
    }

    const data = validation.data;

    let slug = data.slug;
    if (!slug) {
      slug = await generateUniqueSlug(data.title, 'video');
    } else {
      const existingVideo = await prisma.video.findUnique({
        where: { slug },
      });
      if (existingVideo) {
        return NextResponse.json(
          { error: 'Slug already exists' },
          { status: 400 }
        );
      }
    }

    const { tagIds, categoryIds, ...videoData } = data;

    const video = await prisma.video.create({
      data: {
        ...videoData,
        slug,
        publishedAt: videoData.publishedAt ? new Date(videoData.publishedAt) : null,
        tags: {
          create: tagIds.map((tagId) => ({
            tag: {
              connect: { id: tagId },
            },
          })),
        },
        categories: {
          create: categoryIds.map((categoryId) => ({
            category: {
              connect: { id: categoryId },
            },
          })),
        },
      },
      include: {
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        categories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    const transformedVideo = {
      ...video,
      tags: video.tags.map((vt) => vt.tag),
      categories: video.categories.map((vc) => vc.category),
    };

    return NextResponse.json(transformedVideo, { status: 201 });
  } catch (error) {
    console.error('Error creating video:', error);
    return NextResponse.json(
      { error: 'Failed to create video' },
      { status: 500 }
    );
  }
}
