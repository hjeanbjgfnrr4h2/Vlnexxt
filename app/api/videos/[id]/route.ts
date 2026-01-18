import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { videoUpdateSchema } from '@/lib/validations/video';
import { generateUniqueSlug } from '@/lib/slug';
import { VideoStatus } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const video = await prisma.video.findUnique({
      where: { id },
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
                parentId: true,
              },
            },
          },
        },
      },
    });

    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    const transformedVideo = {
      ...video,
      tags: video.tags.map((vt) => vt.tag),
      categories: video.categories.map((vc) => vc.category),
    };

    return NextResponse.json(transformedVideo);
  } catch (error) {
    console.error('Error fetching video:', error);
    return NextResponse.json(
      { error: 'Failed to fetch video' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const existingVideo = await prisma.video.findUnique({
      where: { id },
    });

    if (!existingVideo) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    const validation = videoUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      );
    }

    const data = validation.data;

    let slug = existingVideo.slug;
    if (data.slug && data.slug !== existingVideo.slug) {
      const slugExists = await prisma.video.findFirst({
        where: {
          slug: data.slug,
          id: { not: id },
        },
      });
      
      if (slugExists) {
        return NextResponse.json(
          { error: 'Slug already exists' },
          { status: 400 }
        );
      }
      slug = data.slug;
    } else if (data.title && data.title !== existingVideo.title && !data.slug) {
      slug = await generateUniqueSlug(data.title, 'video', id);
    }

    const { tagIds, categoryIds, publishedAt, ...videoData } = data;

    interface UpdateData {
      title?: string;
      content?: string;
      slug: string;
      iframeUrl?: string;
      seoTitle?: string | null;
      seoDescription?: string | null;
      seoKeywords?: string | null;
      seoIndex?: boolean;
      seoFollow?: boolean;
      canonicalUrl?: string | null;
      status?: VideoStatus;
      publishedAt?: Date | null;
      tags?: {
        deleteMany: Record<string, never>;
        create: Array<{
          tag: {
            connect: { id: string };
          };
        }>;
      };
      categories?: {
        deleteMany: Record<string, never>;
        create: Array<{
          category: {
            connect: { id: string };
          };
        }>;
      };
    }

    const updateData: UpdateData = {
      ...videoData,
      slug,
    };

    if (publishedAt !== undefined) {
      updateData.publishedAt = publishedAt ? new Date(publishedAt) : null;
    }

    if (tagIds !== undefined) {
      updateData.tags = {
        deleteMany: {},
        create: tagIds.map((tagId) => ({
          tag: {
            connect: { id: tagId },
          },
        })),
      };
    }

    if (categoryIds !== undefined) {
      updateData.categories = {
        deleteMany: {},
        create: categoryIds.map((categoryId) => ({
          category: {
            connect: { id: categoryId },
          },
        })),
      };
    }

    const video = await prisma.video.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json(transformedVideo);
  } catch (error) {
    console.error('Error updating video:', error);
    return NextResponse.json(
      { error: 'Failed to update video' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const existingVideo = await prisma.video.findUnique({
      where: { id },
    });

    if (!existingVideo) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    await prisma.video.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Video deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting video:', error);
    return NextResponse.json(
      { error: 'Failed to delete video' },
      { status: 500 }
    );
  }
}
