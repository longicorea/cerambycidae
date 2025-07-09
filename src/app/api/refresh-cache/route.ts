import {refreshImageCache} from "@src/lib/driveImageServer";
import {NextResponse} from "next/server";

export async function GET() {
  try {
    console.log("서버 초기화 - 이미지 캐시 갱신 시작...");
    // 백그라운드에서 이미지 캐시 초기화 (블로킹하지 않음)
    const result = await refreshImageCache()
    return NextResponse.json({result:"OK"});
  } catch (error) {
    console.error('서버 초기화 중 오류:', error);
    return NextResponse.json({result:"ERROR",error
    });
  }
}