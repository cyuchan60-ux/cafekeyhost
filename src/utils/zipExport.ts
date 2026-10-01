import JSZip from 'jszip';

/**
 * 프로젝트의 주요 소스 파일들을 fetch하여 ZIP으로 묶고 다운로드합니다.
 * Vite dev 서버 환경에서는 /src/... 경로로 직접 파일을 가져올 수 있습니다.
 */
export async function downloadProjectZip(): Promise<void> {
  const zip = new JSZip();

  // 포함할 소스 파일 목록 (Vite raw import를 사용)
  const sourceFiles: { path: string; content: string }[] = [];

  // 각 파일을 동적으로 import (raw text)
  const modules = import.meta.glob(
    [
      '/src/**/*.tsx',
      '/src/**/*.ts',
      '/src/**/*.css',
      '/index.html',
      '/package.json',
      '/tsconfig.json',
      '/tsconfig.app.json',
      '/tsconfig.node.json',
      '/vite.config.ts',
      '/README.md',
    ],
    { as: 'raw', eager: false }
  );

  for (const [filePath, loader] of Object.entries(modules)) {
    try {
      const content = (await loader()) as string;
      // /src/... → src/... (zip 내부 경로)
      const zipPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
      sourceFiles.push({ path: zipPath, content });
    } catch {
      // 로드 실패 시 스킵
    }
  }

  // zip에 파일 추가
  for (const { path, content } of sourceFiles) {
    zip.file(path, content);
  }

  // 이미지 파일 추가 (binary)
  const imageModules = import.meta.glob('/src/assets/images/*', {
    eager: false,
  });

  for (const [filePath, loader] of Object.entries(imageModules)) {
    try {
      const mod = (await loader()) as { default: string };
      // mod.default는 data URL 또는 asset URL
      const url = mod.default;
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const zipPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
      zip.file(zipPath, arrayBuffer);
    } catch {
      // 로드 실패 시 스킵
    }
  }

  // ZIP 생성 및 다운로드
  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'campus-cafe-kiosk-vscode.zip';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
