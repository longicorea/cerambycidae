import { NextRequest } from 'next/server'
import axios from 'axios'

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const url = searchParams.get('url')

    if (!url) {
        return new Response(JSON.stringify({ error: 'Missing URL parameter' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        })
    }

    try {
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': req.headers.get('user-agent') || '',
                'Referer': 'https://www.google.com',
            },
        })

        const contentType = response.headers['content-type'] || 'image/jpeg'
        return new Response(response.data, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400',
            },
        })
    } catch (error) {
        console.error('이미지 프록시 오류:', error)
        return new Response(JSON.stringify({ error: '이미지 로드 실패' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        })
    }
}