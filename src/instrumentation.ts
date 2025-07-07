// Next.js 앱 시작시 자동으로 실행되는 파일
export async function register() {
  console.log('Next.js 앱 시작 - 서버 초기화 중...');
  console.log('현재 런타임:', process.env.NEXT_RUNTIME);
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // 서버에서만 실행

    
    try {
      const { refreshImageCache } = await import('@src/lib/driveImageServer');
      
      // 백그라운드에서 이미지 캐시 초기화 (블로킹하지 않음)
      refreshImageCache().then(() => {
        console.log('이미지 캐시 초기화 완료');
      }).catch((error) => {
        console.error('이미지 캐시 초기화 실패:', error);
      });
      
    } catch (error) {
      console.error('서버 초기화 중 오류:', error);
    }
  }
}