import { NextRequest, NextResponse } from 'next/server';
import { getAllFreelancerCategories } from '@/app/controllers/freelancer-profile.controller';



export async function GET(req: NextRequest) {
  try {
    const result = await getAllFreelancerCategories();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}