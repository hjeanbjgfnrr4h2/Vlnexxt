import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const thumbnailSchema = z.object({
  thumbnailOriginal: z.string().optional().nullable(),
  thumbnailLarge: z.string().optional().nullable(),
  thumbnailMedium: z.string().optional().nullable(),
  thumbnailSmall: z.string().optional().nullable(),
  thumbnailLazy: z.string().optional().nullable(),
});

export async function POST(
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

    const body = await request.json();
    
    const validation = thumbnailSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      );
    }

    const data = validation.data;

    if (!data.thumbnailOriginal && !data.thumbnailLarge && !data.thumbnailMedium && 
        !data.thumbnailSmall && !data.thumbnailLazy) {
      return NextResponse.json(
        { error: 'At least one thumbnail field is required' },
        { status: 400 }
      );
    }

    interface ThumbnailUpdateData {
      thumbnailOriginal?: string | null;
      thumbnailLarge?: string | null;
      thumbnailMedium?: string | null;
      thumbnailSmall?: string | null;
      thumbnailLazy?: string | null;
    }

    const updateData: ThumbnailUpdateData = {};
    
    if (data.thumbnailOriginal !== undefined) {
      updateData.thumbnailOriginal = data.thumbnailOriginal;
    }
    if (data.thumbnailLarge !== undefined) {
      updateData.thumbnailLarge = data.thumbnailLarge;
    }
    if (data.thumbnailMedium !== undefined) {
      updateData.thumbnailMedium = data.thumbnailMedium;
    }
    if (data.thumbnailSmall !== undefined) {
      updateData.thumbnailSmall = data.thumbnailSmall;
    }
    if (data.thumbnailLazy !== undefined) {
      updateData.thumbnailLazy = data.thumbnailLazy;
    }

    const video = await prisma.video.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        slug: true,
        thumbnailOriginal: true,
        thumbnailLarge: true,
        thumbnailMedium: true,
        thumbnailSmall: true,
        thumbnailLazy: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(video);
  } catch (error) {
    console.error('Error uploading thumbnail:', error);
    return NextResponse.json(
      { error: 'Failed to upload thumbnail' },
      { status: 500 }
    );
  }
}
